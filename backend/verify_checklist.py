import urllib.request
import urllib.error
import json
import time
import sys

BASE = 'http://localhost:5173/api'
results = []

def http_req(url, method="GET", data=None, token=None):
    headers = {"Content-Type": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    
    body = json.dumps(data).encode("utf-8") if data is not None else None
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            status = resp.status
            content = resp.read().decode("utf-8")
            parsed = json.loads(content) if content else {}
            return status, parsed, content
    except urllib.error.HTTPError as e:
        err_content = e.read().decode("utf-8")
        try:
            parsed = json.loads(err_content)
        except Exception:
            parsed = {"detail": err_content}
        return e.code, parsed, err_content
    except Exception as e:
        return 0, {"detail": str(e)}, str(e)

def run_test(num, name, fn):
    try:
        ok, msg = fn()
        status = 'PASS' if ok else 'FAIL'
        results.append((num, name, status, msg))
        print(f"[{status}] Test {num}: {name} -> {msg}")
    except Exception as e:
        results.append((num, name, 'FAIL', str(e)))
        print(f"[FAIL] Test {num}: {name} -> Exception: {e}")

tokens = {}

# 1. Backend health check: GET /api/health -> 200 OK
def test_1():
    status, data, _ = http_req(f"{BASE}/health")
    return status == 200 and data.get("status") == "HEALTHY", f"HTTP {status}, status={data.get('status')}"

# 2. Login as student: POST /api/auth/login with student@yaathri.kerala.gov.in / Student@123 -> returns token, role=STUDENT
def test_2():
    status, data, text = http_req(f"{BASE}/auth/login", method="POST", data={"email": "student@yaathri.kerala.gov.in", "password": "Student@123"})
    if status == 200 and data.get("user", {}).get("role") == "STUDENT":
        tokens["STUDENT"] = data["access_token"]
        return True, f"Token received, role={data['user']['role']}"
    return False, f"HTTP {status}: {text}"

# 3. Login as institution: POST /api/auth/login with institution@yaathri.kerala.gov.in / Institution@123 -> returns token, role=INSTITUTION
def test_3():
    status, data, text = http_req(f"{BASE}/auth/login", method="POST", data={"email": "institution@yaathri.kerala.gov.in", "password": "Institution@123"})
    if status == 200 and data.get("user", {}).get("role") == "INSTITUTION":
        tokens["INSTITUTION"] = data["access_token"]
        return True, f"Token received, role={data['user']['role']}"
    return False, f"HTTP {status}: {text}"

# 4. Login as verifier (KSRTC): POST /api/auth/login with verifier.ksrtc@yaathri.kerala.gov.in / Verifier@123 -> returns token, role=VERIFIER
def test_4():
    status, data, text = http_req(f"{BASE}/auth/login", method="POST", data={"email": "verifier.ksrtc@yaathri.kerala.gov.in", "password": "Verifier@123"})
    if status == 200 and data.get("user", {}).get("role") == "VERIFIER":
        tokens["VERIFIER"] = data["access_token"]
        return True, f"Token received, role={data['user']['role']}"
    return False, f"HTTP {status}: {text}"

# 5. Login as RTO: POST /api/auth/login with rto@yaathri.kerala.gov.in / Rto@123 -> returns token, role=RTO
def test_5():
    status, data, text = http_req(f"{BASE}/auth/login", method="POST", data={"email": "rto@yaathri.kerala.gov.in", "password": "Rto@123"})
    if status == 200 and data.get("user", {}).get("role") == "RTO":
        tokens["RTO"] = data["access_token"]
        return True, f"Token received, role={data['user']['role']}"
    return False, f"HTTP {status}: {text}"

# 6. Login as admin: POST /api/auth/login with admin@yaathri.kerala.gov.in / Admin@123 -> returns token, role=ADMIN
def test_6():
    status, data, text = http_req(f"{BASE}/auth/login", method="POST", data={"email": "admin@yaathri.kerala.gov.in", "password": "Admin@123"})
    if status == 200 and data.get("user", {}).get("role") == "ADMIN":
        tokens["ADMIN"] = data["access_token"]
        return True, f"Token received, role={data['user']['role']}"
    return False, f"HTTP {status}: {text}"

# 7. Register new student: POST /api/auth/register with valid student data -> returns token, role=STUDENT, student profile created
ts = int(time.time())
reg_email = f"student_{ts}@cce.edu.in"
reg_roll = f"CCE26CS{ts % 10000:04d}"
def test_7():
    payload = {
        "email": reg_email,
        "password": "Password@123",
        "full_name": "Aravind Krishnan",
        "roll_number": reg_roll,
        "phone": "+91 98470 99999",
        "college_name": "Christ College of Engineering, Irinjalakuda"
    }
    status, data, text = http_req(f"{BASE}/auth/register", method="POST", data=payload)
    if status == 200 and data.get("user", {}).get("role") == "STUDENT":
        tokens["NEW_STUDENT"] = data["access_token"]
        return True, f"Registered {reg_email}, token received, role=STUDENT"
    return False, f"HTTP {status}: {text}"

# 8. Duplicate registration: POST /api/auth/register with same email -> returns 400 Bad Request with clear message
def test_8():
    payload = {
        "email": reg_email,
        "password": "Password@123",
        "full_name": "Aravind Krishnan Duplicate",
        "roll_number": f"DUP{ts % 10000:04d}",
        "phone": "+91 98470 99999"
    }
    status, data, text = http_req(f"{BASE}/auth/register", method="POST", data=payload)
    if status == 400 and "already exists" in str(data.get("detail")):
        return True, f"HTTP 400 correctly returned: {data.get('detail')}"
    return False, f"HTTP {status}: {text}"

# 9. Invalid login: POST /api/auth/login with wrong password -> returns 401 Unauthorized
def test_9():
    status, data, text = http_req(f"{BASE}/auth/login", method="POST", data={"email": "student@yaathri.kerala.gov.in", "password": "WrongPassword@999"})
    if status == 401 and "Invalid" in str(data.get("detail")):
        return True, f"HTTP 401 correctly returned: {data.get('detail')}"
    return False, f"HTTP {status}: {text}"

# 10. Get current user: GET /api/auth/me with Bearer token for each role -> returns correct user profile and role-specific data
def test_10():
    all_ok = True
    details = []
    for role in ["STUDENT", "INSTITUTION", "VERIFIER", "RTO", "ADMIN"]:
        t = tokens.get(role)
        status, data, _ = http_req(f"{BASE}/auth/me", token=t)
        if status == 200 and data.get("user", {}).get("role") == role:
            details.append(f"{role}: OK")
        else:
            all_ok = False
            details.append(f"{role}: FAILED (HTTP {status})")
    return all_ok, "; ".join(details)

# 11. Verifier profile: GET /api/verifier/profile with verifier token -> returns verifier details
def test_11():
    status, data, text = http_req(f"{BASE}/verifier/profile", token=tokens["VERIFIER"])
    if status == 200 and data.get("verifier_code") == "KSRTC-V1024":
        return True, f"Verifier: {data.get('full_name')} ({data.get('verifier_code')})"
    return False, f"HTTP {status}: {text}"

# 12. RTO dashboard: GET /api/rto/dashboard with RTO token -> returns KPIs and stats
def test_12():
    status, data, text = http_req(f"{BASE}/rto/dashboard", token=tokens["RTO"])
    if status == 200 and "total_verifications" in data:
        return True, f"RTO KPIs: total_verifiers={data.get('total_verifiers')}, total_verifications={data.get('total_verifications')}"
    return False, f"HTTP {status}: {text}"

# 13. Institution applications: GET /api/applications with institution token -> returns applications list
def test_13():
    status, data, text = http_req(f"{BASE}/applications", token=tokens["INSTITUTION"])
    if status == 200 and isinstance(data, list):
        return True, f"Retrieved {len(data)} applications"
    return False, f"HTTP {status}: {text}"

# 14. Student active pass: GET /api/passes/active with student token -> returns active pass
def test_14():
    status, data, text = http_req(f"{BASE}/passes/active", token=tokens["STUDENT"])
    if status == 200 and data.get("pass_number"):
        return True, f"Active pass found: {data.get('pass_number')}, status={data.get('status')}"
    return False, f"HTTP {status}: {text}"

if __name__ == "__main__":
    print("--- RUNNING YAATHRI 14-POINT AUTH & ROLE VERIFICATION CHECKLIST ---")
    run_test(1, "Backend health check (GET /api/health)", test_1)
    run_test(2, "Login as student (POST /api/auth/login)", test_2)
    run_test(3, "Login as institution (POST /api/auth/login)", test_3)
    run_test(4, "Login as verifier (KSRTC) (POST /api/auth/login)", test_4)
    run_test(5, "Login as RTO (POST /api/auth/login)", test_5)
    run_test(6, "Login as admin (POST /api/auth/login)", test_6)
    run_test(7, "Register new student (POST /api/auth/register)", test_7)
    run_test(8, "Duplicate registration (POST /api/auth/register)", test_8)
    run_test(9, "Invalid login (POST /api/auth/login)", test_9)
    run_test(10, "Get current user /auth/me for all roles", test_10)
    run_test(11, "Verifier profile (GET /api/verifier/profile)", test_11)
    run_test(12, "RTO dashboard (GET /api/rto/dashboard)", test_12)
    run_test(13, "Institution applications (GET /api/applications)", test_13)
    run_test(14, "Student active pass (GET /api/passes/active)", test_14)

    total_passed = sum(1 for _, _, status, _ in results if status == "PASS")
    total_tests = len(results)
    print(f"\nFINAL SUMMARY: {total_passed}/{total_tests} TESTS PASSED")
    if total_passed < total_tests:
        sys.exit(1)
