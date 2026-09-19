import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Float
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50), default="STUDENT", nullable=False)  # "STUDENT" | "ADMIN"
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    student_profile = relationship("Student", back_populates="user", uselist=False, cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

class Institution(Base):
    __tablename__ = "institutions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    code = Column(String(50), unique=True, index=True, nullable=False)
    address = Column(String(255), nullable=False)
    district = Column(String(100), nullable=False)
    principal_name = Column(String(150), nullable=False)
    contact_phone = Column(String(50))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    students = relationship("Student", back_populates="institution")

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=True)
    
    full_name = Column(String(150), nullable=False)
    roll_number = Column(String(50), index=True, nullable=False)
    student_id_number = Column(String(50), default="STU-2024-8841")
    institution_name = Column(String(200), default="Christ College of Engineering, Irinjalakuda")
    institution_type = Column(String(50), default="College")
    course = Column(String(100), default="B.Tech Computer Science")
    semester = Column(String(50), default="Semester 5")
    year_semester = Column(String(50), default="3rd Year (Semester 5)")
    phone = Column(String(50), nullable=False)
    age = Column(String(10), default="21")
    dob = Column(String(30), default="14 / 08 / 2003")
    blood_group = Column(String(20), default="O +ve")
    emergency_phone = Column(String(50), default="+91 94471 98765")
    student_address = Column(Text, default="Flat 4B, Emerald Heights, Mission Quarters, Thrissur – 680001")
    college_address = Column(Text, default="Christ College of Engineering, Irinjalakuda, Thrissur – 680125")
    photo_url = Column(Text, nullable=True)
    institutional_qr_code = Column(String(100), unique=True, index=True, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="student_profile")
    institution = relationship("Institution", back_populates="students")
    applications = relationship("Application", back_populates="student", cascade="all, delete-orphan")
    passes = relationship("Pass", back_populates="student", cascade="all, delete-orphan")

class Route(Base):
    __tablename__ = "routes"

    id = Column(Integer, primary_key=True, index=True)
    route_code = Column(String(50), unique=True, index=True, nullable=False)
    from_location = Column(String(150), nullable=False)
    to_location = Column(String(150), nullable=False)
    corridor = Column(String(255), nullable=False)
    distance_km = Column(Float, default=74.5)
    fleet_type = Column(String(100), default="Combined Intermodal (80% KSRTC + 50% Metro)")
    ksrtc_subsidy_pct = Column(Float, default=80.0)
    metro_subsidy_pct = Column(Float, default=50.0)
    fare_daily = Column(String(20), default="₹12")
    is_active = Column(Boolean, default=True)

    # Relationships
    stops = relationship("Stop", back_populates="route", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="route")
    passes = relationship("Pass", back_populates="route")

class Stop(Base):
    __tablename__ = "stops"

    id = Column(Integer, primary_key=True, index=True)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=False)
    stop_name = Column(String(150), nullable=False)
    sequence_order = Column(Integer, default=1)

    # Relationships
    route = relationship("Route", back_populates="stops")

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    application_number = Column(String(50), unique=True, index=True, nullable=False)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=True)
    transport_mode = Column(String(50), default="Bus")
    starting_point = Column(String(150), nullable=True)
    destination = Column(String(150), nullable=True)
    route_name = Column(String(255), nullable=True)
    validity_start = Column(String(50), default="01 / 06 / 2026")
    validity_end = Column(String(50), default="31 / 03 / 2027")
    academic_year = Column(String(50), default="2024–2027")
    status = Column(String(50), default="PENDING", index=True)  # PENDING, APPROVED, REJECTED
    applied_at = Column(DateTime, default=datetime.datetime.utcnow)
    reviewed_at = Column(DateTime, nullable=True)
    reviewer_notes = Column(Text, nullable=True)
    rejection_reason = Column(Text, nullable=True)
    reviewer_name = Column(String(150), nullable=True)

    # Relationships
    student = relationship("Student", back_populates="applications")
    route = relationship("Route", back_populates="applications")
    documents = relationship("Document", back_populates="application", cascade="all, delete-orphan")
    issued_pass = relationship("Pass", back_populates="application", uselist=False)

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False)
    doc_type = Column(String(50), nullable=False)  # "COLLEGE_ID", "PHOTO", "FEE_RECEIPT"
    file_name = Column(String(255), nullable=False)
    file_url = Column(Text, nullable=True)
    file_size_bytes = Column(Integer, default=0)
    uploaded_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    application = relationship("Application", back_populates="documents")

