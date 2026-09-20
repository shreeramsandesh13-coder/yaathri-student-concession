import os
import sys
import datetime

# Add current directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from database import engine, SessionLocal, Base, upgrade_db_schema
import models
from auth import hash_password

def seed_database():
    print("Initializing YAATHRI database tables...")
    Base.metadata.create_all(bind=engine)
    upgrade_db_schema()
    
    db = SessionLocal()
    try:
        print("Ensuring YAATHRI core entities and portals are seeded...")

        # -------------------------------------------------------------
        # 1. Institutions
        # -------------------------------------------------------------
        inst1 = db.query(models.Institution).filter(models.Institution.code == "CCE-TCR-08").first()
        if not inst1:
            inst1 = models.Institution(
                name="Christ College of Engineering, Irinjalakuda",
                code="CCE-TCR-08",
                address="Irinjalakuda, Thrissur District, Kerala – 680125",
                district="Thrissur",
                principal_name="Dr. V. D. John",
                contact_phone="+91 480 282 5383"
            )
            db.add(inst1)
            db.flush()

        inst2 = db.query(models.Institution).filter(models.Institution.code == "RSET-EKM-07").first()
        if not inst2:
            inst2 = models.Institution(
                name="Rajagiri School of Engineering & Technology",
                code="RSET-EKM-07",
                address="Rajagiri Valley, Kakkanad, Kochi, Kerala – 682039",
                district="Ernakulam",
                principal_name="Dr. P. S. Sreejith",
                contact_phone="+91 484 266 0999"
            )
            db.add(inst2)
            db.flush()

        # -------------------------------------------------------------
        # 2. Transit Routes & Corridors
        # -------------------------------------------------------------
        route1 = db.query(models.Route).filter(models.Route.route_code == "LINE K-04").first()
        if not route1:
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
            db.add(route1)
            db.flush()

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

        route2 = db.query(models.Route).filter(models.Route.route_code == "LINE K-12").first()
        if not route2:
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
            db.add(route2)

        route3 = db.query(models.Route).filter(models.Route.route_code == "LINE K-08").first()
        if not route3:
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
            db.add(route3)
        db.flush()

        # -------------------------------------------------------------
        # 3. Transport Operators
        # -------------------------------------------------------------
        op_ksrtc = db.query(models.TransportOperator).filter(models.TransportOperator.code == "KSRTC").first()
        if not op_ksrtc:
            op_ksrtc = models.TransportOperator(
                name="Kerala State Road Transport Corporation (KSRTC)",
                code="KSRTC",
                operator_type="KSRTC",
                contact_phone="1800 599 4011",
                contact_email="support@keralartc.com",
                headquarters="Transport Bhavan, Fort, Thiruvananthapuram – 695023",
                is_active=True
            )
            db.add(op_ksrtc)
            db.flush()

        op_pvt = db.query(models.TransportOperator).filter(models.TransportOperator.code == "ABC-BUS").first()
        if not op_pvt:
            op_pvt = models.TransportOperator(
                name="ABC Roadlines & Private Bus Consortium",
                code="ABC-BUS",
                operator_type="PRIVATE_BUS",
                contact_phone="+91 487 234 5678",
                contact_email="ops@abcbuskerala.com",
                headquarters="Thrissur Round South, Thrissur – 680001",
                is_active=True
            )
            db.add(op_pvt)
            db.flush()

        op_metro = db.query(models.TransportOperator).filter(models.TransportOperator.code == "KMRL").first()
        if not op_metro:
            op_metro = models.TransportOperator(
                name="Kochi Metro Rail Limited (KMRL)",
                code="KMRL",
                operator_type="METRO",
                contact_phone="+91 484 284 6700",
                contact_email="customercare@kochimetro.org",
                headquarters="JLN Metro Station, Kaloor, Kochi – 682017",
                is_active=True
            )
            db.add(op_metro)
            db.flush()

        # -------------------------------------------------------------
        # 4. Vehicles & Transit Devices
        # -------------------------------------------------------------
        veh_ksrtc = db.query(models.Vehicle).filter(models.Vehicle.vehicle_number == "KL-15-A-1234").first()
        if not veh_ksrtc:
            veh_ksrtc = models.Vehicle(
                operator_id=op_ksrtc.id,
                vehicle_type="BUS",
                vehicle_number="KL-15-A-1234",
                depot="Thrissur Central Depot",
                assigned_route="LINE K-04 (Thrissur ⇄ Ernakulam)",
                is_active=True
            )
            db.add(veh_ksrtc)
            db.flush()

        veh_pvt = db.query(models.Vehicle).filter(models.Vehicle.vehicle_number == "KL-08-B-5678").first()
        if not veh_pvt:
            veh_pvt = models.Vehicle(
                operator_id=op_pvt.id,
                vehicle_type="BUS",
                vehicle_number="KL-08-B-5678",
                depot="Irinjalakuda Private Bus Stand",
                assigned_route="LINE K-08 (Irinjalakuda ⇄ Thrissur)",
                is_active=True
            )
            db.add(veh_pvt)
            db.flush()

        veh_metro = db.query(models.Vehicle).filter(models.Vehicle.device_id == "ALUVA-GATE-04").first()
        if not veh_metro:
            veh_metro = models.Vehicle(
                operator_id=op_metro.id,
                vehicle_type="METRO_GATE",
                device_id="ALUVA-GATE-04",
                station_name="Aluva Metro Station",
                depot="Muttom Metro Operations Control",
                assigned_route="Kochi Metro Blue Line",
                is_active=True
            )
            db.add(veh_metro)
            db.flush()

        # -------------------------------------------------------------
        # 5. Core Role Users & Profiles
        # -------------------------------------------------------------

        # A. ADMIN ACCOUNT
        admin_user = db.query(models.User).filter(models.User.email == "admin@yaathri.kerala.gov.in").first()
        if not admin_user:
            admin_user = models.User(
                email="admin@yaathri.kerala.gov.in",
                hashed_password=hash_password("Admin@123"),
                role="ADMIN",
                is_active=True
            )
            db.add(admin_user)
            db.flush()

        # B. INSTITUTION PORTAL USER (Christ College Concession Desk)
        inst_user = db.query(models.User).filter(models.User.email == "institution@yaathri.kerala.gov.in").first()
        if not inst_user:
            inst_user = models.User(
                email="institution@yaathri.kerala.gov.in",
                hashed_password=hash_password("Institution@123"),
                role="INSTITUTION",
                is_active=True
            )
            db.add(inst_user)
            db.flush()
        # Link institution profile
        inst1.user_id = inst_user.id

        # C. RTO / TRANSPORT AUTHORITY USER
        rto_user = db.query(models.User).filter(models.User.email == "rto@yaathri.kerala.gov.in").first()
        if not rto_user:
            rto_user = models.User(
                email="rto@yaathri.kerala.gov.in",
                hashed_password=hash_password("Rto@123"),
                role="RTO",
                is_active=True
            )
            db.add(rto_user)
            db.flush()

        # D. VERIFIER 1: KSRTC Conductor (Arun Kumar M)
        v1_user = db.query(models.User).filter(models.User.email == "verifier.ksrtc@yaathri.kerala.gov.in").first()
        if not v1_user:
            v1_user = models.User(
                email="verifier.ksrtc@yaathri.kerala.gov.in",
                hashed_password=hash_password("Verifier@123"),
                role="VERIFIER",
                is_active=True
            )
            db.add(v1_user)
            db.flush()
        
        v1_prof = db.query(models.Verifier).filter(models.Verifier.user_id == v1_user.id).first()
        if not v1_prof:
            v1_prof = models.Verifier(
                user_id=v1_user.id,
                verifier_code="KSRTC-V1024",
                full_name="Arun Kumar M",
                transport_type="KSRTC",
                operator_id=op_ksrtc.id,
                operator_name=op_ksrtc.name,
                vehicle_id=veh_ksrtc.id,
                bus_number="KL-15-A-1234",
                assigned_route="LINE K-04 (Thrissur ⇄ Ernakulam)",
                depot="Thrissur Central Depot",
                phone="+91 94471 00101",
                status="ACTIVE"
            )
            db.add(v1_prof)

        # E. VERIFIER 2: Private Bus Conductor (Rahul K. Nair)
        v2_user = db.query(models.User).filter(models.User.email == "verifier.bus@yaathri.kerala.gov.in").first()
        if not v2_user:
            v2_user = models.User(
                email="verifier.bus@yaathri.kerala.gov.in",
                hashed_password=hash_password("Verifier@123"),
                role="VERIFIER",
                is_active=True
            )
            db.add(v2_user)
            db.flush()
        
        v2_prof = db.query(models.Verifier).filter(models.Verifier.user_id == v2_user.id).first()
        if not v2_prof:
            v2_prof = models.Verifier(
                user_id=v2_user.id,
                verifier_code="PB-V2041",
                full_name="Rahul K. Nair",
                transport_type="PRIVATE_BUS",
                operator_id=op_pvt.id,
                operator_name=op_pvt.name,
                vehicle_id=veh_pvt.id,
                bus_number="KL-08-B-5678",
                assigned_route="LINE K-08 (Irinjalakuda ⇄ Thrissur)",
                depot="Irinjalakuda Private Stand",
                phone="+91 98472 00202",
                status="ACTIVE"
            )
            db.add(v2_prof)

        # F. VERIFIER 3: Metro Gate Attendant (Aluva Station Gate 4)
        v3_user = db.query(models.User).filter(models.User.email == "verifier.metro@yaathri.kerala.gov.in").first()
        if not v3_user:
            v3_user = models.User(
                email="verifier.metro@yaathri.kerala.gov.in",
                hashed_password=hash_password("Verifier@123"),
                role="VERIFIER",
                is_active=True
            )
            db.add(v3_user)
            db.flush()
        
        v3_prof = db.query(models.Verifier).filter(models.Verifier.user_id == v3_user.id).first()
        if not v3_prof:
            v3_prof = models.Verifier(
                user_id=v3_user.id,
                verifier_code="METRO-V3012",
                full_name="Aluva Metro Gate Attendant",
                transport_type="METRO",
                operator_id=op_metro.id,
                operator_name=op_metro.name,
                vehicle_id=veh_metro.id,
                station_device_id="ALUVA-GATE-04",
                station_name="Aluva Metro Station",
                assigned_route="Kochi Metro Blue Line",
                depot="Muttom Operations Center",
                phone="+91 484 284 0004",
                status="ACTIVE"
            )
            db.add(v3_prof)

        # G. VERIFIER 4: Suspended Conductor (For Testing RTO Suspension Enforcement)
        v4_user = db.query(models.User).filter(models.User.email == "verifier.suspended@yaathri.kerala.gov.in").first()
        if not v4_user:
            v4_user = models.User(
                email="verifier.suspended@yaathri.kerala.gov.in",
                hashed_password=hash_password("Verifier@123"),
                role="VERIFIER",
                is_active=False  # Suspended
            )
            db.add(v4_user)
            db.flush()
        
        v4_prof = db.query(models.Verifier).filter(models.Verifier.user_id == v4_user.id).first()
        if not v4_prof:
            v4_prof = models.Verifier(
                user_id=v4_user.id,
                verifier_code="KSRTC-V9999",
                full_name="Santhosh Varma (Revoked)",
                transport_type="KSRTC",
                operator_id=op_ksrtc.id,
                operator_name=op_ksrtc.name,
                bus_number="KL-15-X-9999",
                assigned_route="LINE K-04",
                depot="Chalakudy Depot",
                phone="+91 94471 99999",
                status="SUSPENDED"
            )
            db.add(v4_prof)

        # H. STUDENT ACCOUNTS
        # Standard student demo login
        std_generic = db.query(models.User).filter(models.User.email == "student@yaathri.kerala.gov.in").first()
        if not std_generic:
            std_generic = models.User(
                email="student@yaathri.kerala.gov.in",
                hashed_password=hash_password("Student@123"),
                role="STUDENT",
                is_active=True
            )
            db.add(std_generic)
            db.flush()

        # Student 1: Shreeram Sandesh (Approved Pass)
        student1_user = db.query(models.User).filter(models.User.email == "shreeram.sandesh@cce.edu.in").first()
        if not student1_user:
            student1_user = models.User(
                email="shreeram.sandesh@cce.edu.in",
                hashed_password=hash_password("Student@123"),
                role="STUDENT",
                is_active=True
            )
            db.add(student1_user)
            db.flush()

        student1 = db.query(models.Student).filter(models.Student.user_id == student1_user.id).first()
        if not student1:
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
            db.add(student1)
            db.flush()

        # Connect generic student login to profile if not present
        std_generic_prof = db.query(models.Student).filter(models.Student.user_id == std_generic.id).first()
        if not std_generic_prof:
            std_generic_prof = models.Student(
                user_id=std_generic.id,
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
            db.add(std_generic_prof)
            db.flush()

        # Seed Application and Pass for generic student demo account (student@yaathri.kerala.gov.in)
        app_std = db.query(models.Application).filter(models.Application.student_id == std_generic_prof.id).first()
        if not app_std:
            app_std = models.Application(
                application_number="APP-2026-00100",
                student_id=std_generic_prof.id,
                route_id=route1.id,
                academic_year="2024–2027",
                status="APPROVED",
                reviewer_notes="Verified via Kerala Higher Education Directory.",
                reviewer_name="Admin Desk CCE",
                transport_mode="Combined Intermodal",
                starting_point="Thrissur Central",
                destination="Ernakulam South",
                route_name="LINE K-04 (Thrissur ⇄ Ernakulam)",
                validity_start="01 / 06 / 2024",
                validity_end="31 / 03 / 2027"
            )
            db.add(app_std)
            db.flush()

        pass_std = db.query(models.Pass).filter(models.Pass.student_id == std_generic_prof.id).first()
        if not pass_std:
            pass_std = models.Pass(
                pass_number="SCP-2026-00100",
                student_id=std_generic_prof.id,
                route_id=route1.id,
                application_id=app_std.id,
                issue_date="01 / 06 / 2024",
                expiry_date="31 / 03 / 2027",
                subsidy_rate="80% KSRTC / 50% METRO",
                hash_signature="78f89e2194ac5e88b2a19e072b4c12df8a9012cd",
                status="ACTIVE",
                student_name=std_generic_prof.full_name,
                student_photo_url=std_generic_prof.photo_url,
                institution_name=std_generic_prof.institution_name,
                course=std_generic_prof.course,
                roll_number=std_generic_prof.roll_number,
                student_id_number=std_generic_prof.student_id_number,
                transport_type="Bus + Metro",
                starting_point="Thrissur Central",
                destination="Ernakulam South",
                route_name="LINE K-04 (Thrissur ⇄ Ernakulam)",
                valid_from="01 / 06 / 2024",
                valid_until="31 / 03 / 2027"
            )
            db.add(pass_std)
            db.flush()

            qr_std = models.QRCredential(
                pass_id=pass_std.id,
                qr_payload="YAATHRI:SCP-2026-00100:78f89e2194ac5e",
                signature="78f89e2194ac5e",
                expires_at=datetime.datetime.utcnow() + datetime.timedelta(days=365)
            )
            db.add(qr_std)
            db.flush()

        # Student 2: Ananya Nair (Pending Application)
        student2_user = db.query(models.User).filter(models.User.email == "ananya.nair@rajagiri.edu.in").first()
        if not student2_user:
            student2_user = models.User(
                email="ananya.nair@rajagiri.edu.in",
                hashed_password=hash_password("Student@123"),
                role="STUDENT",
                is_active=True
            )
            db.add(student2_user)
            db.flush()

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
            db.add(student2)
            db.flush()

            # Application 2: Pending
            app2 = models.Application(
                application_number="APP-2026-00284",
                student_id=student2.id,
                route_id=route1.id,
                academic_year="2024–2028",
                validity_period="1 Year (Academic)",
                concession_type="Daily Commute (Semester)",
                from_location="Palarivattom",
                to_location="Kakkanad Rajagiri",
                distance_km=8.2,
                status="PENDING",
                student_name=student2.full_name,
                roll_number=student2.roll_number,
                institution_name=student2.institution_name,
                class_name=student2.course,
                semester=student2.semester,
                transport_mode="Bus",
                starting_point="Palarivattom",
                destination="Kakkanad Rajagiri",
                route_name="LINE K-04 (Ernakulam Sector)",
                validity_start="01 / 06 / 2026",
                validity_end="31 / 03 / 2027"
            )
            db.add(app2)

        # Check / Seed Application 1 and Pass 1 for Shreeram
        app1 = db.query(models.Application).filter(models.Application.application_number == "APP-2026-00124").first()
        if not app1:
            app1 = models.Application(
                application_number="APP-2026-00124",
                student_id=student1.id,
                route_id=route1.id,
                academic_year="2024–2027",
                validity_period="1 Year (Academic)",
                concession_type="Daily Commute (Semester)",
                from_location="Thrissur Central",
                to_location="Ernakulam South",
                distance_km=74.5,
                status="APPROVED",
                reviewer_notes="Institutional documents and enrolment verified against Kerala Higher Education portal.",
                reviewer_name="Admin Desk CCE",
                student_name=student1.full_name,
                roll_number=student1.roll_number,
                institution_name=student1.institution_name,
                class_name=student1.course,
                semester=student1.semester,
                transport_mode="Bus + Metro",
                starting_point="Thrissur Central",
                destination="Ernakulam South",
                route_name="LINE K-04 (Thrissur ⇄ Ernakulam)",
                validity_start="01 / 06 / 2024",
                validity_end="31 / 03 / 2027"
            )
            db.add(app1)
            db.flush()

        pass1 = db.query(models.Pass).filter(models.Pass.pass_number == "SCP-2026-00124").first()
        if not pass1:
            pass1 = models.Pass(
                pass_number="SCP-2026-00124",
                student_id=student1.id,
                institution_id=inst1.id,
                route_id=route1.id,
                application_id=app1.id,
                start_date="01 / 06 / 2024",
                expiry_date="31 / 03 / 2027",
                concession_rate="80% KSRTC + 50% Metro",
                hash_signature="78f89e2194ac5e88b2a19e072b4c12df8a9012cd",
                status="ACTIVE",
                student_name=student1.full_name,
                student_photo_url=student1.photo_url,
                institution_name=student1.institution_name,
                course=student1.course,
                roll_number=student1.roll_number,
                student_id_number=student1.student_id_number,
                transport_type="Bus + Metro",
                starting_point="Thrissur Central",
                destination="Ernakulam South",
                route_name="LINE K-04 (Thrissur ⇄ Ernakulam)",
                valid_from="01 / 06 / 2024",
                valid_until="31 / 03 / 2027"
            )
            db.add(pass1)
            db.flush()

            qr1 = models.QRCredential(
                pass_id=pass1.id,
                qr_payload="YAATHRI:SCP-2026-00124:78f89e2194ac5e",
                signature="78f89e2194ac5e",
                expires_at=datetime.datetime.utcnow() + datetime.timedelta(days=365)
            )
            db.add(qr1)

        # -------------------------------------------------------------
        # 6. Realistic State-wide Verification Logs
        # -------------------------------------------------------------
        if db.query(models.VerificationLog).count() == 0:
            log1 = models.VerificationLog(
                pass_id=pass1.id if pass1 else None,
                pass_number_scanned="SCP-2026-00124",
                terminal_code="KSRTC-KL-15-A-1234",
                location="Kerala State Road Transport Corporation (KSRTC) | KL-15-A-1234",
                student_name="Shreeram Sandesh",
                student_roll="CCE24CS001",
                route_name="LINE K-04 (Thrissur ⇄ Ernakulam)",
                verifier_identity="KSRTC-V1024 - Arun Kumar M",
                verifier_id=v1_prof.id if v1_prof else None,
                verifier_code="KSRTC-V1024",
                verifier_name="Arun Kumar M",
                transport_type="KSRTC",
                transport_operator="Kerala State Road Transport Corporation (KSRTC)",
                vehicle_number="KL-15-A-1234",
                result="VALID",
                status="VERIFIED",
                status_code="200 OK",
                notes="VALID: KSRTC pass checked on KL-15-A-1234 by Arun Kumar M.",
                verified_at=datetime.datetime.utcnow() - datetime.timedelta(hours=2)
            )
            log2 = models.VerificationLog(
                pass_id=pass1.id if pass1 else None,
                pass_number_scanned="SCP-2026-00124",
                terminal_code="METRO-ALUVA-GATE-04",
                location="Kochi Metro Rail Limited (KMRL) | ALUVA-GATE-04",
                student_name="Shreeram Sandesh",
                student_roll="CCE24CS001",
                route_name="Kochi Metro Blue Line",
                verifier_identity="METRO-V3012 - Aluva Metro Gate Attendant",
                verifier_id=v3_prof.id if v3_prof else None,
                verifier_code="METRO-V3012",
                verifier_name="Aluva Metro Gate Attendant",
                transport_type="METRO",
                transport_operator="Kochi Metro Rail Limited (KMRL)",
                station_device_id="ALUVA-GATE-04",
                result="VALID",
                status="VERIFIED",
                status_code="200 OK",
                notes="VALID: METRO pass checked at Aluva Metro Station Gate 4.",
                verified_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=45)
            )
            log3 = models.VerificationLog(
                pass_id=None,
                pass_number_scanned="SCP-2024-FAKE-999",
                terminal_code="PRIVATE_BUS-KL-08-B-5678",
                location="ABC Roadlines & Private Bus Consortium | KL-08-B-5678",
                student_name=None,
                student_roll=None,
                route_name="LINE K-08 (Irinjalakuda ⇄ Thrissur)",
                verifier_identity="PB-V2041 - Rahul K. Nair",
                verifier_id=v2_prof.id if v2_prof else None,
                verifier_code="PB-V2041",
                verifier_name="Rahul K. Nair",
                transport_type="PRIVATE_BUS",
                transport_operator="ABC Roadlines & Private Bus Consortium",
                vehicle_number="KL-08-B-5678",
                result="INVALID",
                status="INVALID",
                status_code="404 NOT FOUND",
                failure_reason="UNRECOGNIZED QR CODE / IDENTIFIER: No registered student pass matches this scan.",
                notes="INVALID: Failed scan attempt on KL-08-B-5678 by Rahul K. Nair.",
                verified_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=15)
            )
            db.add_all([log1, log2, log3])

        db.commit()
        print("YAATHRI 4-Role Demo Database successfully seeded/updated!")
        print("1. Student: student@yaathri.kerala.gov.in / Student@123")
        print("2. Institution: institution@yaathri.kerala.gov.in / Institution@123")
        print("3. KSRTC Verifier: verifier.ksrtc@yaathri.kerala.gov.in / Verifier@123")
        print("4. Private Bus Verifier: verifier.bus@yaathri.kerala.gov.in / Verifier@123")
        print("5. Metro Gate Verifier: verifier.metro@yaathri.kerala.gov.in / Verifier@123")
        print("6. RTO Authority: rto@yaathri.kerala.gov.in / Rto@123")
        print("7. State Admin: admin@yaathri.kerala.gov.in / Admin@123")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
