import secrets
from datetime import date, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List, Optional
from . import models, schemas, database, auth

router = APIRouter(prefix="/coach", tags=["Coach Portal"])

def get_current_coach(current_user: models.User = Depends(auth.get_current_user)) -> models.User:
    if current_user.role != "coach":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access restricted to Coach accounts only."
        )
    return current_user

@router.api_route("/invite-code", methods=["GET", "POST"])
def get_or_generate_invite_code(
    db: Session = Depends(database.get_db),
    coach: models.User = Depends(get_current_coach)
):
    if coach.invite_code:
        return {"invite_code": coach.invite_code, "is_active": True}

    if not coach.is_coach_active:
        return {
            "invite_code": None,
            "is_active": False,
            "message": "يتطلب تفعيل اشتراك ورخصة المدرب لإصدار كود المتدربين الخاص بك."
        }

    while True:
        code = f"COACH-{secrets.token_hex(4).upper()}"
        existing = db.query(models.User).filter(models.User.invite_code == code).first()
        if not existing:
            break
    coach.invite_code = code
    coach.is_coach_active = True
    db.commit()
    db.refresh(coach)
    return {"invite_code": coach.invite_code, "is_active": True}

@router.post("/activate")
def activate_coach_license(
    req: schemas.CoachActivationRequest,
    db: Session = Depends(database.get_db),
    coach: models.User = Depends(get_current_coach)
):
    coach.is_coach_active = True
    if not coach.invite_code:
        while True:
            code = f"COACH-{secrets.token_hex(4).upper()}"
            existing = db.query(models.User).filter(models.User.invite_code == code).first()
            if not existing:
                break
        coach.invite_code = code
    db.commit()
    db.refresh(coach)
    return {
        "success": True,
        "is_active": True,
        "invite_code": coach.invite_code,
        "message": "تم تفعيل رخصة المدرب بنجاح وإصدار كود المتدربين الخاص بك!"
    }

@router.put("/profile")
def update_coach_profile(
    req: schemas.CoachProfileUpdate,
    db: Session = Depends(database.get_db),
    coach: models.User = Depends(get_current_coach)
):
    if req.bio is not None:
        coach.coach_bio = req.bio.strip()
    if req.avatar_url is not None:
        coach.coach_avatar_url = req.avatar_url.strip()
    db.commit()
    db.refresh(coach)
    return {"message": "تم تحديث الملف الشخصي للكوتش بنجاح"}

@router.get("/clients", response_model=List[schemas.ClientSummary])
def get_coach_clients(
    db: Session = Depends(database.get_db),
    coach: models.User = Depends(get_current_coach)
):
    clients = db.query(models.User).filter(models.User.coach_id == coach.id).all()
    summaries = []
    for client in clients:
        latest_log = (
            db.query(models.WorkoutLog)
            .filter(models.WorkoutLog.user_id == client.id)
            .order_by(models.WorkoutLog.logged_at.desc())
            .first()
        )
        last_date = str(latest_log.logged_at.date()) if latest_log else None

        joined_str = str(client.coach_joined_date) if client.coach_joined_date else str(date.today())
        expiry_str = str(client.subscription_expires_at) if client.subscription_expires_at else str(date.today() + timedelta(days=30))

        summaries.append(
            schemas.ClientSummary(
                id=client.id,
                email=client.email,
                goal=client.goal,
                weight_kg=client.weight_kg,
                last_log_date=last_date,
                has_custom_macros=client.custom_calories is not None,
                gender=client.gender or "male",
                joined_date=joined_str,
                subscription_tier=client.subscription_tier or "vip_coach",
                subscription_expires_at=expiry_str,
                duration_days=30
            )
        )
    return summaries

@router.delete("/clients/{client_id}")
def remove_client(
    client_id: int,
    db: Session = Depends(database.get_db),
    coach: models.User = Depends(get_current_coach)
):
    client = db.query(models.User).filter(
        models.User.id == client_id,
        models.User.coach_id == coach.id
    ).first()
    if not client:
        raise HTTPException(status_code=404, detail="المتدرب غير موجود في قائمة تدريبك.")

    client.coach_id = None
    client.coach_joined_date = None
    client.subscription_expires_at = None
    client.custom_calories = None
    client.custom_protein_g = None
    client.custom_carbs_g = None
    client.custom_fat_g = None
    db.commit()
    return {"message": "تم إزالة المتدرب من قائمة تدريبك بنجاح.", "client_id": client_id}

