import datetime
import random
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import get_current_user

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.get("", response_model=List[schemas.ApplicationOut])
def list_student_applications(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    if not student:
        return []
    apps = db.query(models.Application).filter(models.Application.student_id == student.id).order_by(models.Application.applied_at.desc()).all()
    return apps

@router.post("", response_model=schemas.ApplicationOut, status_code=status.HTTP_201_CREATED)
def create_application(
    req: schemas.ApplicationCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You must have a registered student profile to apply for a concession pass."
        )

    route = db.query(models.Route).filter(models.Route.id == req.route_id).first()
    if not route:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="The requested transit route corridor was not found."
        )

    # Generate unique application number
    app_num = f"APP-{datetime.datetime.utcnow().year}-{random.randint(10000, 99999)}"

    # If photo provided, update student portrait
    if req.photo_url:
        student.photo_url = req.photo_url

    app = models.Application(
        application_number=app_num,
        student_id=student.id,
        route_id=route.id,
        academic_year=req.academic_year or "2024–2027",
        status="PENDING",
        applied_at=datetime.datetime.utcnow()
    )
    db.add(app)
    db.flush()

    # Add mock uploaded documents
    doc1 = models.Document(
        application_id=app.id,
        doc_type="COLLEGE_ID",
        file_name=req.student_id_doc_name or "student_college_id.pdf",
        file_size_bytes=1024 * 350
    )
    db.add(doc1)

    if req.photo_url:
        doc2 = models.Document(
            application_id=app.id,
            doc_type="PHOTO",
            file_name="student_biometric_photo.jpg",
            file_url=req.photo_url,
            file_size_bytes=1024 * 180
        )
        db.add(doc2)

    # Notification for student
    notif = models.Notification(
        user_id=current_user.id,
        title="Application Submitted",
        message=f"Concession request {app.application_number} for {route.from_location} ⇄ {route.to_location} has been forwarded to the college authority & RTO node.",
        type="INFO"
    )
    db.add(notif)

    db.commit()
    db.refresh(app)
    return app

@router.get("/{id}", response_model=schemas.ApplicationOut)
def get_application_detail(
    id: int,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    app = db.query(models.Application).filter(models.Application.id == id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found.")
    
    # Ensure students can only see their own applications, while admins can see any
    if current_user.role != "ADMIN":
        student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
        if not student or app.student_id != student.id:
            raise HTTPException(status_code=403, detail="Not authorized to access this application.")
    
    return app

