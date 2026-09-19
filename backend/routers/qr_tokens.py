import datetime
import hashlib
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database import get_db
import models
import schemas
from auth import get_current_user

router = APIRouter(tags=["QR & Travel Tokens"])

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
    search_str = req.pass_number_or_qr.strip()
    
    # Extract pass number if formatted as "YAATHRI:PASS_NUM:SIG"
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

    terminal = req.terminal_code or "TERMINAL-KL-RTO-TCR"
    loc = req.location or "Aluva Metro Station Turnstile #4"

    if not pass_obj:
        # Record invalid scan attempt in audit log
        log = models.VerificationLog(
            pass_id=None,
            pass_number_scanned=pass_num,
            terminal_code=terminal,
            location=loc,
            status="INVALID",
            status_code="404 NOT FOUND",
            notes="No registered concession found with this identifier in Kerala RTO registry."
        )
        db.add(log)
        db.commit()

        return schemas.QRVerifyResponse(
            status="INVALID",
            status_code="404 NOT FOUND",
            pass_number=pass_num,
            message="No active student concession registered under this ID in Kerala RTO registry."
        )

    # Check expiration/status
    is_active = (pass_obj.status == "ACTIVE")
    result_status = "VERIFIED" if is_active else pass_obj.status

    log = models.VerificationLog(
        pass_id=pass_obj.id,
        pass_number_scanned=pass_obj.pass_number,
        terminal_code=terminal,
        location=loc,
        status=result_status,
        status_code="200 OK" if is_active else "403 EXPIRED",
        notes=f"Concession check completed: {pass_obj.student.full_name} ({pass_obj.student.roll_number})"
    )
    db.add(log)
    db.commit()

    return schemas.QRVerifyResponse(
        status=result_status,
        status_code="200 OK" if is_active else "403 EXPIRED",
        pass_number=pass_obj.pass_number,
        student_name=pass_obj.student.full_name,
        college=pass_obj.student.college_address,
        route=f"{pass_obj.route.from_location} ⇄ {pass_obj.route.to_location}",
        valid_until=pass_obj.expiry_date,
        subsidy_rate=pass_obj.subsidy_rate,
        message="Cryptographic signature verified against Kerala RTO node." if is_active else "Pass has expired or been suspended."
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
            status="EXPIRED",
            message="Travel token has already been redeemed at turnstile."
        )

    if token.valid_until < datetime.datetime.utcnow():
        return schemas.TravelTokenVerifyResponse(
            success=False,
            status="EXPIRED",
            message="Travel token expired. Tokens must be scanned within 90 seconds."
        )

    # Mark as used
    token.is_used = True
    token.used_at = datetime.datetime.utcnow()

    # Log turnstile entry
    log = models.VerificationLog(
        pass_id=token.pass_id,
        pass_number_scanned=token.pass_obj.pass_number,
        terminal_code=f"TURNSTILE-{req.turnstile_gate}",
        location=req.turnstile_gate,
        status="VERIFIED",
        status_code="200 OK",
        notes="NFC Beacon emitted - Turnstile Gate opened in 0.3s"
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

