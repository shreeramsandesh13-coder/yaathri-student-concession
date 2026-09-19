from pydantic import BaseModel, Field
from typing import Optional, List
import datetime

# --- Auth Schemas ---
class UserRegister(BaseModel):
    email: str = Field(..., description="Valid email address")
    password: str = Field(..., min_length=6, description="Password must be at least 6 characters")
    full_name: str
    roll_number: str
    phone: str
    college_name: Optional[str] = "Christ College of Engineering, Irinjalakuda"
    course: Optional[str] = "B.Tech Computer Science"

class UserLogin(BaseModel):
    email: str
    password: str

class ForgotPasswordRequest(BaseModel):
    email: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"

class UserOut(BaseModel):
    id: int
    email: str
    role: str
    is_active: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# --- Student Schemas ---
class StudentOut(BaseModel):
    id: int
    user_id: int
    full_name: str
    roll_number: str
    student_id_number: Optional[str] = "STU-2024-8841"
    institution_name: Optional[str] = None
    institution_type: Optional[str] = "College"
    course: str
    semester: Optional[str] = "Semester 5"
    year_semester: str
    phone: str
    age: str
    dob: str
    blood_group: str
    emergency_phone: str
    student_address: str
    college_address: str
    photo_url: Optional[str] = None
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class UserMeResponse(BaseModel):
    user: UserOut
    student: Optional[StudentOut] = None

# --- Route & Stop Schemas ---
class StopOut(BaseModel):
    id: int
    stop_name: str
    sequence_order: int

    class Config:
        from_attributes = True

class RouteOut(BaseModel):
    id: int
    route_code: str
    from_location: str
    to_location: str
    corridor: str
    distance_km: float
    fleet_type: str
    ksrtc_subsidy_pct: float
    metro_subsidy_pct: float
    fare_daily: str
    is_active: bool
    stops: List[StopOut] = []

    class Config:
        from_attributes = True

class RouteCreate(BaseModel):
    route_code: str
    from_location: str
    to_location: str
    corridor: str
    distance_km: float = 75.0
    fleet_type: str = "Combined Intermodal (80% KSRTC + 50% Metro)"
    ksrtc_subsidy_pct: float = 80.0
    metro_subsidy_pct: float = 50.0
    fare_daily: str = "₹12"
    stops: List[str] = []

# --- Document Schemas ---
class DocumentOut(BaseModel):
    id: int
    doc_type: str
    file_name: str
    file_url: Optional[str]
    uploaded_at: datetime.datetime

    class Config:
        from_attributes = True

# --- Pass Schemas ---
class PassOut(BaseModel):
    id: int
    pass_number: str
    student_id: int
    route_id: Optional[int] = None
    issue_date: str
    expiry_date: str
    status: str
    daily_fare: str
    subsidy_rate: str
    hash_signature: str
    created_at: datetime.datetime
    student: Optional[StudentOut] = None
    route: Optional[RouteOut] = None

    class Config:
        from_attributes = True

# --- Application Schemas ---
class ApplicationCreate(BaseModel):
    route_id: Optional[int] = 1
    academic_year: str = "2024–2027"
    transport_mode: Optional[str] = "Bus"
    starting_point: Optional[str] = None
    destination: Optional[str] = None
    corridor: Optional[str] = None
    validity_start: Optional[str] = "01 / 06 / 2026"
    validity_end: Optional[str] = "31 / 03 / 2027"
    photo_url: Optional[str] = None
    student_id_doc_name: Optional[str] = "student_college_id.pdf"
    bonafide_doc_name: Optional[str] = "bonafide_certificate.pdf"
    supporting_doc_name: Optional[str] = None

class ApplicationOut(BaseModel):
    id: int
    application_number: str
    student_id: int
    route_id: Optional[int] = None
    transport_mode: Optional[str] = "Bus"
    starting_point: Optional[str] = None
    destination: Optional[str] = None
    route_name: Optional[str] = None
    validity_start: Optional[str] = None
    validity_end: Optional[str] = None
    academic_year: str
    status: str
    applied_at: datetime.datetime
    reviewed_at: Optional[datetime.datetime] = None
    reviewer_notes: Optional[str] = None
    rejection_reason: Optional[str] = None
    reviewer_name: Optional[str] = None
    student: Optional[StudentOut] = None
    route: Optional[RouteOut] = None
    documents: List[DocumentOut] = []
    issued_pass: Optional[PassOut] = None

    class Config:
        from_attributes = True

class ApplicationReviewRequest(BaseModel):
    action: Optional[str] = Field("APPROVE", description="'APPROVE' or 'REJECT'")
    reviewer_notes: Optional[str] = None
    rejection_reason: Optional[str] = None

# --- Admin Statistics Schemas ---
class AdminStatsOut(BaseModel):
    total_applications: int
    pending_applications: int
    approved_applications: int
    rejected_applications: int
    active_passes: int
    expired_passes: int
    total_students: int

# --- QR & Token Schemas ---
class QRGenerateRequest(BaseModel):
    pass_id: int

class QRResponse(BaseModel):
    pass_id: int
    pass_number: str
    qr_payload: str
    signature: str
    expires_at: Optional[datetime.datetime]

class QRVerifyRequest(BaseModel):
    pass_number_or_qr: str
    terminal_code: Optional[str] = "TERMINAL-KL-RTO-TCR"
    location: Optional[str] = "Aluva Metro Station Turnstile #4"

class QRVerifyResponse(BaseModel):
    status: str  # "VERIFIED", "EXPIRED", "INVALID"
    status_code: str
    pass_number: str
    student_name: Optional[str] = None
    college: Optional[str] = None
    route: Optional[str] = None
    valid_until: Optional[str] = None
    subsidy_rate: Optional[str] = None
    message: str

class TravelTokenGenerateRequest(BaseModel):
    pass_id: int
    turnstile_gate: Optional[str] = "GATE-04-ALUVA"

class TravelTokenResponse(BaseModel):
    token_code: str
    pass_number: str
    turnstile_gate: str
    valid_until: datetime.datetime
    remaining_seconds: int

class TravelTokenVerifyRequest(BaseModel):
    token_code: str
    turnstile_gate: Optional[str] = "GATE-04-ALUVA"

class TravelTokenVerifyResponse(BaseModel):
    success: bool
    status: str
    message: str
    pass_number: Optional[str] = None
    student_name: Optional[str] = None

# --- Verification Log Schemas ---
class VerificationLogOut(BaseModel):
    id: int
    pass_number_scanned: str
    terminal_code: str
    location: str
    status: str
    status_code: str
    notes: Optional[str]
    verified_at: datetime.datetime

    class Config:
        from_attributes = True

# --- Notification Schemas ---
class NotificationOut(BaseModel):
    id: int
    title: str
    message: str
    type: str
    is_read: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True
