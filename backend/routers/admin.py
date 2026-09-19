import datetime
import random
import hashlib
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import require_role

router = APIRouter(prefix="/admin", tags=["Admin Operations"], dependencies=[Depends(require_role(["ADMIN"]))])

@router.get("/applications", response_model=List[schemas.ApplicationOut])
def list_all_applications(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.Application).order_by(models.Application.applied_at.desc())
    if status_filter:
        query = query.filter(models.Application.status == status_filter.upper())
    return query.all()

@router.get("/applications/{id}", response_model=schemas.ApplicationOut)
def get_application_admin(id: int, db: Session = Depends(get_db)):
    app = db.query(models.Application).filter(models.Application.id == id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found.")
    return app

@router.post("/applications/{id}/approve", response_model=schemas.ApplicationOut)
def approve_application(
    id: int,
    req: Optional[schemas.ApplicationReviewRequest] = None,
    db: Session = Depends(get_db)
):
    app = db.query(models.Application).filter(models.Application.id == id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found.")

    if app.status == "APPROVED":
        return app

    app.status = "APPROVED"
    app.reviewed_at = datetime.datetime.utcnow()
    app.reviewer_notes = req.reviewer_notes if req else "Verified against Higher Education enrollment registry."

    # Automatically provision Digital Pass
    pass_number = f"SCP-{datetime.datetime.utcnow().year}-{random.randint(10000, 99999)}"
    raw_hash = f"{pass_number}|{app.student.roll_number}|{app.route.route_code}|KERALA_MVD"
    hash_sig = f"KL-{hashlib.sha256(raw_hash.encode()).hexdigest()[:8].upper()}"

    new_pass = models.Pass(
        pass_number=pass_number,
        student_id=app.student_id,
        route_id=app.route_id,
        application_id=app.id,
        issue_date=datetime.date.today().strftime("%d / %m / %Y"),
        expiry_date="31 / 03 / 2027",
        status="ACTIVE",
        daily_fare="₹12",
        subsidy_rate="80% KSRTC / 50% METRO",
        hash_signature=hash_sig
    )
    db.add(new_pass)

    # Add notification for student
    notif = models.Notification(
        user_id=app.student.user_id,
        title="Concession Pass Approved!",
        message=f"Your YAATHRI Student Concession Pass ({pass_number}) has been approved and activated for {app.route.from_location} ⇄ {app.route.to_location}.",
        type="SUCCESS"
    )
    db.add(notif)

    db.commit()
    db.refresh(app)
    return app

@router.post("/applications/{id}/reject", response_model=schemas.ApplicationOut)
def reject_application(
    id: int,
    req: Optional[schemas.ApplicationReviewRequest] = None,
    db: Session = Depends(get_db)
):
    app = db.query(models.Application).filter(models.Application.id == id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found.")

    app.status = "REJECTED"
    app.reviewed_at = datetime.datetime.utcnow()
    app.reviewer_notes = req.reviewer_notes if req and req.reviewer_notes else "Institutional enrollment or fee receipt mismatch."

    notif = models.Notification(
        user_id=app.student.user_id,
        title="Application Status Update",
        message=f"Concession request {app.application_number} could not be approved: {app.reviewer_notes}",
        type="WARNING"
    )
    db.add(notif)

    db.commit()
    db.refresh(app)
    return app

@router.get("/students", response_model=List[schemas.StudentOut])
def list_all_students(db: Session = Depends(get_db)):
    return db.query(models.Student).order_by(models.Student.created_at.desc()).all()

@router.get("/routes", response_model=List[schemas.RouteOut])
def list_all_routes_admin(db: Session = Depends(get_db)):
    return db.query(models.Route).all()

@router.post("/routes", response_model=schemas.RouteOut, status_code=status.HTTP_201_CREATED)
def create_route_admin(req: schemas.RouteCreate, db: Session = Depends(get_db)):
    existing = db.query(models.Route).filter(models.Route.route_code == req.route_code).first()
    if existing:
        raise HTTPException(status_code=400, detail="A route with this code already exists.")

    route = models.Route(
        route_code=req.route_code,
        from_location=req.from_location,
        to_location=req.to_location,
        corridor=req.corridor,
        distance_km=req.distance_km,
        fleet_type=req.fleet_type,
        ksrtc_subsidy_pct=req.ksrtc_subsidy_pct,
        metro_subsidy_pct=req.metro_subsidy_pct,
        fare_daily=req.fare_daily
    )
    db.add(route)
    db.flush()

    for idx, stop_name in enumerate(req.stops):
        stop = models.Stop(
            route_id=route.id,
            stop_name=stop_name,
            sequence_order=idx + 1
        )
        db.add(stop)

    db.commit()
    db.refresh(route)
    return route

@router.get("/verifications", response_model=List[schemas.VerificationLogOut])
def list_verification_logs(
    limit: int = 50,
    db: Session = Depends(get_db)
):
    return db.query(models.VerificationLog).order_by(models.VerificationLog.verified_at.desc()).limit(limit).all()

