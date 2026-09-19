export const initialStudentData = {
  name: "Shreeram Sandesh",
  rollNo: "CCE24CS001",
  passId: "SCP-2026-00124",
  college: "Christ College of Engineering, Irinjalakuda",
  course: "B.Tech Computer Science",
  year: "3rd Year (Semester 5)",
  phone: "+91 98470 12345",
  email: "shreeram.sandesh@cce.edu.in",
  age: "21",
  dob: "14 / 08 / 2003",
  origin: "Thrissur Central",
  destination: "Ernakulam South",
  routeCorridor: "Thrissur ⇄ Ernakulam (Via Aluva, Angamaly, Chalakudy)",
  zone: "ZONE 08-KL",
  issueDate: "01 / 06 / 2024",
  validUntil: "31 / 03 / 2027",
  status: "ACTIVE",
  issuedBy: "Principal, Christ College & RTO Thrissur",
  academicYear: "2024–2027",
  securityKey: "KL-08-CCE-9941-X9",
  concessionRate: "80% KSRTC / 50% METRO",
  dailyFare: "₹12",
  subsidyPercentage: "81.5%",
  turnstileGateTime: "0.3s",
  bloodGroup: "O +ve",
  emergencyPhone: "+91 94471 98765",
  studentAddress: "Flat 4B, Emerald Heights, Mission Quarters, Thrissur – 680001",
  collegeAddress: "Christ College of Engineering, Irinjalakuda, Thrissur – 680125",
  medicalInfo: "No Known Allergies (NIL)",
  otherInfo: "Authorised for KSRTC Ordinary, Fast Passenger & Kochi Metro Line 1",
  photoUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxIOtGgfZ1xzAMTLlUAwHX9CcdtIFuDQY4RTI4qWrBjRHW7uru56nH1vurIQKUsbkhbp-43R4ptwoUlode-NXOPgdADsjJybp_UaGdHLFxWPnmoMH-XpFW0AFvy2WBXFqfUqy5lpAsux4nvmvXgvwmzOmC59WAiMH5jxkxMKC_07AlcPSWEnmfW1V637TgWonkvOAuFsu4p9zIfPSF5aJ5iD2ebYMtCGNnsy5CqNYrvksyIuTg39TU",
  avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuD9ukqfRlV3BjW5BDnEj1pkMykcGD64BSVB2IEG2tsIF7nJLpHk0dOlPhLQJB0bR8ciE7SM--mLsRN6U5paQfAOhjGCUFsdCiK7LCo-Oq1gJJuQqEk5lwpIcrj20FqQTJVUpKC_BuY7Zn_EHuxxbhkF4uQg1Tq9hktM61y5kI4kWC0qgLi-DkWqqnb0w4yWHWHsjWg_eJD-1iXSULhbVOQDvXAgTYL-6LCAM0ZETfOczKC_NAJwAYZ3"
};

export const verificationDatabase = {
  "SCP-2026-00124": {
    status: "ACTIVE",
    student: "Shreeram Sandesh",
    college: "Christ College of Engineering, Irinjalakuda",
    course: "B.Tech Computer Science",
    rollNo: "CCE24CS001",
    passId: "SCP-2026-00124",
    route: "Thrissur ⇄ Ernakulam",
    corridor: "Via Aluva, Angamaly, Chalakudy (NH 544)",
    rate: "80% KSRTC / 50% METRO",
    validUntil: "31 / 03 / 2027",
    issuedBy: "Principal, Christ College & RTO Thrissur",
    hashIntegrity: "MATCHED (KL-08-9941)",
    terminalCode: "TERMINAL-KL-RTO-TCR",
    biometricStatus: "BIOMETRIC ENROLLED & VERIFIED",
    statusCode: "200 OK"
  },
  "KL-08-CCE-9941": {
    status: "ACTIVE",
    student: "Shreeram Sandesh",
    college: "Christ College of Engineering, Irinjalakuda",
    course: "B.Tech Computer Science",
    rollNo: "CCE24CS001",
    passId: "SCP-2026-00124",
    route: "Thrissur ⇄ Ernakulam",
    corridor: "Via Aluva, Angamaly, Chalakudy (NH 544)",
    rate: "80% KSRTC / 50% METRO",
    validUntil: "31 / 03 / 2027",
    issuedBy: "Principal, Christ College & RTO Thrissur",
    hashIntegrity: "MATCHED (KL-08-9941)",
    terminalCode: "TERMINAL-KL-RTO-TCR",
    biometricStatus: "BIOMETRIC ENROLLED & VERIFIED",
    statusCode: "200 OK"
  },
  "SCP-2024-EXP01": {
    status: "EXPIRED",
    student: "Arjun Vijayakumar",
    college: "Govt Engineering College, Thrissur",
    course: "B.Tech Mechanical Engineering",
    rollNo: "GEC20ME045",
    passId: "SCP-2024-EXP01",
    route: "Thrissur ⇄ Palakkad",
    corridor: "Via Wadakkanchery & Shoranur",
    rate: "80% KSRTC",
    validUntil: "31 / 12 / 2024",
    issuedBy: "Principal, GEC Thrissur & RTO Thrissur",
    hashIntegrity: "SIGNATURE EXPIRED",
    terminalCode: "TERMINAL-KL-RTO-TCR",
    biometricStatus: "EXPIRED CREDENTIAL",
    statusCode: "410 GONE"
  }
};

export const initialTimeline = [
  {
    step: 1,
    title: "Application Submitted",
    date: "Jan 12, 2024",
    description: "Student portal enrollment with Kerala Higher Ed e-Services identity.",
    completed: true,
    active: false
  },
  {
    step: 2,
    title: "College Verification",
    date: "Jan 14, 2024",
    description: "Principal endorsement, Christ College of Engineering, Irinjalakuda.",
    completed: true,
    active: false
  },
  {
    step: 3,
    title: "RTO Route Approved",
    date: "Jan 15, 2024",
    description: "Authorized corridor: Thrissur ⇄ Ernakulam via NH 544.",
    completed: true,
    active: false
  },
  {
    step: 4,
    title: "Digital Pass Active",
    date: "LIVE NOW",
    description: "NFC cryptographic token loaded on device. Tap-ready at all gates.",
    completed: true,
    active: true
  }
];

export const popularRoutes = [
  {
    id: "K-04",
    name: "Line K-04",
    route: "THRISSUR ⇄ ERNAKULAM (Via Aluva & Angamaly)",
    popular: true
  },
  {
    id: "M-01",
    name: "Metro M-01",
    route: "ALUVA ⇄ THYKOODAM (Kochi Metro Line 1)",
    popular: false
  },
  {
    id: "K-12",
    name: "Line K-12",
    route: "KOZHIKODE ⇄ MALAPPURAM (Via Ramanattukara)",
    popular: false
  },
  {
    id: "T-02",
    name: "Line T-02",
    route: "THIRUVANANTHAPURAM ⇄ KOLLAM (Via Attingal)",
    popular: false
  }
];
