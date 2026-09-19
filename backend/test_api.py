import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.json()["status"] == "HEALTHY"
    print("[PASS] Health check passed")

def test_auth_login():
    # 1. Student login
    res = client.post("/api/auth/login", json={
        "email": "shreeram.sandesh@cce.edu.in",
        "password": "Student@123"
    })
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data
    assert data["user"]["role"] == "STUDENT"
    student_token = data["access_token"]
    print("[PASS] Student login passed")

    # 2. Test role protection: student accessing admin route
    res = client.get("/api/admin/applications", headers={
        "Authorization": f"Bearer {student_token}"
    })
    assert res.status_code == 403
    print("[PASS] Role protection passed (403 for student on admin route)")

    # 3. Admin login
    res = client.post("/api/auth/login", json={
        "email": "admin@yaathri.kerala.gov.in",
        "password": "Admin@123"
    })
    assert res.status_code == 200
    admin_data = res.json()
    assert admin_data["user"]["role"] == "ADMIN"
    admin_token = admin_data["access_token"]
    print("[PASS] Admin login passed")

    # 4. Admin accessing admin route
    res = client.get("/api/admin/applications", headers={
        "Authorization": f"Bearer {admin_token}"
    })
    assert res.status_code == 200
    apps = res.json()
    assert len(apps) > 0
    print("[PASS] Admin application access passed")

    # 5. QR Verification
    res = client.post("/api/qr/verify", json={
        "pass_number_or_qr": "SCP-2026-00124"
    })
    assert res.status_code == 200
    qr_data = res.json()
    assert qr_data["status"] == "VERIFIED"
    assert "Shreeram Sandesh" in qr_data["student_name"]
    print("[PASS] QR Verification passed")

    # 6. Invalid Pass Verification
    res = client.post("/api/qr/verify", json={
        "pass_number_or_qr": "SCP-FAKE-99999"
    })
    assert res.status_code == 200
    assert res.json()["status"] == "INVALID"
    print("[PASS] Invalid Pass Audit check passed")

    # 7. Travel token generation & verification
    res = client.post("/api/travel-token/generate", json={
        "pass_id": 1,
        "turnstile_gate": "GATE-04-ALUVA"
    }, headers={"Authorization": f"Bearer {student_token}"})
    assert res.status_code == 200
    token_code = res.json()["token_code"]
    
    res = client.post("/api/travel-token/verify", json={
        "token_code": token_code,
        "turnstile_gate": "GATE-04-ALUVA"
    })
    assert res.status_code == 200
    assert res.json()["success"] == True
    print("[PASS] Travel Token turnstile verification passed")

    # 8. Student registration
    new_email = f"test.student.{os.getpid()}@cce.edu.in"
    res = client.post("/api/auth/register", json={
        "email": new_email,
        "password": "Password@123",
        "full_name": "Test Student",
        "roll_number": f"TEST{os.getpid()}",
        "phone": "+91 99999 88888"
    })
    assert res.status_code == 200
    assert "access_token" in res.json()
    print("[PASS] Student registration passed")

    # 9. Admin Real-Time Database Statistics
    res = client.get("/api/admin/stats", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    stats = res.json()
    assert "total_applications" in stats
    assert "pending_applications" in stats
    assert "approved_applications" in stats
    assert "rejected_applications" in stats
    assert "active_passes" in stats
    assert "total_students" in stats
    assert stats["total_applications"] >= 3
    print(f"[PASS] Admin stats retrieved (Total: {stats['total_applications']}, Pending: {stats['pending_applications']}, Active Passes: {stats['active_passes']})")

    # 10. Admin Search and Filter
    # Search by student name "Ananya"
    res = client.get("/api/admin/applications?search=Ananya", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    search_results = res.json()
    assert len(search_results) > 0
    assert any("Ananya" in app["student"]["full_name"] for app in search_results)
    print("[PASS] Admin search by student name passed")

    # Filter by PENDING
    res = client.get("/api/admin/applications?status_filter=PENDING", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    pending_results = res.json()
    assert all(app["status"] == "PENDING" for app in pending_results)
    print(f"[PASS] Admin status filter (PENDING) passed: found {len(pending_results)} records")

    # 11. Student Application Submission Flow
    res = client.post("/api/applications", json={
        "route_id": 1,
        "academic_year": "2024–2027",
        "transport_mode": "Combined Intermodal",
        "starting_point": "Thrissur Central Stand",
        "destination": "Ernakulam South",
        "corridor": "NH 544 Corridor",
        "student_id_doc_name": "student_cce_id.pdf",
        "bonafide_doc_name": "bonafide_certificate.pdf"
    }, headers={"Authorization": f"Bearer {student_token}"})
    assert res.status_code == 201
    new_app = res.json()
    assert new_app["status"] == "PENDING"
    assert new_app["application_number"].startswith("APP-")
    new_app_id = new_app["id"]
    print(f"[PASS] Student created application #{new_app['application_number']}")

    # 12. Rejection with validation: blank reason should fail (400)
    res = client.post(f"/api/admin/applications/{new_app_id}/reject", json={
        "action": "REJECT",
        "rejection_reason": ""
    }, headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 400
    print("[PASS] Rejection without reason correctly rejected (HTTP 400 Bad Request)")

    # 13. Rejection with valid reason
    res = client.post(f"/api/admin/applications/{new_app_id}/reject", json={
        "action": "REJECT",
        "rejection_reason": "Distance from residence is within walkable campus perimeter (<1.5km)."
    }, headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    rejected_app = res.json()
    assert rejected_app["status"] == "REJECTED"
    assert "walkable campus perimeter" in rejected_app["rejection_reason"]
    print(f"[PASS] Application successfully rejected with reason stored: {rejected_app['rejection_reason']}")

    # 14. Approval workflow: approve Ananya's pending application (or create fresh app to approve)
    res = client.post("/api/applications", json={
        "route_id": 1,
        "academic_year": "2024–2027",
        "transport_mode": "Bus",
        "starting_point": "Aluva Stand",
        "destination": "MG Road",
        "corridor": "Kochi Metro Corridor"
    }, headers={"Authorization": f"Bearer {student_token}"})
    assert res.status_code == 201
    app_to_approve = res.json()
    app_to_approve_id = app_to_approve["id"]

    res = client.post(f"/api/admin/applications/{app_to_approve_id}/approve", json={
        "action": "APPROVE",
        "reviewer_notes": "Verified against Kerala Higher Education Department Registry"
    }, headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    approved_app = res.json()
    assert approved_app["status"] == "APPROVED"
    assert approved_app["issued_pass"] is not None
    assert approved_app["issued_pass"]["status"] == "ACTIVE"
    print(f"[PASS] Application approved and Digital Pass ({approved_app['issued_pass']['pass_number']}) activated")

    # 15. Student Institutional QR Code
    res = client.get("/api/qr/institutional-qr", headers={"Authorization": f"Bearer {student_token}"})
    assert res.status_code == 200
    inst_data = res.json()
    assert "institutional_qr_code" in inst_data
    inst_qr = inst_data["institutional_qr_code"]
    assert inst_qr.startswith("YAATHRI-ID:")
    print(f"[PASS] Student Institutional QR retrieved: {inst_qr}")

    # 16. Verify Permanent Institutional QR Code
    res = client.post("/api/qr/verify", json={
        "pass_number_or_qr": inst_qr,
        "terminal_code": "INSPECTOR-HANDHELD-01",
        "location": "KSRTC Fast Passenger #12"
    })
    assert res.status_code == 200
    inst_verify = res.json()
    assert inst_verify["is_valid"] == True
    assert inst_verify["status"] == "VERIFIED"
    assert inst_verify["token_type"] == "INSTITUTIONAL_QR"
    assert "Shreeram Sandesh" in inst_verify["student_name"]
    print(f"[PASS] Institutional QR scan verified for {inst_verify['student_name']} ({inst_verify['pass_number']})")

    # 17. Single-Use Travel Token Enforcement
    # Generate token
    res = client.post("/api/travel-token/generate", json={
        "pass_id": 1,
        "turnstile_gate": "GATE-02-KALOOR"
    }, headers={"Authorization": f"Bearer {student_token}"})
    assert res.status_code == 200
    single_token = res.json()["token_code"]
    assert single_token.startswith("TT-")

    # 1st scan -> Must succeed (VERIFIED)
    res = client.post("/api/qr/verify", json={
        "pass_number_or_qr": single_token,
        "terminal_code": "TURNSTILE-GATE-02",
        "location": "Kaloor Metro Station Turnstile Gate 2"
    })
    assert res.status_code == 200
    first_scan = res.json()
    assert first_scan["is_valid"] == True
    assert first_scan["status"] == "VERIFIED"
    assert first_scan["token_type"] == "TRAVEL_TOKEN"
    print(f"[PASS] Travel Token 1st scan succeeded: {single_token}")

    # 2nd scan -> Must be rejected as ALREADY_USED (Server-side enforced)
    res = client.post("/api/qr/verify", json={
        "pass_number_or_qr": single_token,
        "terminal_code": "TURNSTILE-GATE-02",
        "location": "Kaloor Metro Station Turnstile Gate 2"
    })
    assert res.status_code == 200
    second_scan = res.json()
    assert second_scan["is_valid"] == False
    assert second_scan["status"] == "ALREADY_USED"
    assert "ALREADY USED" in second_scan["failure_reason"]
    print(f"[PASS] Travel Token 2nd scan correctly rejected as ALREADY_USED (Anti-passback protection)")

    # 18. Expired Pass Verification Check
    res = client.post("/api/qr/verify", json={
        "pass_number_or_qr": "SCP-2025-00088",
        "terminal_code": "TERMINAL-KL-RTO-TCR",
        "location": "Thrissur Central Stand Gate 2"
    })
    assert res.status_code == 200
    exp_verify = res.json()
    assert exp_verify["is_valid"] == False
    assert exp_verify["status"] == "EXPIRED"
    print(f"[PASS] Expired pass correctly identified (Status: EXPIRED, valid_until: {exp_verify['valid_until']})")

    # 19. Admin Verification Logs with Search and Filter
    res = client.get("/api/admin/verifications", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    logs = res.json()
    assert len(logs) > 0
    print(f"[PASS] Admin retrieved {len(logs)} audit logs")

    # Filter logs by VERIFIED
    res = client.get("/api/admin/verifications?status_filter=VERIFIED", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    verified_logs = res.json()
    assert all(l["status"] == "VERIFIED" for l in verified_logs)
    print(f"[PASS] Admin verification status filter passed: found {len(verified_logs)} verified records")

    # Search logs by "Shreeram"
    res = client.get("/api/admin/verifications?search=Shreeram", headers={"Authorization": f"Bearer {admin_token}"})
    assert res.status_code == 200
    shreeram_logs = res.json()
    assert len(shreeram_logs) > 0
    print(f"[PASS] Admin verification search passed: found {len(shreeram_logs)} records for 'Shreeram'")

if __name__ == "__main__":
    test_health()
    test_auth_login()
    print("\nALL 19 BACKEND API, DIGITAL PASS, QR AUDIT & SECURITY TESTS PASSED SUCCESSFULLY!")
