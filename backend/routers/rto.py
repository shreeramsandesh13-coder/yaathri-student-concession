import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import require_role

router = APIRouter(
    prefix="/rto",
    tags=["RTO / Transport Authority"],
    dependencies=[Depends(require_role(["RTO", "ADMIN"]))]
)

@router.get("/dashboard", response_model=schemas.RtoDashboardOut)
def get_rto_dashboard(db: Session = Depends(get_db)):
    """State-wide executive KPIs for Kerala Transport Department / RTO."""
    total_verifiers = db.query(models.Verifier).count()
    active_verifiers = db.query(models.Verifier).filter(models.Verifier.status == "ACTIVE").count()
    suspended_verifiers = db.query(models.Verifier).filter(models.Verifier.status == "SUSPENDED").count()

    total_logs = db.query(models.VerificationLog).count()

    today_start = datetime.datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    today_logs = db.query(models.VerificationLog).filter(models.VerificationLog.verified_at >= today_start).count()

    valid_logs = db.query(models.VerificationLog).filter(
        (models.VerificationLog.result == "VALID") | (models.VerificationLog.status == "VERIFIED")
    ).count()

    invalid_logs = total_logs - valid_logs
    if invalid_logs < 0:
        invalid_logs = 0

    total_institutions = db.query(models.Institution).count()
    total_passes = db.query(models.Pass).filter(models.Pass.status == "ACTIVE").count()
    total_operators = db.query(models.TransportOperator).count()

    # Transport Breakdown
    ksrtc_scans = db.query(models.VerificationLog).filter(models.VerificationLog.transport_type == "KSRTC").count()
    bus_scans = db.query(models.VerificationLog).filter(models.VerificationLog.transport_type == "PRIVATE_BUS").count()
    metro_scans = db.query(models.VerificationLog).filter(models.VerificationLog.transport_type == "METRO").count()

    return schemas.RtoDashboardOut(
        total_verifiers=total_verifiers,
        active_verifiers=active_verifiers,
        suspended_verifiers=suspended_verifiers,
        total_verifications=total_logs,
        today_verifications=today_logs,
        valid_verifications=valid_logs,
        invalid_verifications=invalid_logs,
        total_institutions=total_institutions,
        total_active_passes=total_passes,
        total_operators=total_operators,
        transport_breakdown={
            "KSRTC": ksrtc_scans,
            "PRIVATE_BUS": bus_scans,
            "METRO": metro_scans
        }
    )

@router.get("/operators", response_model=List[schemas.TransportOperatorOut])
def list_transport_operators(db: Session = Depends(get_db)):
    """List transport authorities and registered private bus operators."""
    return db.query(models.TransportOperator).all()

@router.get("/verifiers", response_model=List[schemas.VerifierOut])
def list_verifiers(
    transport_type: Optional[str] = None,
    status_filter: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    List all authorized verifiers (KSRTC conductors, Private Bus crew, Metro gates)
    with filter and search across ID, name, bus number, and station.
    """
    query = db.query(models.Verifier)

    if transport_type and transport_type.strip():
        query = query.filter(models.Verifier.transport_type == transport_type.strip().upper())

    if status_filter and status_filter.strip():
        query = query.filter(models.Verifier.status == status_filter.strip().upper())

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            (models.Verifier.verifier_code.ilike(term)) |
            (models.Verifier.full_name.ilike(term)) |
            (models.Verifier.bus_number.ilike(term)) |
            (models.Verifier.station_device_id.ilike(term)) |
            (models.Verifier.assigned_route.ilike(term)) |
            (models.Verifier.depot.ilike(term))
        )

    return query.order_by(models.Verifier.created_at.desc()).all()

@router.patch("/verifiers/{verifier_id}/status", response_model=schemas.VerifierOut)
def update_verifier_status(
    verifier_id: int,
    payload: schemas.VerifierStatusUpdate,
    db: Session = Depends(get_db)
):
    """
    Suspend or Activate verifier authority in real-time.
    Suspended verifiers immediately lose verification rights on the transport network.
    """
    new_status = payload.status.strip().upper()
    if new_status not in ["ACTIVE", "SUSPENDED"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Status must be either 'ACTIVE' or 'SUSPENDED'."
        )

    verifier = db.query(models.Verifier).filter(models.Verifier.id == verifier_id).first()
    if not verifier:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Verifier record not found."
        )

    verifier.status = new_status
    if verifier.user:
        verifier.user.is_active = (new_status == "ACTIVE")

    db.commit()
    db.refresh(verifier)
    return verifier

@router.get("/verifications", response_model=List[schemas.VerificationLogOut])
def list_state_verification_audit(
    search: Optional[str] = None,
    transport_type: Optional[str] = None,
    result: Optional[str] = None,
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db)
):
    """
    State-wide real-time verification ledger for transport enforcement.
    Audits who scanned, what vehicle, which route, when, and the result.
    """
    query = db.query(models.VerificationLog)

    if transport_type and transport_type.strip():
        query = query.filter(models.VerificationLog.transport_type == transport_type.strip().upper())

    if result and result.strip():
        r = result.strip().upper()
        if r in ["VALID", "VERIFIED"]:
            query = query.filter(
                (models.VerificationLog.result == "VALID") | (models.VerificationLog.status == "VERIFIED")
            )
        elif r in ["INVALID", "EXPIRED", "SUSPENDED"]:
            query = query.filter(
                (models.VerificationLog.result == "INVALID") |
                (models.VerificationLog.status.in_(["INVALID", "EXPIRED", "SUSPENDED"]))
            )

    if search and search.strip():
        term = f"%{search.strip()}%"
        query = query.filter(
            (models.VerificationLog.pass_number_scanned.ilike(term)) |
            (models.VerificationLog.student_name.ilike(term)) |
            (models.VerificationLog.verifier_name.ilike(term)) |
            (models.VerificationLog.verifier_code.ilike(term)) |
            (models.VerificationLog.vehicle_number.ilike(term)) |
            (models.VerificationLog.station_device_id.ilike(term)) |
            (models.VerificationLog.route_name.ilike(term))
        )

    return query.order_by(models.VerificationLog.verified_at.desc()).limit(limit).all()

@router.get("/institutions", response_model=List[schemas.InstitutionOut])
def list_institutions(db: Session = Depends(get_db)):
    """List all accredited educational institutions participating in the YAATHRI scheme."""
    return db.query(models.Institution).all()

@router.get("/routes", response_model=List[schemas.RouteOut])
def list_routes(db: Session = Depends(get_db)):
    """List all gazetted transit routes eligible for concession."""
    return db.query(models.Route).filter(models.Route.is_active == True).all()

