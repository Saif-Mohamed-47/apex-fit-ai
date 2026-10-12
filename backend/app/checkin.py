from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from . import models, schemas, database, auth

router = APIRouter(prefix="/check-ins", tags=["Check-Ins"])

@router.post("/", response_model=schemas.CheckIn, status_code=status.HTTP_201_CREATED)
def submit_check_in(
    check_in: schemas.CheckInCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    new_check_in = models.CheckIn(
        user_id=current_user.id,
        coach_id=current_user.coach_id,
        weight_kg=check_in.weight_kg,
        sleep_hours=check_in.sleep_hours,
        energy_rating=check_in.energy_rating,
        soreness_rating=check_in.soreness_rating,
        client_notes=check_in.client_notes
    )
    db.add(new_check_in)
    db.commit()
    db.refresh(new_check_in)
    return new_check_in

@router.get("/", response_model=List[schemas.CheckIn])
def get_user_check_ins(
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    return (
        db.query(models.CheckIn)
        .filter(models.CheckIn.user_id == current_user.id)
        .order_by(models.CheckIn.logged_at.desc())
        .all()
    )
