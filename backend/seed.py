import os
import sys
import datetime

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import engine, SessionLocal, Base
import models
from auth import hash_password

def seed_database():
    print("Initializing YAATHRI database tables...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        # Check if already seeded
        existing_admin = db.query(models.User).filter(models.User.email == "admin@yaathri.kerala.gov.in").first()
        if existing_admin:
            print("Database already seeded with demo records.")
            return

        print("Seeding realistic Kerala transit demo data...")

        # 1. Institutions
        inst1 = models.Institution(
            name="Christ College of Engineering, Irinjalakuda",
            code="CCE-TCR-08",
            address="Irinjalakuda, Thrissur District, Kerala – 680125",
            district="Thrissur",
            principal_name="Dr. V. D. John",
            contact_phone="+91 480 282 5383"
        )
        inst2 = models.Institution(
            name="Rajagiri School of Engineering & Technology",
            code="RSET-EKM-07",
            address="Rajagiri Valley, Kakkanad, Kochi, Kerala – 682039",
            district="Ernakulam",
            principal_name="Dr. P. S. Sreejith",
            contact_phone="+91 484 266 0999"
        )
        db.add_all([inst1, inst2])
        db.flush()

        # 2. Transit Routes & Corridors
        route1 = models.Route(
            route_code="LINE K-04",
            from_location="Thrissur Central",
            to_location="Ernakulam South",
            corridor="NH 544 Corridor (Thrissur ⇄ Ernakulam via Chalakudy, Angamaly & Aluva)",
            distance_km=74.5,
            fleet_type="Combined Intermodal (80% KSRTC + 50% Metro)",
            ksrtc_subsidy_pct=80.0,
            metro_subsidy_pct=50.0,
            fare_daily="₹12",
            is_active=True
        )
        route2 = models.Route(
            route_code="LINE K-12",
            from_location="Thrissur Central",
            to_location="Kunnamkulam Stand",
            corridor="State Highway 22 Corridor (Thrissur ⇄ Kunnamkulam via Wadakkanchery)",
            distance_km=28.0,
            fleet_type="KSRTC Ordinary Fleet (80% Subsidy)",
            ksrtc_subsidy_pct=80.0,
            metro_subsidy_pct=0.0,
            fare_daily="₹8",
            is_active=True
        )
        route3 = models.Route(
            route_code="LINE K-08",
            from_location="Irinjalakuda Stand",
            to_location="Thrissur Central",
            corridor="State Highway 61 Corridor (Irinjalakuda ⇄ Thrissur via Kodakara)",
            distance_km=24.5,
            fleet_type="KSRTC Fast Passenger (80% Subsidy)",
            ksrtc_subsidy_pct=80.0,
            metro_subsidy_pct=0.0,
            fare_daily="₹7",
            is_active=True
        )
        db.add_all([route1, route2, route3])
        db.flush()

        # Route Stops
        stops1 = [
            models.Stop(route_id=route1.id, stop_name="Thrissur Central Stand", sequence_order=1),
            models.Stop(route_id=route1.id, stop_name="Pudukad Junction", sequence_order=2),
            models.Stop(route_id=route1.id, stop_name="Chalakudy Bus Terminal", sequence_order=3),
            models.Stop(route_id=route1.id, stop_name="Angamaly KSRTC", sequence_order=4),
            models.Stop(route_id=route1.id, stop_name="Aluva Metro Interchange", sequence_order=5),
            models.Stop(route_id=route1.id, stop_name="Kaloor Metro Station", sequence_order=6),
            models.Stop(route_id=route1.id, stop_name="Ernakulam South Station", sequence_order=7),
        ]
        db.add_all(stops1)

        # 3. Users & Roles
        # Admin Account
        admin_user = models.User(
            email="admin@yaathri.kerala.gov.in",
            hashed_password=hash_password("Admin@123"),
            role="ADMIN",
            is_active=True
        )
        # Demo Student 1: Shreeram Sandesh (Approved Pass)
        student1_user = models.User(
            email="shreeram.sandesh@cce.edu.in",
            hashed_password=hash_password("Student@123"),
            role="STUDENT",
            is_active=True
        )
        # Demo Student 2: Ananya Nair (Pending Application)
        student2_user = models.User(
            email="ananya.nair@rajagiri.edu.in",
            hashed_password=hash_password("Student@123"),
            role="STUDENT",
            is_active=True
        )
        # Demo Student 3: Rahul Menon (Rejected Application)
        student3_user = models.User(
            email="rahul.menon@scms.edu.in",
            hashed_password=hash_password("Student@123"),
            role="STUDENT",
            is_active=True
        )
        db.add_all([admin_user, student1_user, student2_user, student3_user])
        db.flush()

        # 4. Student Profiles
        student1 = models.Student(
            user_id=student1_user.id,
            institution_id=inst1.id,
            full_name="Shreeram Sandesh",
            roll_number="CCE24CS001",
            student_id_number="STU-2024-8841",
            institution_name="Christ College of Engineering, Irinjalakuda",
            course="B.Tech Computer Science",
            semester="Semester 5",
            year_semester="3rd Year (Semester 5)",
            phone="+91 98470 12345",
            age="21",
            dob="14 / 08 / 2003",
            blood_group="O +ve",
            emergency_phone="+91 94471 98765",
            student_address="Flat 4B, Emerald Heights, Mission Quarters, Thrissur – 680001",
            college_address="Christ College of Engineering, Irinjalakuda, Thrissur – 680125",
            photo_url="https://lh3.googleusercontent.com/aida-public/AB6AXuDxIOtGgfZ1xzAMTLlUAwHX9CcdtIFuDQY4RTI4qWrBjRHW7uru56nH1vurIQKUsbkhbp-43R4ptwoUlode-NXOPgdADsjJybp_UaGdHLFxWPnmoMH-XpFW0AFvy2WBXFqfUqy5lpAsux4nvmvXgvwmzOmC59WAiMH5jxkxMKC_07AlcPSWEnmfW1V637TgWonkvOAuFsu4p9zIfPSF5aJ5iD2ebYMtCGNnsy5CqNYrvksyIuTg39TU",
            institutional_qr_code="YAATHRI-ID:9f4c6b81a02e482db8e69d718b5c9012"
        )
        student2 = models.Student(
            user_id=student2_user.id,
            institution_id=inst2.id,
            full_name="Ananya Nair",
            roll_number="RSET24EC042",
            student_id_number="STU-2024-8842",
            institution_name="Rajagiri School of Engineering & Technology",
            course="B.Tech Electronics & Comm",
            semester="Semester 3",
            year_semester="2nd Year (Semester 3)",
            phone="+91 94470 54321",
            age="20",
            dob="22 / 11 / 2004",
            blood_group="B +ve",
            emergency_phone="+91 98471 11223",
            student_address="Nair Villa, Palarivattom, Ernakulam – 682025",
            college_address="Rajagiri School of Engineering, Kakkanad – 682039",
            photo_url="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=350&fit=crop",
            institutional_qr_code="YAATHRI-ID:3d1e7a54b98c4f10a82e661203498cb1"
        )
        student3 = models.Student(
            user_id=student3_user.id,
            institution_id=inst1.id,
            full_name="Rahul Menon",
            roll_number="CCE24ME019",
            student_id_number="STU-2024-8819",
            institution_name="Christ College of Engineering, Irinjalakuda",
            course="B.Tech Mechanical Eng",
            semester="Semester 7",
            year_semester="4th Year (Semester 7)",
            phone="+91 94950 99887",
            age="22",
            dob="05 / 03 / 2002",
            blood_group="A +ve",
            emergency_phone="+91 94951 88776",
            student_address="Menon Cottage, Irinjalakuda Town – 680121",
            college_address="Christ College of Engineering, Irinjalakuda – 680125",
            photo_url="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=350&fit=crop",
            institutional_qr_code="YAATHRI-ID:8a72e911c4b2450ea1d8487b321a99ef"
        )
        db.add_all([student1, student2, student3])
        db.flush()

        # 5. Applications
        # Application 1: Approved (Shreeram)
        app1 = models.Application(
            application_number="APP-2026-00124",
            student_id=student1.id,
            route_id=route1.id,
            academic_year="2024–2027",
            status="APPROVED",
            applied_at=datetime.datetime(2024, 6, 1, 10, 30),
            reviewed_at=datetime.datetime(2024, 6, 2, 14, 15),
            reviewer_notes="Verified against Higher Education enrollment registry."
        )
        # Application 2: Pending (Ananya) - Ready for admin to review!
        app2 = models.Application(
            application_number="APP-2026-00284",
            student_id=student2.id,
            route_id=route1.id,
            academic_year="2024–2027",
            status="PENDING",
            applied_at=datetime.datetime.utcnow() - datetime.timedelta(hours=6),
            reviewer_notes=None
        )
        # Application 3: Rejected (Rahul) - Example rejection
        app3 = models.Application(
            application_number="APP-2026-00109",
            student_id=student3.id,
            route_id=route3.id,
            academic_year="2024–2027",
            status="REJECTED",
            applied_at=datetime.datetime(2024, 5, 20, 9, 0),
            reviewed_at=datetime.datetime(2024, 5, 21, 16, 45),
            reviewer_notes="Distance from residential address to institution is within walkable campus perimeter (<1.5km). Concession guidelines require minimum 3km."
        )
        db.add_all([app1, app2, app3])
        db.flush()

        # Application Documents
        doc1 = models.Document(
            application_id=app1.id,
            doc_type="COLLEGE_ID",
            file_name="student_id_cce_shreeram.pdf",
            file_size_bytes=348120
        )
        doc2 = models.Document(
            application_id=app2.id,
            doc_type="COLLEGE_ID",
            file_name="ananya_college_id_rset.pdf",
            file_size_bytes=289400
        )
        db.add_all([doc1, doc2])

        # 6. Digital Concession Passes
        # Active Pass for Shreeram
        pass1 = models.Pass(
            pass_number="SCP-2026-00124",
            student_id=student1.id,
            route_id=route1.id,
            application_id=app1.id,
            student_name="Shreeram Sandesh",
            student_photo_url=student1.photo_url,
            institution_name="Christ College of Engineering, Irinjalakuda",
            course="B.Tech Computer Science",
            roll_number="CCE24CS001",
            student_id_number="STU-2024-8841",
            transport_type="Bus & Metro",
            starting_point="Thrissur Central",
            destination="Ernakulam South",
            route_name="LINE K-04 (NH 544 Corridor)",
            valid_from="01 / 06 / 2024",
            valid_until="31 / 03 / 2027",
            issue_date="01 / 06 / 2024",
            expiry_date="31 / 03 / 2027",
            status="ACTIVE",
            daily_fare="₹12",
            subsidy_rate="80% KSRTC / 50% METRO",
            hash_signature="KL-08-CCE-9941-X9"
        )
        # Expired Pass for Demo
        pass2 = models.Pass(
            pass_number="SCP-2025-00088",
            student_id=student3.id,
            route_id=route2.id,
            student_name="Rahul Menon",
            student_photo_url=student3.photo_url,
            institution_name="Christ College of Engineering, Irinjalakuda",
            course="B.Tech Mechanical Eng",
            roll_number="CCE24ME019",
            student_id_number="STU-2024-8819",
            transport_type="Bus",
            starting_point="Thrissur Central",
            destination="Kunnamkulam Stand",
            route_name="LINE K-12 (SH 22 Corridor)",
            valid_from="01 / 06 / 2023",
            valid_until="31 / 03 / 2024",
            issue_date="01 / 06 / 2023",
            expiry_date="31 / 03 / 2024",
            status="EXPIRED",
            daily_fare="₹8",
            subsidy_rate="80% KSRTC",
            hash_signature="KL-08-CCE-8812-OLD"
        )
        db.add_all([pass1, pass2])
        db.flush()

        # 7. QR Credentials
        qr1 = models.QRCredential(
            pass_id=pass1.id,
            qr_payload="YAATHRI:SCP-2026-00124:78f89e2194ac5e",
            signature="78f89e2194ac5e",
            expires_at=datetime.datetime.utcnow() + datetime.timedelta(days=30)
        )
        db.add(qr1)

        # 8. Verification Audit Logs
        log1 = models.VerificationLog(
            pass_id=pass1.id,
            pass_number_scanned="SCP-2026-00124",
            terminal_code="TERMINAL-KL-RTO-TCR",
            location="Aluva Metro Station Turnstile #4",
            student_name="Shreeram Sandesh",
            student_roll="CCE24CS001",
            route_name="LINE K-04 (Thrissur ⇄ Ernakulam)",
            verifier_identity="KMRL Turnstile Terminal #4",
            status="VERIFIED",
            status_code="200 OK",
            notes="Cryptographic signature verified against Kerala RTO node."
        )
        log2 = models.VerificationLog(
            pass_id=pass1.id,
            pass_number_scanned="SCP-2026-00124",
            terminal_code="CONDUCTOR-HANDHELD-KL-15",
            location="KSRTC Fast Passenger (KL-15-A-8921)",
            student_name="Shreeram Sandesh",
            student_roll="CCE24CS001",
            route_name="LINE K-04 (Thrissur ⇄ Ernakulam)",
            verifier_identity="Conductor Device KL-15",
            status="VERIFIED",
            status_code="200 OK",
            notes="Conductor inspected and validated student credentials."
        )
        log3 = models.VerificationLog(
            pass_id=pass2.id,
            pass_number_scanned="SCP-2025-00088",
            terminal_code="TERMINAL-KL-RTO-TCR",
            location="Thrissur Central Stand Gate 2",
            student_name="Rahul Menon",
            student_roll="CCE24ME019",
            route_name="LINE K-12 (Thrissur ⇄ Kunnamkulam)",
            verifier_identity="KSRTC Gate Scanner TCR-02",
            status="EXPIRED",
            status_code="403 EXPIRED",
            failure_reason="CONCESSION EXPIRED: Academic year validity ended 31 / 03 / 2024",
            notes="Attempted scan of pass expired on 31 / 03 / 2024."
        )
        db.add_all([log1, log2, log3])

        # 9. Notifications
        n1 = models.Notification(
            user_id=student1_user.id,
            title="Concession Pass Active",
            message="Your YAATHRI Student Concession Pass (SCP-2026-00124) is active for NH 544 Corridor.",
            type="SUCCESS",
            is_read=True
        )
        n2 = models.Notification(
            user_id=student2_user.id,
            title="Application Under Review",
            message="Your concession application APP-2026-00284 has been submitted and is awaiting administrative clearance.",
            type="INFO",
            is_read=False
        )
        n3 = models.Notification(
            user_id=admin_user.id,
            title="Pending Concession Applications",
            message="1 new concession request (APP-2026-00284) requires RTO/institutional verification.",
            type="ALERT",
            is_read=False
        )
        db.add_all([n1, n2, n3])

        db.commit()
        print("YAATHRI demo database successfully seeded!")
        print(f"Admin: admin@yaathri.kerala.gov.in / Admin@123")
        print(f"Student: shreeram.sandesh@cce.edu.in / Student@123")
        print(f"Student: ananya.nair@rajagiri.edu.in / Student@123")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()

