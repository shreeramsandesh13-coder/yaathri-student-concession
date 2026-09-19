import os
import hashlib
import hmac
import base64
import json
import time
from typing import Optional, List
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
import models

# Secret key for HMAC token signing (in production, set via YAATHRI_SECRET_KEY env var)
SECRET_KEY = os.environ.get("YAATHRI_SECRET_KEY", "yaathri-kerala-transit-super-secret-key-2026-v2")
TOKEN_EXPIRE_SECONDS = 60 * 60 * 24 * 7  # 7 days

security = HTTPBearer(auto_error=False)

def hash_password(password: str) -> str:
    """Hashes a password using PBKDF2-HMAC-SHA256 with a random 16-byte salt."""
    salt = os.urandom(16)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 100000)
    return f"{salt.hex()}${dk.hex()}"

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifies a plain password against the stored salt$hash."""
    try:
        salt_hex, dk_hex = hashed_password.split("$")
        salt = bytes.fromhex(salt_hex)
        expected_dk = bytes.fromhex(dk_hex)
        new_dk = hashlib.pbkdf2_hmac("sha256", plain_password.encode("utf-8"), salt, 100000)
        return hmac.compare_digest(new_dk, expected_dk)
    except Exception:
        return False

def create_access_token(user_id: int, email: str, role: str) -> str:
    """Creates a base64url-encoded HMAC-SHA256 signed bearer token."""
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "exp": int(time.time()) + TOKEN_EXPIRE_SECONDS
    }
    payload_json = json.dumps(payload, separators=(',', ':')).encode('utf-8')
    payload_b64 = base64.urlsafe_b64encode(payload_json).decode('utf-8').rstrip('=')
    
    # Sign payload
    signature = hmac.new(SECRET_KEY.encode('utf-8'), payload_b64.encode('utf-8'), hashlib.sha256).digest()
    sig_b64 = base64.urlsafe_b64encode(signature).decode('utf-8').rstrip('=')
    
    return f"{payload_b64}.{sig_b64}"

def decode_access_token(token: str) -> Optional[dict]:
    """Decodes and cryptographically validates the token and its expiration."""
    try:
        parts = token.split(".")
        if len(parts) != 2:
            return None
        payload_b64, sig_b64 = parts
        
        # Verify signature
        expected_sig = hmac.new(SECRET_KEY.encode('utf-8'), payload_b64.encode('utf-8'), hashlib.sha256).digest()
        expected_sig_b64 = base64.urlsafe_b64encode(expected_sig).decode('utf-8').rstrip('=')
        if not hmac.compare_digest(sig_b64, expected_sig_b64):
            return None
        
        # Decode payload with padding
        padding = '=' * (4 - (len(payload_b64) % 4)) if len(payload_b64) % 4 != 0 else ''
        payload_json = base64.urlsafe_b64decode(payload_b64 + padding).decode('utf-8')
        payload = json.loads(payload_json)
        
        # Check expiration
        if payload.get("exp", 0) < time.time():
            return None
        
        return payload
    except Exception:
        return None

def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> models.User:
    """Dependency to retrieve the authenticated user from the Bearer token."""
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please provide a valid Bearer token.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    payload = decode_access_token(credentials.credentials)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired authentication token.",
            headers={"WWW-Authenticate": "Bearer"}
        )
    
    user_id = payload.get("sub")
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account not found or disabled."
        )
    return user

def require_role(allowed_roles: List[str]):
    """Role-based access control dependency factory."""
    def role_checker(current_user: models.User = Depends(get_current_user)) -> models.User:
        if current_user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access forbidden: requires one of the following roles: {', '.join(allowed_roles)}"
            )
        return current_user
    return role_checker

