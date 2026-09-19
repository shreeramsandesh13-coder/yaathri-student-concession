from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import get_current_user

router = APIRouter(prefix="/passes", tags=["Passes"])

@router.get("", response_model=List[schemas.PassOut])
def list_student_passes(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    if not student:
        return []
    passes = db.query(models.Pass).filter(models.Pass.student_id == student.id).order_by(models.Pass.created_at.desc()).all()
    return passes

@router.get("/active", response_model=Optional[schemas.PassOut])
def get_active_student_pass(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    if not student:
        return None
    active_pass = db.query(models.Pass).filter(
        models.Pass.student_id == student.id,
        models.Pass.status == "ACTIVE"
    ).order_by(models.Pass.created_at.desc()).first()
    return active_pass

@router.get("/{id}", response_model=schemas.PassOut)
def get_pass_details(
    id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pass_obj = db.query(models.Pass).filter(models.Pass.id == id).first()
    if not pass_obj:
        raise HTTPException(status_code=404, detail="Pass not found.")
    
    if current_user.role != "ADMIN":
        student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
        if not student or pass_obj.student_id != student.id:
            raise HTTPException(status_code=403, detail="Not authorized to access this pass.")
    
    return pass_obj