class Pass(Base):
    __tablename__ = "passes"

    id = Column(Integer, primary_key=True, index=True)
    pass_number = Column(String(50), unique=True, index=True, nullable=False)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    route_id = Column(Integer, ForeignKey("routes.id"), nullable=False)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=True)
    
    # Snapshot details
    student_name = Column(String(150), nullable=True)
    student_photo_url = Column(Text, nullable=True)
    institution_name = Column(String(200), nullable=True)
    course = Column(String(100), nullable=True)
    roll_number = Column(String(50), nullable=True)
    student_id_number = Column(String(50), nullable=True)
    transport_type = Column(String(50), default="Bus")
    starting_point = Column(String(150), nullable=True)
    destination = Column(String(150), nullable=True)
    route_name = Column(String(255), nullable=True)
    valid_from = Column(String(30), default="01 / 06 / 2024")
    valid_until = Column(String(30), default="31 / 03 / 2027")

    issue_date = Column(String(30), default="01 / 06 / 2024")
    expiry_date = Column(String(30), default="31 / 03 / 2027")
    status = Column(String(50), default="ACTIVE", index=True)  # ACTIVE, EXPIRED, SUSPENDED
    daily_fare = Column(String(20), default="₹12")
    subsidy_rate = Column(String(50), default="80% KSRTC / 50% METRO")
    hash_signature = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    student = relationship("Student", back_populates="passes")
    route = relationship("Route", back_populates="passes")
    application = relationship("Application", back_populates="issued_pass")
    qr_credentials = relationship("QRCredential", back_populates="pass_obj", cascade="all, delete-orphan")
    travel_tokens = relationship("TravelToken", back_populates="pass_obj", cascade="all, delete-orphan")
    verification_logs = relationship("VerificationLog", back_populates="pass_obj", cascade="all, delete-orphan")

class QRCredential(Base):
    __tablename__ = "qr_credentials"

    id = Column(Integer, primary_key=True, index=True)
    pass_id = Column(Integer, ForeignKey("passes.id"), nullable=False)
    qr_payload = Column(Text, nullable=False)
    signature = Column(String(255), nullable=False)
    generated_at = Column(DateTime, default=datetime.datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)

    # Relationships
    pass_obj = relationship("Pass", back_populates="qr_credentials")

class TravelToken(Base):
    __tablename__ = "travel_tokens"

    id = Column(Integer, primary_key=True, index=True)
    pass_id = Column(Integer, ForeignKey("passes.id"), nullable=False)
    token_code = Column(String(100), unique=True, index=True, nullable=False)
    turnstile_gate = Column(String(50), default="GATE-04-ALUVA")
    issued_at = Column(DateTime, default=datetime.datetime.utcnow)
    valid_until = Column(DateTime, nullable=False)
    is_used = Column(Boolean, default=False)
    used_at = Column(DateTime, nullable=True)

    # Relationships
    pass_obj = relationship("Pass", back_populates="travel_tokens")

class VerificationLog(Base):
    __tablename__ = "verification_logs"

    id = Column(Integer, primary_key=True, index=True)
    pass_id = Column(Integer, ForeignKey("passes.id"), nullable=True)
    pass_number_scanned = Column(String(50), index=True, nullable=False)
    terminal_code = Column(String(100), default="TERMINAL-KL-RTO-TCR")
    location = Column(String(150), default="Aluva Metro Station Turnstile #4")
    student_name = Column(String(150), nullable=True)
    student_roll = Column(String(50), nullable=True)
    route_name = Column(String(255), nullable=True)
    verifier_identity = Column(String(100), nullable=True)
    status = Column(String(50), nullable=False)  # "VERIFIED", "EXPIRED", "INVALID", "ALREADY_USED"
    status_code = Column(String(50), default="200 OK")
    failure_reason = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    verified_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    pass_obj = relationship("Pass", back_populates="verification_logs")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50), default="INFO")  # "SUCCESS", "INFO", "WARNING", "ALERT"
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="notifications")

