from fastapi import FastAPI, Depends, HTTPException, status, Query
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import date
from . import models, schemas, database, auth, workout, nutrition, adaptive, ai_chat, coach, checkin
from .database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(coach.router)
app.include_router(checkin.router)

@app.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    coach_id = None
    if user.coach_invite_code:
        coach_user = db.query(models.User).filter(
            models.User.invite_code == user.coach_invite_code.strip().upper(),
            models.User.role == "coach"
        ).first()
        if coach_user:
            coach_id = coach_user.id

    hashed_password = auth.get_password_hash(user.password)
    user_data = user.dict(exclude={"password", "email", "coach_invite_code"})
    if coach_id:
        user_data["coach_id"] = coach_id

    new_user = models.User(email=user.email, password_hash=hashed_password, **user_data)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/users/me", response_model=schemas.User)
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.get("/nutrition-target/")
def get_nutrition_target(current_user: models.User = Depends(auth.get_current_user)):
    if current_user.custom_calories and current_user.custom_protein_g:
        return {
            "protein_g": round(current_user.custom_protein_g),
            "carbs_g": round(current_user.custom_carbs_g or 0),
            "fat_g": round(current_user.custom_fat_g or 0),
            "target_calories": round(current_user.custom_calories),
            "is_custom_coach_override": True
        }
    target = nutrition.calculate_macros(
        current_user.weight_kg,
        current_user.age,
        current_user.height_cm,
        current_user.gender,
        current_user.activity_level,
        current_user.goal
    )
    target["is_custom_coach_override"] = False
    return target


@app.get("/workout-recommendation/")
def get_recommendation(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    rec = workout.get_workout_recommendation(
        current_user.training_experience_months,
        current_user.days_per_week,
        current_user.gender
    )
    
    # Calculate today's focus day index
    today_focus_index = workout.get_todays_focus_day_index(current_user.id, db, rec["schedule"])
    
    return {
        "split": rec["split"],
        "schedule": rec["schedule"],
        "today_focus_index": today_focus_index
    }

@app.get("/meals/", response_model=list[schemas.Meal])
def get_meals(
    date_param: date = Query(None, alias="date"),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    query = db.query(models.Meal).filter(models.Meal.user_id == current_user.id)
    if date_param:
        query = query.filter(models.Meal.date == date_param)
    else:
        query = query.filter(models.Meal.date == date.today())
    return query.all()

@app.post("/meals/", response_model=schemas.Meal)
def create_meal(
    meal: schemas.MealCreate, 
    db: Session = Depends(get_db), 
    current_user: models.User = Depends(auth.get_current_user)
):
    new_meal = models.Meal(**meal.dict(), user_id=current_user.id)
    db.add(new_meal)
    db.commit()
    db.refresh(new_meal)
    return new_meal

@app.post("/workout-logs/", response_model=schemas.WorkoutLog, status_code=status.HTTP_201_CREATED)
def create_workout_log(
    log: schemas.WorkoutLogCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    new_log = models.WorkoutLog(**log.dict(), user_id=current_user.id)
    db.add(new_log)
    db.commit()
    db.refresh(new_log)
    return new_log

@app.get("/workout-logs/progress/{exercise_name}")
def get_exercise_progress(
    exercise_name: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    from sqlalchemy import func
    
    # Query logs for this user/exercise, group by date, find max weight per date
    progress = (
        db.query(
            func.date(models.WorkoutLog.logged_at).label("date"),
            func.max(models.WorkoutLog.actual_weight_kg).label("max_weight_kg")
        )
        .filter(models.WorkoutLog.user_id == current_user.id)
        .filter(models.WorkoutLog.exercise_name == exercise_name)
        .group_by(func.date(models.WorkoutLog.logged_at))
        .order_by(func.date(models.WorkoutLog.logged_at).asc())
        .limit(20)
        .all()
    )
    
    return [{"date": str(p.date), "max_weight_kg": p.max_weight_kg} for p in progress]

@app.get("/workout-logs/history/{exercise_name}", response_model=list[schemas.WorkoutLog])
def get_workout_history(
    exercise_name: str,
    limit: int = Query(10, gt=0),
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return (
        db.query(models.WorkoutLog)
        .filter(models.WorkoutLog.user_id == current_user.id)
        .filter(models.WorkoutLog.exercise_name == exercise_name)
        .order_by(models.WorkoutLog.logged_at.desc())
        .limit(limit)
        .all()
    )

@app.get("/workout-recommendation/adaptive/{exercise_name}")
def get_adaptive_recommendation_endpoint(
    exercise_name: str,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return adaptive.get_adaptive_recommendation(current_user.id, exercise_name, db)

@app.delete("/workout-logs/test-cleanup/", status_code=status.HTTP_204_NO_CONTENT)
def cleanup_workout_logs(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    db.query(models.WorkoutLog).filter(models.WorkoutLog.user_id == current_user.id).delete()
    db.commit()
    return None

from fastapi.responses import StreamingResponse

@app.post("/chat/")
async def chat_with_coach_endpoint(
    request: schemas.ChatRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    reply = await ai_chat.chat_with_coach(
        user_message=request.message, 
        conversation_history=request.history, 
        user=current_user, 
        db=db
    )
    return {"reply": reply}

@app.post("/chat/stream")
async def chat_stream_endpoint(
    request: schemas.ChatRequest,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    generator = ai_chat.stream_chat_with_coach(
        user_message=request.message,
        conversation_history=request.history,
        user=current_user,
        db=db
    )
    return StreamingResponse(generator, media_type="text/event-stream")


