import datetime
import random
import hashlib
import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import require_role

router = APIRouter(prefix="/admin", tags=["Admin Operations"], dependencies=[Depends(require_role(["ADMIN", "INSTITUTION"]))])

@router.get("/stats", response_model=schemas.AdminStatsOut)
def get_admin_stats(db: Session = Depends(get_db)):
    """Fetch real-time administrative KPI statistics directly from the database."""
    total_apps = db.query(models.Application).count()
    pending_apps = db.query(models.Application).filter(models.Application.status == "PENDING").count()
    approved_apps = db.query(models.Application).filter(models.Application.status == "APPROVED").count()
    rejected_apps = db.query(models.Application).filter(models.Application.status == "REJECTED").count()
    active_passes = db.query(models.Pass).filter(models.Pass.status == "ACTIVE").count()
    expired_passes = db.query(models.Pass).filter(models.Pass.status == "EXPIRED").count()
    total_students = db.query(models.Student).count()

    return schemas.AdminStatsOut(
        total_applications=total_apps,
        pending_applications=pending_apps,
        approved_applications=approved_apps,
        rejected_applications=rejected_apps,
        active_passes=active_passes,
        expired_passes=expired_passes,
        total_students=total_students
    )

@router.get("/applications", response_model=List[schemas.ApplicationOut])
def list_all_applications(
    search: Optional[str] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List applications with real-time search across student, ID, roll number, application number, institution, and status filters."""
    query = db.query(models.Application).outerjoin(models.Student, models.Application.student_id == models.Student.id).outerjoin(models.Institution, models.Student.institution_id == models.Institution.id).outerjoin(models.Pass, models.Application.id == models.Pass.application_id)
    
    # Filter by Status
    if status_filter and status_filter.strip():
        sf = status_filter.strip().upper()
        if sf in ["PENDING", "APPROVED", "REJECTED"]:
            query = query.filter(models.Application.status == sf)
        elif sf == "ACTIVE":
            query = query.filter(models.Pass.status == "ACTIVE")
        elif sf == "EXPIRED":
            query = query.filter(models.Pass.status == "EXPIRED")

    # Search across student name, student ID, roll number, application ID, institution, locations
    if search and search.strip():
        s = f"%{search.strip()}%"
        query = query.filter(
            (models.Application.application_number.ilike(s)) |
            (models.Student.full_name.ilike(s)) |
            (models.Student.roll_number.ilike(s)) |
            (models.Student.student_id_number.ilike(s)) |
            (models.Student.college_address.ilike(s)) |
            (models.Student.institution_name.ilike(s)) |
            (models.Institution.name.ilike(s)) |
            (models.Application.starting_point.ilike(s)) |
            (models.Application.destination.ilike(s)) |
            (models.Application.route_name.ilike(s))
        )

    return query.order_by(models.Application.applied_at.desc()).all()

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
    current_admin: models.User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    app = db.query(models.Application).filter(models.Application.id == id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found.")

    app.status = "APPROVED"
    app.reviewed_at = datetime.datetime.utcnow()
    app.reviewer_name = current_admin.email.split("@")[0].replace(".", " ").title() + " (RTO Officer)"
    app.reviewer_notes = (req.reviewer_notes if req and req.reviewer_notes else "Verified and endorsed under Kerala MVD Student Concession Guidelines.")
    app.rejection_reason = None

    # Ensure student has a permanent institutional QR code identifier
    if app.student and not app.student.institutional_qr_code:
        app.student.institutional_qr_code = f"YAATHRI-ID:{uuid.uuid4().hex}"

    # Check if a Digital Pass already exists for this application or student
    existing_pass = db.query(models.Pass).filter(
        (models.Pass.application_id == app.id) |
        (models.Pass.student_id == app.student_id)
    ).first()

    pass_number = ""
    from_loc = app.starting_point or (app.route.from_location if app.route else "Origin")
    to_loc = app.destination or (app.route.to_location if app.route else "Destination")
    route_name_val = app.route_name or (f"{from_loc} ⇄ {to_loc}" if (from_loc and to_loc) else "Kerala Transit Corridor")

    if existing_pass:
        existing_pass.status = "ACTIVE"
        existing_pass.application_id = app.id
        if app.route_id:
            existing_pass.route_id = app.route_id
        existing_pass.student_name = app.student.full_name if app.student else existing_pass.student_name
        existing_pass.student_photo_url = app.student.photo_url if app.student else existing_pass.student_photo_url
        existing_pass.institution_name = (app.student.institution_name or app.student.college_address) if app.student else existing_pass.institution_name
        existing_pass.course = app.student.course if app.student else existing_pass.course
        existing_pass.roll_number = app.student.roll_number if app.student else existing_pass.roll_number
        existing_pass.student_id_number = (app.student.student_id_number or "STU-2024-8841") if app.student else existing_pass.student_id_number
        existing_pass.transport_type = app.transport_mode or "Bus"
        existing_pass.starting_point = from_loc
        existing_pass.destination = to_loc
        existing_pass.route_name = route_name_val
        existing_pass.valid_from = app.validity_start or existing_pass.valid_from or "01 / 06 / 2024"
        existing_pass.valid_until = app.validity_end or "31 / 03 / 2027"
        existing_pass.expiry_date = app.validity_end or "31 / 03 / 2027"
        pass_number = existing_pass.pass_number
    else:
        # Automatically provision Digital Pass
        pass_number = f"SCP-{datetime.datetime.utcnow().year}-{random.randint(10000, 99999)}"
        roll = app.student.roll_number if app.student else "CCE24"
        route_code = app.route.route_code if app.route else "LINE-K04"
        raw_hash = f"{pass_number}|{roll}|{route_code}|KERALA_MVD"
        hash_sig = f"KL-{hashlib.sha256(raw_hash.encode()).hexdigest()[:8].upper()}"

        route_id = app.route_id or 1
        new_pass = models.Pass(
            pass_number=pass_number,
            student_id=app.student_id,
            route_id=route_id,
            application_id=app.id,
            student_name=app.student.full_name if app.student else "Student",
            student_photo_url=app.student.photo_url if app.student else None,
            institution_name=(app.student.institution_name or app.student.college_address) if app.student else None,
            course=app.student.course if app.student else None,
            roll_number=app.student.roll_number if app.student else None,
            student_id_number=(app.student.student_id_number or "STU-2024-8841") if app.student else None,
            transport_type=app.transport_mode or "Bus",
            starting_point=from_loc,
            destination=to_loc,
            route_name=route_name_val,
            valid_from=app.validity_start or "01 / 06 / 2024",
            valid_until=app.validity_end or "31 / 03 / 2027",
            issue_date=datetime.date.today().strftime("%d / %m / %Y"),
            expiry_date=app.validity_end or "31 / 03 / 2027",
            status="ACTIVE",
            daily_fare="₹12",
            subsidy_rate="80% KSRTC / 50% METRO",
            hash_signature=hash_sig
        )
        db.add(new_pass)
        db.flush()

        # Link QR credential for offline turnstile scan
        qr_cred = models.QRCredential(
            pass_id=new_pass.id,
            qr_payload=f"YAATHRI:{pass_number}:{hash_sig}",
            signature=hash_sig,
            expires_at=datetime.datetime.utcnow() + datetime.timedelta(days=365)
        )
        db.add(qr_cred)

    # Notify student in real-time
    from_loc = app.starting_point or (app.route.from_location if app.route else "Origin")
    to_loc = app.destination or (app.route.to_location if app.route else "Destination")
    notif = models.Notification(
        user_id=app.student.user_id,
        title="Application Approved — Digital Pass Ready",
        message=f"Your YAATHRI Student Concession Pass ({pass_number}) has been approved. Digital Pass is now active for travel between {from_loc} and {to_loc}.",
        type="SUCCESS"
    )
    db.add(notif)

    db.commit()
    db.refresh(app)
    return app

@router.post("/applications/{id}/reject", response_model=schemas.ApplicationOut)
def reject_application(
    id: int,
    req: schemas.ApplicationReviewRequest,
    current_admin: models.User = Depends(require_role(["ADMIN"])),
    db: Session = Depends(get_db)
):
    app = db.query(models.Application).filter(models.Application.id == id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found.")

    # Rejection reason is mandatory
    reason = (req.rejection_reason or req.reviewer_notes or "").strip()
    if not reason:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="A specific rejection reason is required to reject an application."
        )

    app.status = "REJECTED"
    app.reviewed_at = datetime.datetime.utcnow()
    app.reviewer_name = current_admin.email.split("@")[0].replace(".", " ").title() + " (RTO Officer)"
    app.rejection_reason = reason
    app.reviewer_notes = reason

    # If an issued pass was associated with this application, suspend it
    if app.issued_pass:
        app.issued_pass.status = "SUSPENDED"

    notif = models.Notification(
        user_id=app.student.user_id,
        title="Application Rejected",
        message=f"Your concession application ({app.application_number}) could not be approved. Reason: {reason}",
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
    search: Optional[str] = None,
    status_filter: Optional[str] = None,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    query = db.query(models.VerificationLog)
    if status_filter:
        query = query.filter(models.VerificationLog.status == status_filter.upper())
    if search:
        s = f"%{search.strip()}%"
        query = query.filter(
            (models.VerificationLog.pass_number_scanned.ilike(s)) |
            (models.VerificationLog.student_name.ilike(s)) |
            (models.VerificationLog.student_roll.ilike(s)) |
            (models.VerificationLog.terminal_code.ilike(s)) |
            (models.VerificationLog.location.ilike(s))
        )
    return query.order_by(models.VerificationLog.verified_at.desc()).limit(limit).all()

