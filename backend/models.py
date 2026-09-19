import datetime
from typing import Optional, List
from sqlalchemy import Integer, String, Boolean, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship, Mapped, mapped_column
from database import Base

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="STUDENT", nullable=False)  # "STUDENT" | "ADMIN"
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    student_profile = relationship("Student", back_populates="user", uselist=False, cascade="all, delete-orphan")
    verifier_profile = relationship("Verifier", back_populates="user", uselist=False, cascade="all, delete-orphan")
    institution_profile = relationship("Institution", back_populates="user", uselist=False)
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

class Institution(Base):
    __tablename__ = "institutions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    address: Mapped[str] = mapped_column(String(255), nullable=False)
    district: Mapped[str] = mapped_column(String(100), nullable=False)
    principal_name: Mapped[str] = mapped_column(String(150), nullable=False)
    contact_phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="institution_profile")
    students = relationship("Student", back_populates="institution")

class Student(Base):
    __tablename__ = "students"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    institution_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("institutions.id"), nullable=True)
    
    full_name: Mapped[str] = mapped_column(String(150), nullable=False)
    roll_number: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    student_id_number: Mapped[Optional[str]] = mapped_column(String(50), default="STU-2024-8841", nullable=True)
    institution_name: Mapped[Optional[str]] = mapped_column(String(200), default="Christ College of Engineering, Irinjalakuda", nullable=True)
    institution_type: Mapped[Optional[str]] = mapped_column(String(50), default="College", nullable=True)
    course: Mapped[str] = mapped_column(String(100), default="B.Tech Computer Science")
    semester: Mapped[Optional[str]] = mapped_column(String(50), default="Semester 5", nullable=True)
    year_semester: Mapped[str] = mapped_column(String(50), default="3rd Year (Semester 5)")
    phone: Mapped[str] = mapped_column(String(50), nullable=False)
    age: Mapped[str] = mapped_column(String(10), default="21")
    dob: Mapped[str] = mapped_column(String(30), default="14 / 08 / 2003")
    blood_group: Mapped[str] = mapped_column(String(20), default="O +ve")
    emergency_phone: Mapped[str] = mapped_column(String(50), default="+91 94471 98765")
    student_address: Mapped[str] = mapped_column(Text, default="Flat 4B, Emerald Heights, Mission Quarters, Thrissur – 680001")
    college_address: Mapped[str] = mapped_column(Text, default="Christ College of Engineering, Irinjalakuda, Thrissur – 680125")
    photo_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    institutional_qr_code: Mapped[Optional[str]] = mapped_column(String(100), unique=True, index=True, nullable=True)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="student_profile")
    institution = relationship("Institution", back_populates="students")
    applications = relationship("Application", back_populates="student", cascade="all, delete-orphan")
    passes = relationship("Pass", back_populates="student", cascade="all, delete-orphan")

class Route(Base):
    __tablename__ = "routes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    route_code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    from_location: Mapped[str] = mapped_column(String(150), nullable=False)
    to_location: Mapped[str] = mapped_column(String(150), nullable=False)
    corridor: Mapped[str] = mapped_column(String(255), nullable=False)
    distance_km: Mapped[float] = mapped_column(Float, default=74.5)
    fleet_type: Mapped[str] = mapped_column(String(100), default="Combined Intermodal (80% KSRTC + 50% Metro)")
    ksrtc_subsidy_pct: Mapped[float] = mapped_column(Float, default=80.0)
    metro_subsidy_pct: Mapped[float] = mapped_column(Float, default=50.0)
    fare_daily: Mapped[str] = mapped_column(String(20), default="₹12")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    stops = relationship("Stop", back_populates="route", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="route")
    passes = relationship("Pass", back_populates="route")

class Stop(Base):
    __tablename__ = "stops"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    route_id: Mapped[int] = mapped_column(Integer, ForeignKey("routes.id"), nullable=False)
    stop_name: Mapped[str] = mapped_column(String(150), nullable=False)
    sequence_order: Mapped[int] = mapped_column(Integer, default=1)

    # Relationships
    route = relationship("Route", back_populates="stops")

