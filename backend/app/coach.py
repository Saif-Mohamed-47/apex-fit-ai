import secrets
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

@router.post("/invite-code")
def generate_invite_code(
    db: Session = Depends(database.get_db),
    coach: models.User = Depends(get_current_coach)
):
    if not coach.invite_code:
        code = f"COACH-{secrets.token_hex(4).upper()}"
        coach.invite_code = code
        db.commit()
        db.refresh(coach)
    return {"invite_code": coach.invite_code}

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
        summaries.append(
            schemas.ClientSummary(
                id=client.id,
                email=client.email,
                goal=client.goal,
                weight_kg=client.weight_kg,
                last_log_date=last_date,
                has_custom_macros=client.custom_calories is not None,
                gender=client.gender or "male"
            )
        )
    return summaries

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
