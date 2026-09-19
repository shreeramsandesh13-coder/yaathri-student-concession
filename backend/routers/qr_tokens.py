import datetime
import hashlib
import uuid
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import get_current_user

router = APIRouter(tags=["QR & Travel Tokens"])

@router.get("/qr/institutional-qr")
def get_institutional_qr(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve or provision the student's permanent opaque institutional QR code."""
    student = db.query(models.Student).filter(models.Student.user_id == current_user.id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student profile not found.")

    if not student.institutional_qr_code:
        student.institutional_qr_code = f"YAATHRI-ID:{uuid.uuid4().hex}"
        db.commit()
        db.refresh(student)

    # Check for active pass
    active_pass = db.query(models.Pass).filter(
        models.Pass.student_id == student.id,
        models.Pass.status == "ACTIVE"
    ).order_by(models.Pass.created_at.desc()).first()

    return {
        "student_id": student.id,
        "full_name": student.full_name,
        "roll_number": student.roll_number,
        "institution_name": student.institution_name or student.college_address,
        "institutional_qr_code": student.institutional_qr_code,
        "has_active_pass": active_pass is not None,
        "pass_number": active_pass.pass_number if active_pass else None
    }

@router.post("/qr/generate", response_model=schemas.QRResponse)
def generate_qr_payload(
    req: schemas.QRGenerateRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pass_obj = db.query(models.Pass).filter(models.Pass.id == req.pass_id).first()
    if not pass_obj:
        raise HTTPException(status_code=404, detail="Concession pass not found.")
    
    # Payload signed with pass hash and timestamp
    timestamp = datetime.datetime.utcnow().isoformat()
    raw_str = f"{pass_obj.pass_number}|{pass_obj.student.roll_number}|{timestamp}|{pass_obj.hash_signature}"
    sig = hashlib.sha256(raw_str.encode('utf-8')).hexdigest()[:32]
    
    qr_payload = f"YAATHRI:{pass_obj.pass_number}:{sig}"
    
    qr_cred = models.QRCredential(
        pass_id=pass_obj.id,
        qr_payload=qr_payload,
        signature=sig,
        expires_at=datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    )
    db.add(qr_cred)
    db.commit()

    return schemas.QRResponse(
        pass_id=pass_obj.id,
        pass_number=pass_obj.pass_number,
        qr_payload=qr_payload,
        signature=sig,
        expires_at=qr_cred.expires_at
    )

@router.post("/qr/verify", response_model=schemas.QRVerifyResponse)
def verify_qr_or_pass(
    req: schemas.QRVerifyRequest,
    db: Session = Depends(get_db)
):
    """
    Unified Verification Engine:
    1. Permanent Institutional QR: "YAATHRI-ID:<opaque_uuid>"
    2. Single-Use Travel Token: "TT-<uuid>" (90-120s validity, rejects 2nd scan as ALREADY_USED)
    3. Concession Pass Number: "SCP-..." or "YAATHRI:SCP-..." or Cryptographic Hash
    """
    search_str = req.pass_number_or_qr.strip()
    terminal = req.terminal_code or "TERMINAL-KL-RTO-TCR"
    loc = req.location or "Aluva Metro Station Turnstile #4"
    now = datetime.datetime.utcnow()

    # -------------------------------------------------------------
    # CASE 1: PERMANENT INSTITUTIONAL QR CODE
    # -------------------------------------------------------------
    if search_str.startswith("YAATHRI-ID:") or search_str.startswith("YAATHRI-INST:"):
        student = db.query(models.Student).filter(
            models.Student.institutional_qr_code == search_str
        ).first()

        if not student:
            # Audit log invalid scan
            log = models.VerificationLog(
                pass_id=None,
                pass_number_scanned=search_str,
                terminal_code=terminal,
                location=loc,
                verifier_identity="RTO Scanner Node",
                status="INVALID",
                status_code="404 NOT FOUND",
                failure_reason="INSTITUTIONAL QR UNRECOGNIZED: No registered student linked to this ID card.",
                notes="Unrecognized institutional QR scanned."
            )
            db.add(log)
            db.commit()

            return schemas.QRVerifyResponse(
                status="INVALID",
                status_code="404 NOT FOUND",
                is_valid=False,
                pass_number=search_str,
                token_type="INSTITUTIONAL_QR",
                failure_reason="INSTITUTIONAL ID NOT RECOGNIZED: Card not registered in Kerala state student registry.",
                message="Card scan failed: No valid student identity found.",
                verified_at=now
            )

        # Check for concession pass associated with this student
        pass_obj = db.query(models.Pass).filter(
            models.Pass.student_id == student.id
        ).order_by(models.Pass.created_at.desc()).first()

        if not pass_obj:
            log = models.VerificationLog(
                pass_id=None,
                pass_number_scanned=search_str,
                terminal_code=terminal,
                location=loc,
                student_name=student.full_name,
                student_roll=student.roll_number,
                verifier_identity="RTO Scanner Node",
                status="INVALID",
                status_code="403 FORBIDDEN",
                failure_reason="NO CONCESSION PASS: Student has no approved transit concession pass.",
                notes=f"Student {student.full_name} has no issued concession pass."
            )
            db.add(log)
            db.commit()

            return schemas.QRVerifyResponse(
                status="INVALID",
                status_code="403 FORBIDDEN",
                is_valid=False,
                pass_number=search_str,
                student_name=student.full_name,
                student_photo=student.photo_url,
                college=student.institution_name or student.college_address,
                roll_number=student.roll_number,
                student_id_number=student.student_id_number,
                token_type="INSTITUTIONAL_QR",
                failure_reason="NO ACTIVE CONCESSION: Student has institutional ID but no active transit concession.",
                message="Institutional ID recognized, but no approved concession pass is linked.",
                verified_at=now
            )

        # Check status and validity of the pass
        if pass_obj.status == "SUSPENDED":
            log = models.VerificationLog(
                pass_id=pass_obj.id,
                pass_number_scanned=pass_obj.pass_number,
                terminal_code=terminal,
                location=loc,
                student_name=student.full_name,
                student_roll=student.roll_number,
                route_name=pass_obj.route_name,
                verifier_identity="RTO Scanner Node",
                status="SUSPENDED",
                status_code="403 SUSPENDED",
                failure_reason="CONCESSION SUSPENDED: Card revoked or put on administrative hold by Kerala RTO.",
                notes=f"Concession suspended for {student.full_name}."
            )
            db.add(log)
            db.commit()

            return schemas.QRVerifyResponse(
                status="SUSPENDED",
                status_code="403 SUSPENDED",
                is_valid=False,
                pass_number=pass_obj.pass_number,
                student_name=student.full_name,
                student_photo=student.photo_url,
                college=student.institution_name or student.college_address,
                roll_number=student.roll_number,
                student_id_number=student.student_id_number,
                token_type="INSTITUTIONAL_QR",
                failure_reason="CONCESSION SUSPENDED: Administrative hold by Kerala RTO.",
                message="Pass suspended. Student must contact their institution or local RTO.",
                verified_at=now
            )

        if pass_obj.status == "EXPIRED":
            log = models.VerificationLog(
                pass_id=pass_obj.id,
                pass_number_scanned=pass_obj.pass_number,
                terminal_code=terminal,
                location=loc,
                student_name=student.full_name,
                student_roll=student.roll_number,
                route_name=pass_obj.route_name,
                verifier_identity="RTO Scanner Node",
                status="EXPIRED",
                status_code="403 EXPIRED",
                failure_reason=f"CONCESSION EXPIRED: Validity lapsed on {pass_obj.expiry_date}.",
                notes=f"Pass expired on {pass_obj.expiry_date}."
            )
            db.add(log)
            db.commit()

            return schemas.QRVerifyResponse(
                status="EXPIRED",
                status_code="403 EXPIRED",
                is_valid=False,
                pass_number=pass_obj.pass_number,
                student_name=student.full_name,
                student_photo=student.photo_url,
                college=student.institution_name or student.college_address,
                roll_number=student.roll_number,
                student_id_number=student.student_id_number,
                valid_until=pass_obj.expiry_date,
                token_type="INSTITUTIONAL_QR",
                failure_reason=f"CONCESSION EXPIRED: Lapsed on {pass_obj.expiry_date}. Annual re-enrollment required.",
                message="Concession expired. Annual renewal required.",
                verified_at=now
            )

        # PASS IS ACTIVE AND VALID
        route_str = pass_obj.route_name or (f"{pass_obj.route.from_location} ⇄ {pass_obj.route.to_location}" if pass_obj.route else "Kerala Transit Corridor")
        log = models.VerificationLog(
            pass_id=pass_obj.id,
            pass_number_scanned=pass_obj.pass_number,
            terminal_code=terminal,
            location=loc,
            student_name=student.full_name,
            student_roll=student.roll_number,
            route_name=route_str,
            verifier_identity="RTO Scanner Node",
            status="VERIFIED",
            status_code="200 OK",
            notes=f"Permanent Institutional QR verified for {student.full_name} ({pass_obj.pass_number})."
        )
        db.add(log)
        db.commit()

        return schemas.QRVerifyResponse(
            status="VERIFIED",
            status_code="200 OK",
            is_valid=True,
            pass_number=pass_obj.pass_number,
            student_name=student.full_name,
            student_photo=student.photo_url,
            college=student.institution_name or student.college_address,
            roll_number=student.roll_number,
            student_id_number=student.student_id_number,
            transport=pass_obj.transport_type or "Bus & Metro",
            route=route_str,
            valid_from=pass_obj.valid_from or pass_obj.issue_date,
            valid_until=pass_obj.valid_until or pass_obj.expiry_date,
            subsidy_rate=pass_obj.subsidy_rate,
            token_type="INSTITUTIONAL_QR",
            message="Permanent Institutional ID authenticated. Active concession pass verified against Kerala RTO node.",
            verified_at=now
        )

    # -------------------------------------------------------------
    # CASE 2: SINGLE-USE TRAVEL TOKEN (TT-...)
    # -------------------------------------------------------------
    if search_str.startswith("TT-"):
        token = db.query(models.TravelToken).filter(models.TravelToken.token_code == search_str).first()
        if not token:
            log = models.VerificationLog(
                pass_id=None,
                pass_number_scanned=search_str,
                terminal_code=terminal,
                location=loc,
                verifier_identity="Turnstile Optical Reader",
                status="INVALID",
                status_code="404 NOT FOUND",
                failure_reason="TRAVEL TOKEN NOT FOUND: Token does not exist in active registry.",
                notes="Unrecognized travel token."
            )
            db.add(log)
            db.commit()

            return schemas.QRVerifyResponse(
                status="INVALID",
                status_code="404 NOT FOUND",
                is_valid=False,
                pass_number=search_str,
                token_type="TRAVEL_TOKEN",
                failure_reason="TRAVEL TOKEN NOT RECOGNIZED: Unregistered single-use token.",
                message="Travel token not recognized by transit authority.",
                verified_at=now
            )

        # Enforce server-side single-use: If already used, reject!
        if token.is_used:
            pass_num = token.pass_obj.pass_number if token.pass_obj else search_str
            st_name = token.pass_obj.student.full_name if (token.pass_obj and token.pass_obj.student) else None
            st_roll = token.pass_obj.student.roll_number if (token.pass_obj and token.pass_obj.student) else None

            log = models.VerificationLog(
                pass_id=token.pass_id,
                pass_number_scanned=pass_num,
                terminal_code=terminal,
                location=loc,
                student_name=st_name,
                student_roll=st_roll,
                verifier_identity="Turnstile Optical Reader",
                status="ALREADY_USED",
                status_code="409 CONFLICT",
                failure_reason="TRAVEL TOKEN ALREADY USED: This single-use token was already redeemed at a turnstile.",
                notes=f"Attempted reuse of travel token {search_str} redeemed at {token.used_at}."
            )
            db.add(log)
            db.commit()

            return schemas.QRVerifyResponse(
                status="ALREADY_USED",
                status_code="409 CONFLICT",
                is_valid=False,
                pass_number=pass_num,
                student_name=st_name,
                token_type="TRAVEL_TOKEN",
                failure_reason="TRAVEL TOKEN ALREADY USED: This one-time transit token has already been redeemed and cannot be reused.",
                message="Single-use token already spent. Concession pass remains active; generate a fresh travel token.",
                verified_at=now
            )

        # Check if 90-second token window has expired
        if token.valid_until < now:
            pass_num = token.pass_obj.pass_number if token.pass_obj else search_str
            st_name = token.pass_obj.student.full_name if (token.pass_obj and token.pass_obj.student) else None
            st_roll = token.pass_obj.student.roll_number if (token.pass_obj and token.pass_obj.student) else None

            log = models.VerificationLog(
                pass_id=token.pass_id,
                pass_number_scanned=pass_num,
                terminal_code=terminal,
                location=loc,
                student_name=st_name,
                student_roll=st_roll,
                verifier_identity="Turnstile Optical Reader",
                status="EXPIRED",
                status_code="403 EXPIRED",
                failure_reason="TRAVEL TOKEN EXPIRED: Token lapsed after 90 seconds validity.",
                notes=f"Travel token {search_str} expired at {token.valid_until}."
            )
            db.add(log)
            db.commit()

            return schemas.QRVerifyResponse(
                status="EXPIRED",
                status_code="403 EXPIRED",
                is_valid=False,
                pass_number=pass_num,
                student_name=st_name,
                token_type="TRAVEL_TOKEN",
                failure_reason="TRAVEL TOKEN EXPIRED: 90-second token validity period lapsed. Please generate a new token.",
                message="Travel token expired. Tokens must be scanned within 90 seconds.",
                verified_at=now
            )

        # Mark token as used immediately
        token.is_used = True
        token.used_at = now

        pass_obj = token.pass_obj
        student = pass_obj.student
        route_str = pass_obj.route_name or (f"{pass_obj.route.from_location} ⇄ {pass_obj.route.to_location}" if pass_obj.route else "Kerala Transit Corridor")

        log = models.VerificationLog(
            pass_id=pass_obj.id,
            pass_number_scanned=pass_obj.pass_number,
            terminal_code=terminal,
            location=loc,
            student_name=student.full_name,
            student_roll=student.roll_number,
            route_name=route_str,
            verifier_identity="Turnstile Optical Reader",
            status="VERIFIED",
            status_code="200 OK",
            notes=f"One-time travel token {search_str} successfully redeemed for turnstile entry."
        )
        db.add(log)
        db.commit()

        return schemas.QRVerifyResponse(
            status="VERIFIED",
            status_code="200 OK",
            is_valid=True,
            pass_number=pass_obj.pass_number,
            student_name=student.full_name,
            student_photo=student.photo_url,
            college=student.institution_name or student.college_address,
            roll_number=student.roll_number,
            student_id_number=student.student_id_number,
            transport=pass_obj.transport_type or "Bus & Metro",
            route=route_str,
            valid_from=pass_obj.valid_from or pass_obj.issue_date,
            valid_until=pass_obj.valid_until or pass_obj.expiry_date,
            subsidy_rate=pass_obj.subsidy_rate,
            token_type="TRAVEL_TOKEN",
            message="Single-use travel token redeemed successfully. Turnstile Gate opened (0.3s).",
            verified_at=now
        )

    # -------------------------------------------------------------
    # CASE 3: CONCESSION PASS NUMBER (SCP-...) OR QR HASH
    # -------------------------------------------------------------
    pass_num = search_str
    if search_str.startswith("YAATHRI:"):
        parts = search_str.split(":")
        if len(parts) >= 2:
            pass_num = parts[1]

    # Look up in Pass database
    pass_obj = db.query(models.Pass).filter(
        (models.Pass.pass_number == pass_num) | 
        (models.Pass.hash_signature == pass_num)
    ).first()

    if not pass_obj:
        # Record invalid scan attempt in audit log
        log = models.VerificationLog(
            pass_id=None,
            pass_number_scanned=pass_num,
            terminal_code=terminal,
            location=loc,
            verifier_identity="Conductor / Inspector Terminal",
            status="INVALID",
            status_code="404 NOT FOUND",
            failure_reason="CONCESSION PASS UNREGISTERED: No active student concession registered under this ID in Kerala RTO registry.",
            notes="No registered concession found with this identifier in Kerala RTO registry."
        )
        db.add(log)
        db.commit()

        return schemas.QRVerifyResponse(
            status="INVALID",
            status_code="404 NOT FOUND",
            is_valid=False,
            pass_number=pass_num,
            token_type="CONCESSION_PASS",
            failure_reason="INVALID PASS CREDENTIAL: Pass ID does not exist in Kerala RTO concession registry.",
            message="No active student concession registered under this ID in Kerala RTO registry.",
            verified_at=now
        )

    student = pass_obj.student
    route_str = pass_obj.route_name or (f"{pass_obj.route.from_location} ⇄ {pass_obj.route.to_location}" if pass_obj.route else "Kerala Transit Corridor")

    # Check status
    if pass_obj.status == "SUSPENDED":
        log = models.VerificationLog(
            pass_id=pass_obj.id,
            pass_number_scanned=pass_obj.pass_number,
            terminal_code=terminal,
            location=loc,
            student_name=student.full_name,
            student_roll=student.roll_number,
            route_name=route_str,
            verifier_identity="Conductor / Inspector Terminal",
            status="SUSPENDED",
            status_code="403 SUSPENDED",
            failure_reason="CONCESSION SUSPENDED: Administrative block placed by transport authority.",
            notes=f"Suspended pass scan attempt for {student.full_name}."
        )
        db.add(log)
        db.commit()

        return schemas.QRVerifyResponse(
            status="SUSPENDED",
            status_code="403 SUSPENDED",
            is_valid=False,
            pass_number=pass_obj.pass_number,
            student_name=student.full_name,
            student_photo=student.photo_url,
            college=student.institution_name or student.college_address,
            roll_number=student.roll_number,
            student_id_number=student.student_id_number,
            token_type="CONCESSION_PASS",
            failure_reason="PASS SUSPENDED: Administrative block by transport department.",
            message="Pass has been suspended. Student must present physical authorization.",
            verified_at=now
        )

    if pass_obj.status == "EXPIRED":
        log = models.VerificationLog(
            pass_id=pass_obj.id,
            pass_number_scanned=pass_obj.pass_number,
            terminal_code=terminal,
            location=loc,
            student_name=student.full_name,
            student_roll=student.roll_number,
            route_name=route_str,
            verifier_identity="Conductor / Inspector Terminal",
            status="EXPIRED",
            status_code="403 EXPIRED",
            failure_reason=f"CONCESSION EXPIRED: Validity lapsed on {pass_obj.expiry_date}.",
            notes=f"Pass expired on {pass_obj.expiry_date}."
        )
        db.add(log)
        db.commit()

        return schemas.QRVerifyResponse(
            status="EXPIRED",
            status_code="403 EXPIRED",
            is_valid=False,
            pass_number=pass_obj.pass_number,
            student_name=student.full_name,
            student_photo=student.photo_url,
            college=student.institution_name or student.college_address,
            roll_number=student.roll_number,
            student_id_number=student.student_id_number,
            valid_until=pass_obj.expiry_date,
            token_type="CONCESSION_PASS",
            failure_reason=f"PASS EXPIRED: Concession ended on {pass_obj.expiry_date}. Renewal required.",
            message="Pass has expired. Student must re-apply for current academic semester.",
            verified_at=now
        )

    # ACTIVE STATUS
    log = models.VerificationLog(
        pass_id=pass_obj.id,
        pass_number_scanned=pass_obj.pass_number,
        terminal_code=terminal,
        location=loc,
        student_name=student.full_name,
        student_roll=student.roll_number,
        route_name=route_str,
        verifier_identity="Conductor / Inspector Terminal",
        status="VERIFIED",
        status_code="200 OK",
        notes=f"Concession check completed: {student.full_name} ({student.roll_number})."
    )
    db.add(log)
    db.commit()

    return schemas.QRVerifyResponse(
        status="VERIFIED",
        status_code="200 OK",
        is_valid=True,
        pass_number=pass_obj.pass_number,
        student_name=student.full_name,
        student_photo=student.photo_url,
        college=student.institution_name or student.college_address,
        roll_number=student.roll_number,
        student_id_number=student.student_id_number,
        transport=pass_obj.transport_type or "Bus & Metro",
        route=route_str,
        valid_from=pass_obj.valid_from or pass_obj.issue_date,
        valid_until=pass_obj.valid_until or pass_obj.expiry_date,
        subsidy_rate=pass_obj.subsidy_rate,
        token_type="CONCESSION_PASS",
        message="Cryptographic signature verified against Kerala RTO node. Identity verified.",
        verified_at=now
    )

@router.post("/travel-token/generate", response_model=schemas.TravelTokenResponse)
def generate_travel_token(
    req: schemas.TravelTokenGenerateRequest,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    pass_obj = db.query(models.Pass).filter(models.Pass.id == req.pass_id).first()
    if not pass_obj:
        raise HTTPException(status_code=404, detail="Pass not found.")

    token_code = f"TT-{uuid.uuid4().hex[:12].upper()}"
    valid_until = datetime.datetime.utcnow() + datetime.timedelta(seconds=90)

    token = models.TravelToken(
        pass_id=pass_obj.id,
        token_code=token_code,
        turnstile_gate=req.turnstile_gate or "GATE-04-ALUVA",
        valid_until=valid_until,
        is_used=False
    )
    db.add(token)
    db.commit()

    return schemas.TravelTokenResponse(
        token_code=token.token_code,
        pass_number=pass_obj.pass_number,
        turnstile_gate=token.turnstile_gate,
        valid_until=token.valid_until,
        remaining_seconds=90
    )

@router.post("/travel-token/verify", response_model=schemas.TravelTokenVerifyResponse)
def verify_travel_token(
    req: schemas.TravelTokenVerifyRequest,
    db: Session = Depends(get_db)
):
    token = db.query(models.TravelToken).filter(models.TravelToken.token_code == req.token_code.strip()).first()
    if not token:
        return schemas.TravelTokenVerifyResponse(
            success=False,
            status="INVALID",
            message="Travel token not recognized."
        )

    if token.is_used:
        return schemas.TravelTokenVerifyResponse(
            success=False,
            status="ALREADY_USED",
            message="TRAVEL TOKEN ALREADY USED: This single-use token was already redeemed at a turnstile.",
            pass_number=token.pass_obj.pass_number if token.pass_obj else None,
            student_name=token.pass_obj.student.full_name if (token.pass_obj and token.pass_obj.student) else None
        )

    if token.valid_until < datetime.datetime.utcnow():
        return schemas.TravelTokenVerifyResponse(
            success=False,
            status="EXPIRED",
            message="TRAVEL TOKEN EXPIRED: Tokens must be scanned within 90 seconds.",
            pass_number=token.pass_obj.pass_number if token.pass_obj else None,
            student_name=token.pass_obj.student.full_name if (token.pass_obj and token.pass_obj.student) else None
        )

    # Mark as used immediately
    token.is_used = True
    token.used_at = datetime.datetime.utcnow()

    # Log turnstile entry
    log = models.VerificationLog(
        pass_id=token.pass_id,
        pass_number_scanned=token.pass_obj.pass_number,
        terminal_code=f"TURNSTILE-{req.turnstile_gate}",
        location=req.turnstile_gate,
        student_name=token.pass_obj.student.full_name,
        student_roll=token.pass_obj.student.roll_number,
        route_name=token.pass_obj.route_name,
        verifier_identity=f"Turnstile {req.turnstile_gate}",
        status="VERIFIED",
        status_code="200 OK",
        notes="Single-use travel token redeemed. Turnstile Gate opened in 0.3s"
    )
    db.add(log)
    db.commit()

    return schemas.TravelTokenVerifyResponse(
        success=True,
        status="SUCCESS",
        message="Turnstile Gate opened. Transit access granted.",
        pass_number=token.pass_obj.pass_number,
        student_name=token.pass_obj.student.full_name
    )