class Application(Base):
    __tablename__ = "applications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    application_number: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    student_id: Mapped[int] = mapped_column(Integer, ForeignKey("students.id"), nullable=False)
    route_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("routes.id"), nullable=True)
    transport_mode: Mapped[Optional[str]] = mapped_column(String(50), default="Bus", nullable=True)
    starting_point: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    destination: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    route_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    validity_start: Mapped[Optional[str]] = mapped_column(String(50), default="01 / 06 / 2026", nullable=True)
    validity_end: Mapped[Optional[str]] = mapped_column(String(50), default="31 / 03 / 2027", nullable=True)
    academic_year: Mapped[Optional[str]] = mapped_column(String(50), default="2024–2027", nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="PENDING", index=True)  # PENDING, APPROVED, REJECTED
    applied_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)
    reviewed_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime, nullable=True)
    reviewer_notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    rejection_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    reviewer_name: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)

    # Relationships
    student = relationship("Student", back_populates="applications")
    route = relationship("Route", back_populates="applications")
    documents = relationship("Document", back_populates="application", cascade="all, delete-orphan")
    issued_pass = relationship("Pass", back_populates="application", uselist=False)

class Document(Base):
    __tablename__ = "documents"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    application_id: Mapped[int] = mapped_column(Integer, ForeignKey("applications.id"), nullable=False)
    doc_type: Mapped[str] = mapped_column(String(50), nullable=False)  # "COLLEGE_ID", "PHOTO", "FEE_RECEIPT"
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    file_size_bytes: Mapped[int] = mapped_column(Integer, default=0)
    uploaded_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    application = relationship("Application", back_populates="documents")

class Pass(Base):
    __tablename__ = "passes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    pass_number: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    student_id: Mapped[int] = mapped_column(Integer, ForeignKey("students.id"), nullable=False)
    route_id: Mapped[int] = mapped_column(Integer, ForeignKey("routes.id"), nullable=False)
    application_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("applications.id"), nullable=True)
    
    # Snapshot details
    student_name: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    student_photo_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    institution_name: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    course: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    roll_number: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    student_id_number: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    transport_type: Mapped[Optional[str]] = mapped_column(String(50), default="Bus", nullable=True)
    starting_point: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    destination: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    route_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    valid_from: Mapped[Optional[str]] = mapped_column(String(30), default="01 / 06 / 2024", nullable=True)
    valid_until: Mapped[Optional[str]] = mapped_column(String(30), default="31 / 03 / 2027", nullable=True)

    issue_date: Mapped[Optional[str]] = mapped_column(String(30), default="01 / 06 / 2024", nullable=True)
    expiry_date: Mapped[Optional[str]] = mapped_column(String(30), default="31 / 03 / 2027", nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="ACTIVE", index=True)  # ACTIVE, EXPIRED, SUSPENDED
    daily_fare: Mapped[Optional[str]] = mapped_column(String(20), default="₹12", nullable=True)
    subsidy_rate: Mapped[Optional[str]] = mapped_column(String(50), default="80% KSRTC / 50% METRO", nullable=True)
    hash_signature: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    student = relationship("Student", back_populates="passes")
    route = relationship("Route", back_populates="passes")
    application = relationship("Application", back_populates="issued_pass")
    qr_credentials = relationship("QRCredential", back_populates="pass_obj", cascade="all, delete-orphan")
    travel_tokens = relationship("TravelToken", back_populates="pass_obj", cascade="all, delete-orphan")
    verification_logs = relationship("VerificationLog", back_populates="pass_obj", cascade="all, delete-orphan")

class QRCredential(Base):
    __tablename__ = "qr_credentials"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    pass_id: Mapped[int] = mapped_column(Integer, ForeignKey("passes.id"), nullable=False)
    qr_payload: Mapped[str] = mapped_column(Text, nullable=False)
    signature: Mapped[str] = mapped_column(String(255), nullable=False)
    generated_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)
    expires_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime, nullable=True)

    # Relationships
    pass_obj = relationship("Pass", back_populates="qr_credentials")

class TravelToken(Base):
    __tablename__ = "travel_tokens"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    pass_id: Mapped[int] = mapped_column(Integer, ForeignKey("passes.id"), nullable=False)
    token_code: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    turnstile_gate: Mapped[Optional[str]] = mapped_column(String(50), default="GATE-04-ALUVA", nullable=True)
    issued_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)
    valid_until: Mapped[datetime.datetime] = mapped_column(DateTime, nullable=False)
    is_used: Mapped[bool] = mapped_column(Boolean, default=False)
    used_at: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime, nullable=True)

    # Relationships
    pass_obj = relationship("Pass", back_populates="travel_tokens")

