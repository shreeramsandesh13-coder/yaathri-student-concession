import datetime
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import get_current_user, require_role

router = APIRouter(
    prefix="/verifier",
    tags=["Transport Verifier"],
    dependencies=[Depends(require_role(["VERIFIER", "ADMIN", "RTO"]))]
)

@router.get("/profile", response_model=schemas.VerifierOut)
def get_verifier_profile(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Fetch current verifier profile including assigned vehicle, route, and depot."""
    verifier = db.query(models.Verifier).filter(models.Verifier.user_id == current_user.id).first()
    if not verifier:
        # Fallback for Admin/RTO inspecting verifier endpoint
        verifier = db.query(models.Verifier).first()
        if not verifier:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No verifier profile associated with this account."
            )
    return verifier

@router.get("/history", response_model=List[schemas.VerificationLogOut])
def get_verifier_history(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve history of passes verified by this specific verifier."""
    verifier = db.query(models.Verifier).filter(models.Verifier.user_id == current_user.id).first()
    query = db.query(models.VerificationLog)
    if verifier:
        query = query.filter(models.VerificationLog.verifier_id == verifier.id)
    return query.order_by(models.VerificationLog.verified_at.desc()).limit(100).all()

@router.post("/verify", response_model=schemas.VerifierVerifyResponse)
def verify_pass_conductor(
    req: schemas.VerifierVerifyRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Real-Time Concession Pass Verification Engine for Conductors and Gate Attendants.
    Server derives verifier identity, transport type, operator, and vehicle/device
    directly from the authenticated session.
    """
    # 1. Resolve verifier profile
    verifier = db.query(models.Verifier).filter(models.Verifier.user_id == current_user.id).first()
    if not verifier:
        # For testing as admin or fallback
        verifier = db.query(models.Verifier).filter(models.Verifier.status == "ACTIVE").first()
        if not verifier:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No authorized verifier profile found for this session."
            )

    # 2. Check if Verifier itself is ACTIVE or SUSPENDED
    if verifier.status == "SUSPENDED":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your verifier authorization has been SUSPENDED by Kerala RTO. Contact your transport depot administrator."
        )

    now = datetime.datetime.utcnow()
    search_str = req.qr_payload.strip()

    # Derived context
    v_code = verifier.verifier_code
    v_name = verifier.full_name
    t_type = verifier.transport_type
    t_op = verifier.operator_name or "Kerala State Road Transport Corporation"
    v_unit = verifier.bus_number or verifier.station_device_id or verifier.assigned_route or "Transit Terminal"
    terminal = f"{t_type}-{v_unit}"
    location = f"{t_op} | {v_unit}"

    # 3. Resolve Pass from QR Payload
    student = None
    pass_obj = None
    is_travel_token = False
    is_institutional_qr = False

    # Normalize QR payload
    # Format A: YAATHRI:SCP-2026-XXXXX:<signature>
    if search_str.startswith("YAATHRI:"):
        parts = search_str.split(":")
        if len(parts) >= 2:
            pass_num = parts[1]
            pass_obj = db.query(models.Pass).filter(models.Pass.pass_number == pass_num).first()
        else:
            pass_obj = db.query(models.Pass).filter(models.Pass.hash_signature == search_str).first()

    # Format B: YAATHRI-ID:<opaque_uuid> or YAATHRI-INST:...
    elif search_str.startswith("YAATHRI-ID:") or search_str.startswith("YAATHRI-INST:"):
        is_institutional_qr = True
        student = db.query(models.Student).filter(models.Student.institutional_qr_code == search_str).first()
        if student:
            pass_obj = db.query(models.Pass).filter(
                models.Pass.student_id == student.id
            ).order_by(models.Pass.created_at.desc()).first()

    # Format C: TT-<uuid> (Travel Token)
    elif search_str.startswith("TT-"):
        is_travel_token = True
        token_obj = db.query(models.TravelToken).filter(models.TravelToken.token_code == search_str).first()
        if token_obj:
            pass_obj = token_obj.pass_ref
            if token_obj.is_used:
                # Token already redeemed!
                log = models.VerificationLog(
                    pass_id=pass_obj.id if pass_obj else None,
                    pass_number_scanned=search_str,
                    terminal_code=terminal,
                    location=location,
                    verifier_identity=f"{v_code} - {v_name}",
                    verifier_id=verifier.id,
                    verifier_code=v_code,
                    verifier_name=v_name,
                    transport_type=t_type,
                    transport_operator=t_op,
                    vehicle_number=verifier.bus_number,
                    station_device_id=verifier.station_device_id,
                    result="INVALID",
                    status="INVALID",
                    status_code="409 CONFLICT",
                    failure_reason="TRAVEL TOKEN ALREADY USED: This single-entry token was already verified.",
                    notes="Repeated scan of one-time travel token."
                )
                db.add(log)
                db.commit()
                return schemas.VerifierVerifyResponse(
                    is_valid=False,
                    result="INVALID",
                    status_code="409 CONFLICT",
                    pass_number=pass_obj.pass_number if pass_obj else search_str,
                    failure_reason="TRAVEL TOKEN ALREADY REDEEMED. Single entry token has already been validated.",
                    message="Verification Failed: Token already used.",
                    verified_at=now,
                    verifier_code=v_code,
                    verifier_name=v_name,
                    transport_type=t_type,
                    transport_operator=t_op,
                    vehicle_or_station=v_unit
                )
            if token_obj.expires_at < now:
                # Token expired
                log = models.VerificationLog(
                    pass_id=pass_obj.id if pass_obj else None,
                    pass_number_scanned=search_str,
                    terminal_code=terminal,
                    location=location,
                    verifier_identity=f"{v_code} - {v_name}",
                    verifier_id=verifier.id,
                    verifier_code=v_code,
                    verifier_name=v_name,
                    transport_type=t_type,
                    transport_operator=t_op,
                    vehicle_number=verifier.bus_number,
                    station_device_id=verifier.station_device_id,
                    result="INVALID",
                    status="EXPIRED",
                    status_code="403 EXPIRED",
                    failure_reason="TRAVEL TOKEN EXPIRED: Token exceeded 2-minute validity limit.",
                    notes="Travel token expired."
                )
                db.add(log)
                db.commit()
                return schemas.VerifierVerifyResponse(
                    is_valid=False,
                    result="INVALID",
                    status_code="403 EXPIRED",
                    pass_number=pass_obj.pass_number if pass_obj else search_str,
                    failure_reason="TRAVEL TOKEN EXPIRED. Please generate a fresh token on the YAATHRI student app.",
                    message="Verification Failed: Token expired.",
                    verified_at=now,
                    verifier_code=v_code,
                    verifier_name=v_name,
                    transport_type=t_type,
                    transport_operator=t_op,
                    vehicle_or_station=v_unit
                )
            # Valid token - mark used
            token_obj.is_used = True

    # Format D: Direct pass number (SCP-...) or hash or application number
    else:
        pass_obj = db.query(models.Pass).filter(
            (models.Pass.pass_number == search_str) |
            (models.Pass.hash_signature == search_str)
        ).first()

        if not pass_obj:
            # Check if student ID entered
            student = db.query(models.Student).filter(
                (models.Student.roll_number == search_str) |
                (models.Student.student_id_number == search_str)
            ).first()
            if student:
                pass_obj = db.query(models.Pass).filter(
                    models.Pass.student_id == student.id
                ).order_by(models.Pass.created_at.desc()).first()

    # 4. Handle Cases where Pass or Student is Not Found
    if not pass_obj:
        reason = "UNRECOGNIZED QR CODE / IDENTIFIER: No registered student pass matches this scan."
        if is_institutional_qr and not student:
            reason = "INSTITUTIONAL ID NOT RECOGNIZED: Card not registered in Kerala state student registry."
        elif student and not pass_obj:
            reason = f"NO CONCESSION PASS: Student {student.full_name} has no approved concession pass."

        log = models.VerificationLog(
            pass_id=None,
            pass_number_scanned=search_str,
            terminal_code=terminal,
            location=location,
            student_name=student.full_name if student else None,
            student_roll=student.roll_number if student else None,
            verifier_identity=f"{v_code} - {v_name}",
            verifier_id=verifier.id,
            verifier_code=v_code,
            verifier_name=v_name,
            transport_type=t_type,
            transport_operator=t_op,
            vehicle_number=verifier.bus_number,
            station_device_id=verifier.station_device_id,
            result="INVALID",
            status="INVALID",
            status_code="404 NOT FOUND",
            failure_reason=reason,
            notes=f"Failed verification attempt by {v_code}."
        )
        db.add(log)
        db.commit()

        return schemas.VerifierVerifyResponse(
            is_valid=False,
            result="INVALID",
            status_code="404 NOT FOUND",
            pass_number=search_str,
            student_name=student.full_name if student else None,
            roll_number=student.roll_number if student else None,
            institution=student.institution_name or student.college_address if student else None,
            failure_reason=reason,
            message="Verification Failed: Concession pass not found or not registered.",
            verified_at=now,
            verifier_code=v_code,
            verifier_name=v_name,
            transport_type=t_type,
            transport_operator=t_op,
            vehicle_or_station=v_unit
        )

    # 5. Resolve Student and Pass details
    if not student and pass_obj:
        student = pass_obj.student

    student_name = (student.full_name if student else None) or pass_obj.student_name or "Student Passholder"
    student_roll = (student.roll_number if student else None) or pass_obj.roll_number or ""
    student_photo = (student.photo_url if student else None) or pass_obj.student_photo_url
    institution_name = (student.institution_name or student.college_address if student else None) or pass_obj.institution_name or "Kerala State Educational Institution"
    class_name = (student.course if student else None) or pass_obj.course or "Undergraduate"
    route_name = pass_obj.route_name or (f"{pass_obj.route.from_location} ⇄ {pass_obj.route.to_location}" if pass_obj.route else "Kerala Transit Corridor")
    transport_mode = pass_obj.transport_type or (pass_obj.route.fleet_type if pass_obj.route else "KSRTC / Metro")
    subsidy_rate = pass_obj.subsidy_rate or "75% Concession"

    # 6. Check Pass Status & Expiration
    is_valid = False
    result = "INVALID"
    status_code = "200 OK"
    failure_reason = None
    log_status = "VERIFIED"

    # A. Suspended Pass
    if pass_obj.status == "SUSPENDED":
        status_code = "403 SUSPENDED"
        log_status = "SUSPENDED"
        failure_reason = "CONCESSION SUSPENDED: Pass administratively revoked or put on hold by Kerala RTO / Transport Authority."
    
    # B. Expired Pass
    elif pass_obj.status == "EXPIRED":
        status_code = "403 EXPIRED"
        log_status = "EXPIRED"
        failure_reason = f"CONCESSION EXPIRED: Pass expired on {pass_obj.expiry_date}. Student must renew."

    # C. Date Check (if expiry_date in past)
    elif pass_obj.expiry_date:
        try:
            # Check YYYY-MM-DD
            exp_date = datetime.date.fromisoformat(pass_obj.expiry_date)
            if exp_date < now.date():
                status_code = "403 EXPIRED"
                log_status = "EXPIRED"
                failure_reason = f"CONCESSION EXPIRED: Pass expired on {pass_obj.expiry_date}. Annual re-enrollment required."
        except Exception:
            pass

    # D. Active & Valid
    if not failure_reason and pass_obj.status == "ACTIVE":
        is_valid = True
        result = "VALID"
        log_status = "VERIFIED"
        status_code = "200 OK"
    elif not failure_reason:
        # Pass status is not ACTIVE (e.g. INACTIVE / PENDING)
        status_code = "403 NOT_ACTIVE"
        log_status = "INVALID"
        failure_reason = f"PASS NOT ACTIVE: Current status is '{pass_obj.status}'."

    # 7. Audit Log into Database
    log = models.VerificationLog(
        pass_id=pass_obj.id,
        pass_number_scanned=pass_obj.pass_number,
        terminal_code=terminal,
        location=location,
        student_name=student_name,
        student_roll=student_roll,
        route_name=route_name,
        verifier_identity=f"{v_code} - {v_name}",
        verifier_id=verifier.id,
        verifier_code=v_code,
        verifier_name=v_name,
        transport_type=t_type,
        transport_operator=t_op,
        vehicle_number=verifier.bus_number,
        station_device_id=verifier.station_device_id,
        result=result,
        status=log_status,
        status_code=status_code,
        failure_reason=failure_reason,
        notes=f"{result}: {t_type} pass checked on {v_unit} by {v_name}."
    )
    db.add(log)
    db.commit()

    return schemas.VerifierVerifyResponse(
        is_valid=is_valid,
        result=result,
        status_code=status_code,
        pass_number=pass_obj.pass_number,
        student_name=student_name,
        student_photo=student_photo,
        roll_number=student_roll,
        institution=institution_name,
        class_name=class_name,
        assigned_route=route_name,
        transport_mode=transport_mode,
        valid_from=pass_obj.valid_from or pass_obj.issue_date,
        valid_until=pass_obj.valid_until or pass_obj.expiry_date,
        subsidy_rate=subsidy_rate,
        failure_reason=failure_reason,
        message="Concession Pass VALID: Authorized for travel." if is_valid else (failure_reason or "Pass Verification Failed."),
        verified_at=now,
        verifier_code=v_code,
        verifier_name=v_name,
        transport_type=t_type,
        transport_operator=t_op,
        vehicle_or_station=v_unit
    )