@router.post("/clients/add")
def add_client_by_email(
    req: schemas.AddClientRequest,
    db: Session = Depends(database.get_db),
    coach: models.User = Depends(get_current_coach)
):
    target = db.query(models.User).filter(models.User.email == req.email.strip().lower()).first()
    if not target:
        raise HTTPException(status_code=404, detail="البريد الإلكتروني غير مسجل في منصة Apex Fit AI. يرجى تسجيل المتدرب أولاً.")
    if target.role == "coach":
        raise HTTPException(status_code=400, detail="لا يمكن إضافة حساب كابتن مدرب كمتدرب.")
    if target.coach_id == coach.id:
        raise HTTPException(status_code=400, detail="المتدرب مضاف بالفعل في قائمة تدريبك.")

    target.coach_id = coach.id
    target.coach_joined_date = date.today()
    target.subscription_expires_at = date.today() + timedelta(days=30)
    db.commit()
    return {"message": f"تم إضافة المتدرب {target.email} بنجاح إلى قائمتك!", "client_id": target.id}

@router.get("/clients/{client_id}")
def get_client_details(
    client_id: int,
    db: Session = Depends(database.get_db),
    coach: models.User = Depends(get_current_coach)
):
    client = db.query(models.User).filter(models.User.id == client_id, models.User.coach_id == coach.id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found or not assigned to you.")

    recent_workouts = (
        db.query(models.WorkoutLog)
        .filter(models.WorkoutLog.user_id == client.id)
        .order_by(models.WorkoutLog.logged_at.desc())
        .limit(10)
        .all()
    )

    recent_checkins = (
        db.query(models.CheckIn)
        .filter(models.CheckIn.user_id == client.id)
        .order_by(models.CheckIn.logged_at.desc())
        .limit(5)
        .all()
    )

    return {
        "client": {
            "id": client.id,
            "email": client.email,
            "gender": client.gender or "male",
            "age": client.age,
            "weight_kg": client.weight_kg,
            "height_cm": client.height_cm,
            "goal": client.goal,
            "activity_level": client.activity_level,
            "training_experience_months": client.training_experience_months,
            "days_per_week": client.days_per_week,
            "custom_macros": {
                "calories": client.custom_calories,
                "protein_g": client.custom_protein_g,
                "carbs_g": client.custom_carbs_g,
                "fat_g": client.custom_fat_g,
            } if client.custom_calories else None
        },
        "recent_workouts": recent_workouts,
        "recent_checkins": recent_checkins
    }

@router.post("/clients/{client_id}/override-macros")
def override_client_macros(
    client_id: int,
    request: schemas.MacroOverrideRequest,
    db: Session = Depends(database.get_db),
    coach: models.User = Depends(get_current_coach)
):
    client = db.query(models.User).filter(models.User.id == client_id, models.User.coach_id == coach.id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found or not assigned to you.")

    client.custom_calories = request.custom_calories
    client.custom_protein_g = request.custom_protein_g
    client.custom_carbs_g = request.custom_carbs_g
    client.custom_fat_g = request.custom_fat_g

    db.commit()
    return {"message": "Custom macro plan applied successfully.", "client_id": client_id}

@router.delete("/clients/{client_id}/override-macros")
def reset_client_macros(
    client_id: int,
    db: Session = Depends(database.get_db),
    coach: models.User = Depends(get_current_coach)
):
    client = db.query(models.User).filter(models.User.id == client_id, models.User.coach_id == coach.id).first()
    if not client:
        raise HTTPException(status_code=404, detail="Client not found or not assigned to you.")

    client.custom_calories = None
    client.custom_protein_g = None
    client.custom_carbs_g = None
    client.custom_fat_g = None

    db.commit()
    return {"message": "Reset to automated AI macro calculations.", "client_id": client_id}