class TransportOperator(Base):
    __tablename__ = "transport_operators"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)  # "Kerala State Road Transport Corporation", "ABC Travels", "Kochi Metro Rail Limited"
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)  # "KSRTC", "ABC-TRV", "KMRL"
    operator_type: Mapped[str] = mapped_column(String(50), nullable=False)  # "KSRTC", "PRIVATE_BUS", "METRO"
    contact_phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    contact_email: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    headquarters: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    vehicles = relationship("Vehicle", back_populates="operator", cascade="all, delete-orphan")
    verifiers = relationship("Verifier", back_populates="operator")

class Vehicle(Base):
    __tablename__ = "vehicles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    operator_id: Mapped[int] = mapped_column(Integer, ForeignKey("transport_operators.id"), nullable=False)
    vehicle_type: Mapped[str] = mapped_column(String(50), default="BUS")  # "BUS" | "METRO_STATION"
    vehicle_number: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # "KL-15-A-1234"
    device_id: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # "ALUVA-GATE-04"
    station_name: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)  # "Aluva Metro Station"
    depot: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # "Thrissur Central Depot"
    assigned_route: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)  # "Thrissur → Ernakulam"
    route_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("routes.id"), nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    operator = relationship("TransportOperator", back_populates="vehicles")
    verifiers = relationship("Verifier", back_populates="vehicle")

class Verifier(Base):
    __tablename__ = "verifiers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    verifier_code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)  # "KSRTC-V1024", "PB-V2041", "METRO-V3012"
    full_name: Mapped[str] = mapped_column(String(150), nullable=False)
    transport_type: Mapped[str] = mapped_column(String(50), nullable=False)  # "KSRTC", "PRIVATE_BUS", "METRO"
    operator_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("transport_operators.id"), nullable=True)
    operator_name: Mapped[str] = mapped_column(String(200), default="KSRTC")
    vehicle_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("vehicles.id"), nullable=True)
    bus_number: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # "KL-15-A-1234"
    assigned_route: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)  # "Thrissur → Ernakulam"
    depot: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)  # "Thrissur Depot"
    station_device_id: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # "ALUVA-GATE-04"
    station_name: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)  # "Aluva Metro Station"
    phone: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    status: Mapped[str] = mapped_column(String(50), default="ACTIVE")  # "ACTIVE", "SUSPENDED"
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="verifier_profile")
    operator = relationship("TransportOperator", back_populates="verifiers")
    vehicle = relationship("Vehicle", back_populates="verifiers")
    verification_logs = relationship("VerificationLog", back_populates="verifier")

class VerificationLog(Base):
    __tablename__ = "verification_logs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    pass_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("passes.id"), nullable=True)
    pass_number_scanned: Mapped[str] = mapped_column(String(50), index=True, nullable=False)
    terminal_code: Mapped[str] = mapped_column(String(100), default="TERMINAL-KL-RTO-TCR")
    location: Mapped[str] = mapped_column(String(150), default="Aluva Metro Station Turnstile #4")
    student_name: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    student_roll: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    route_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    verifier_identity: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    
    # Server-derived verifier transport details
    verifier_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("verifiers.id"), nullable=True)
    verifier_code: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    verifier_name: Mapped[Optional[str]] = mapped_column(String(150), nullable=True)
    transport_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # "KSRTC", "PRIVATE_BUS", "METRO"
    transport_operator: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    vehicle_number: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # "KL-15-A-1234"
    station_device_id: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # "ALUVA-GATE-04"
    result: Mapped[str] = mapped_column(String(50), default="VALID")  # "VALID", "INVALID"

    status: Mapped[str] = mapped_column(String(50), nullable=False)  # "VERIFIED", "EXPIRED", "INVALID", "ALREADY_USED"
    status_code: Mapped[str] = mapped_column(String(50), default="200 OK")
    failure_reason: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    notes: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    verified_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    pass_obj = relationship("Pass", back_populates="verification_logs")
    verifier = relationship("Verifier", back_populates="verification_logs")

class Notification(Base):
    __tablename__ = "notifications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    title: Mapped[str] = mapped_column(String(150), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    type: Mapped[str] = mapped_column(String(50), default="INFO")  # "SUCCESS", "INFO", "WARNING", "ALERT"
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="notifications")
