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

if __name__ == "__main__":
    test_health()
    test_auth_login()
    print("\nALL BACKEND API & SECURITY TESTS PASSED SUCCESSFULLY!")
