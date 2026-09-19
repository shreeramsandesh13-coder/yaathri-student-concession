import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# SQLite database file located in backend directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "yaathri.db")
SQLALCHEMY_DATABASE_URL = f"sqlite:///{DB_PATH}"

# connect_args={"check_same_thread": False} is required for SQLite in FastAPI
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    """Dependency that provides a database session per request and closes it after."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def upgrade_db_schema():
    """Ensure newly added columns exist in existing SQLite database tables without data loss."""
    try:
        with engine.connect() as conn:
            # Check applications table
            app_cols = [row[1] for row in conn.exec_driver_sql("PRAGMA table_info(applications)").fetchall()]
            if app_cols:
                if "transport_mode" not in app_cols:
                    conn.exec_driver_sql("ALTER TABLE applications ADD COLUMN transport_mode VARCHAR(50) DEFAULT 'Bus'")
                if "starting_point" not in app_cols:
                    conn.exec_driver_sql("ALTER TABLE applications ADD COLUMN starting_point VARCHAR(150)")
                if "destination" not in app_cols:
                    conn.exec_driver_sql("ALTER TABLE applications ADD COLUMN destination VARCHAR(150)")
                if "route_name" not in app_cols:
                    conn.exec_driver_sql("ALTER TABLE applications ADD COLUMN route_name VARCHAR(255)")
                if "validity_start" not in app_cols:
                    conn.exec_driver_sql("ALTER TABLE applications ADD COLUMN validity_start VARCHAR(50) DEFAULT '01 / 06 / 2026'")
                if "validity_end" not in app_cols:
                    conn.exec_driver_sql("ALTER TABLE applications ADD COLUMN validity_end VARCHAR(50) DEFAULT '31 / 03 / 2027'")
                if "reviewer_notes" not in app_cols:
                    conn.exec_driver_sql("ALTER TABLE applications ADD COLUMN reviewer_notes TEXT")
                if "rejection_reason" not in app_cols:
                    conn.exec_driver_sql("ALTER TABLE applications ADD COLUMN rejection_reason TEXT")
                if "reviewer_name" not in app_cols:
                    conn.exec_driver_sql("ALTER TABLE applications ADD COLUMN reviewer_name VARCHAR(150)")
                conn.commit()

            # Check students table
            student_cols = [row[1] for row in conn.exec_driver_sql("PRAGMA table_info(students)").fetchall()]
            if student_cols:
                if "student_id_number" not in student_cols:
                    conn.exec_driver_sql("ALTER TABLE students ADD COLUMN student_id_number VARCHAR(50) DEFAULT 'STU-2024-8841'")
                if "institution_name" not in student_cols:
                    conn.exec_driver_sql("ALTER TABLE students ADD COLUMN institution_name VARCHAR(200)")
                if "institution_type" not in student_cols:
                    conn.exec_driver_sql("ALTER TABLE students ADD COLUMN institution_type VARCHAR(50) DEFAULT 'College'")
                if "semester" not in student_cols:
                    conn.exec_driver_sql("ALTER TABLE students ADD COLUMN semester VARCHAR(50) DEFAULT 'Semester 5'")
                if "institutional_qr_code" not in student_cols:
                    conn.exec_driver_sql("ALTER TABLE students ADD COLUMN institutional_qr_code VARCHAR(100)")
                conn.commit()

            # Check passes table
            pass_cols = [row[1] for row in conn.exec_driver_sql("PRAGMA table_info(passes)").fetchall()]
            if pass_cols:
                if "student_name" not in pass_cols:
                    conn.exec_driver_sql("ALTER TABLE passes ADD COLUMN student_name VARCHAR(150)")
                if "student_photo_url" not in pass_cols:
                    conn.exec_driver_sql("ALTER TABLE passes ADD COLUMN student_photo_url TEXT")
                if "institution_name" not in pass_cols:
                    conn.exec_driver_sql("ALTER TABLE passes ADD COLUMN institution_name VARCHAR(200)")
                if "course" not in pass_cols:
                    conn.exec_driver_sql("ALTER TABLE passes ADD COLUMN course VARCHAR(100)")
                if "roll_number" not in pass_cols:
                    conn.exec_driver_sql("ALTER TABLE passes ADD COLUMN roll_number VARCHAR(50)")
                if "student_id_number" not in pass_cols:
                    conn.exec_driver_sql("ALTER TABLE passes ADD COLUMN student_id_number VARCHAR(50)")
                if "transport_type" not in pass_cols:
                    conn.exec_driver_sql("ALTER TABLE passes ADD COLUMN transport_type VARCHAR(50) DEFAULT 'Bus'")
                if "starting_point" not in pass_cols:
                    conn.exec_driver_sql("ALTER TABLE passes ADD COLUMN starting_point VARCHAR(150)")
                if "destination" not in pass_cols:
                    conn.exec_driver_sql("ALTER TABLE passes ADD COLUMN destination VARCHAR(150)")
                if "route_name" not in pass_cols:
                    conn.exec_driver_sql("ALTER TABLE passes ADD COLUMN route_name VARCHAR(255)")
                if "valid_from" not in pass_cols:
                    conn.exec_driver_sql("ALTER TABLE passes ADD COLUMN valid_from VARCHAR(30) DEFAULT '01 / 06 / 2024'")
                if "valid_until" not in pass_cols:
                    conn.exec_driver_sql("ALTER TABLE passes ADD COLUMN valid_until VARCHAR(30) DEFAULT '31 / 03 / 2027'")
                conn.commit()

            # Check institutions table
            inst_cols = [row[1] for row in conn.exec_driver_sql("PRAGMA table_info(institutions)").fetchall()]
            if inst_cols:
                if "user_id" not in inst_cols:
                    conn.exec_driver_sql("ALTER TABLE institutions ADD COLUMN user_id INTEGER")
                conn.commit()

            # Check verification_logs table
            log_cols = [row[1] for row in conn.exec_driver_sql("PRAGMA table_info(verification_logs)").fetchall()]
            if log_cols:
                if "student_name" not in log_cols:
                    conn.exec_driver_sql("ALTER TABLE verification_logs ADD COLUMN student_name VARCHAR(150)")
                if "student_roll" not in log_cols:
                    conn.exec_driver_sql("ALTER TABLE verification_logs ADD COLUMN student_roll VARCHAR(50)")
                if "route_name" not in log_cols:
                    conn.exec_driver_sql("ALTER TABLE verification_logs ADD COLUMN route_name VARCHAR(255)")
                if "verifier_identity" not in log_cols:
                    conn.exec_driver_sql("ALTER TABLE verification_logs ADD COLUMN verifier_identity VARCHAR(100)")
                if "failure_reason" not in log_cols:
                    conn.exec_driver_sql("ALTER TABLE verification_logs ADD COLUMN failure_reason TEXT")
                if "verifier_id" not in log_cols:
                    conn.exec_driver_sql("ALTER TABLE verification_logs ADD COLUMN verifier_id INTEGER")
                if "verifier_code" not in log_cols:
                    conn.exec_driver_sql("ALTER TABLE verification_logs ADD COLUMN verifier_code VARCHAR(50)")
                if "verifier_name" not in log_cols:
                    conn.exec_driver_sql("ALTER TABLE verification_logs ADD COLUMN verifier_name VARCHAR(150)")
                if "transport_type" not in log_cols:
                    conn.exec_driver_sql("ALTER TABLE verification_logs ADD COLUMN transport_type VARCHAR(50)")
                if "transport_operator" not in log_cols:
                    conn.exec_driver_sql("ALTER TABLE verification_logs ADD COLUMN transport_operator VARCHAR(200)")
                if "vehicle_number" not in log_cols:
                    conn.exec_driver_sql("ALTER TABLE verification_logs ADD COLUMN vehicle_number VARCHAR(50)")
                if "station_device_id" not in log_cols:
                    conn.exec_driver_sql("ALTER TABLE verification_logs ADD COLUMN station_device_id VARCHAR(50)")
                if "result" not in log_cols:
                    conn.exec_driver_sql("ALTER TABLE verification_logs ADD COLUMN result VARCHAR(50) DEFAULT 'VALID'")
                conn.commit()
    except Exception as e:
        print("Schema upgrade notice:", e)

