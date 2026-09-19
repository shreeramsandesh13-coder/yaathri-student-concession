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
                conn.commit()
    except Exception as e:
        print("Schema upgrade notice:", e)

