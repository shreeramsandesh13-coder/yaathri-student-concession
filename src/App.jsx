import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import DarkVeilBackground from './components/AnimatedBackground/DarkVeilBackground';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';

// Public Pages
import HomePage from './pages/HomePage';
import HowItWorksPage from './pages/HowItWorksPage';
import TransportPage from './pages/TransportPage';
import VerificationPage from './pages/VerificationPage';
import RoutesPage from './pages/RoutesPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

// Authenticated Role Portal Pages
import StudentPortalPage from './pages/student/StudentPortalPage';
import InstitutionPortalPage from './pages/institution/InstitutionPortalPage';
import VerifierPortalPage from './pages/verifier/VerifierPortalPage';
import RtoPortalPage from './pages/rto/RtoPortalPage';
import ProtectedRoute from './components/ProtectedRoute';

import { initialStudentData, specimenStudentData, initialTimeline } from './data/student';
import { api } from './services/api';

/**
 * ScrollToTop helper: scrolls window smoothly to top on route change
 */
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function MainApp() {
  const { user, student, isAdmin, isInstitution, isVerifier, isRto, isStudent, isAuthenticated } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [timeline, setTimeline] = useState(initialTimeline);
  const navigate = useNavigate();

  // Sync with live backend student profile and application status when student is authenticated
  useEffect(() => {
    async function syncStudentData() {
      if (!student || isAdmin) return;

      const baseName = student.full_name || 'Student';
      let currentStatus = 'NOT_APPLIED';
      let passNum = null;
      let validDate = null;
      let rejectionReason = null;
      let appNumber = null;
      let activePassObj = null;
      let instQr = student.institutional_qr_code || null;

      try {
        const [appsRes, instRes, passRes] = await Promise.allSettled([
          api.applications.list(),
          api.qr.getInstitutional(),
          api.passes.getActive(),
        ]);

        if (appsRes.status === 'fulfilled' && appsRes.value && appsRes.value.length > 0) {
          const latestApp = appsRes.value[0];
          currentStatus = latestApp.status;
          appNumber = latestApp.application_number;
          rejectionReason = latestApp.rejection_reason || latestApp.reviewer_notes;
          if (latestApp.issued_pass) {
            passNum = latestApp.issued_pass.pass_number;
            validDate = latestApp.issued_pass.expiry_date || validDate;
            activePassObj = latestApp.issued_pass;
          }
        }

        if (instRes.status === 'fulfilled' && instRes.value?.institutional_qr_code) {
          instQr = instRes.value.institutional_qr_code;
        }

        if (passRes.status === 'fulfilled' && passRes.value) {
          activePassObj = passRes.value;
          passNum = activePassObj.pass_number || passNum;
          validDate = activePassObj.valid_until || activePassObj.expiry_date || validDate;
          if (currentStatus === 'NOT_APPLIED') {
            currentStatus = activePassObj.status || 'ACTIVE';
          }
        }
      } catch (e) {
        console.warn('Could not sync student telemetry:', e);
      }

      setStudentData({
        id: student.id,
        name: baseName,
        rollNo: student.roll_number || 'CCE24CS001',
        studentIdNumber: student.student_id_number || 'STU-2024-8841',
        college: student.institution_name || student.college_address || 'Christ College of Engineering, Irinjalakuda',
        course: student.course || 'B.Tech Computer Science',
        year: student.semester || student.year_semester || '3rd Year (Semester 5)',
        bloodGroup: student.blood_group || 'O +ve',
        photoUrl: student.photo_url || initialStudentData.photoUrl,
        passId: activePassObj?.id || 1,
        passNumber: passNum || (currentStatus === 'ACTIVE' ? 'SCP-2026-00124' : 'PENDING APPROVAL'),
        validUntil: validDate || (currentStatus === 'ACTIVE' ? '31 / 03 / 2027' : 'Pending'),
        status: currentStatus,
        applicationId: appNumber,
        rejectionReason: rejectionReason,
        institutionalQrCode: instQr || 'YAATHRI-ID:9f4c6b81a02e482db8e69d718b5c9012',
        routeCorridor: activePassObj?.route_name || activePassObj?.route?.corridor || 'Thrissur ⇄ Ernakulam (Via Aluva, Angamaly, Chalakudy)',
        origin: activePassObj?.starting_point || activePassObj?.route?.from_location || 'Thrissur Central',
        destination: activePassObj?.destination || activePassObj?.route?.to_location || 'Ernakulam South',
        transportMode: activePassObj?.transport_type || 'Bus & Metro',
        subsidyRate: activePassObj?.subsidy_rate || '80% KSRTC / 50% METRO',
        issueDate: activePassObj?.valid_from || activePassObj?.issue_date || '01 / 06 / 2024',
        email: user?.email || '',
        phone: student.phone || '+91 98470 12345',
        age: student.age || '21',
        dob: student.dob || '14 / 08 / 2003',
        emergencyPhone: student.emergency_phone || '+91 94471 98765',
        studentAddress: student.student_address || 'Thrissur, Kerala',
        collegeAddress: student.college_address || 'Christ College of Engineering, Irinjalakuda, Thrissur – 680125',
      });

      // Sync timeline based on real application status
      if (currentStatus === 'PENDING') {
        setTimeline([
          {
            step: 1,
            title: 'Application Submitted',
            date: 'RECENTLY',
            description: `Application ${appNumber || ''} received by RTO Kerala node.`,
            completed: true,
            active: false,
          },
          {
            step: 2,
            title: 'Institutional & RTO Audit',
            date: 'IN PROGRESS',
            description: 'Awaiting administrative officer document endorsement.',
            completed: false,
            active: true,
          },
          {
            step: 3,
            title: 'Corridor Allocation',
            date: 'PENDING',
            description: 'Route fare subsidy validation.',
            completed: false,
            active: false,
          },
          {
            step: 4,
            title: 'Digital Pass Issuance',
            date: 'PENDING',
            description: 'Secure QR digital credential generation.',
            completed: false,
            active: false,
          },
        ]);
      } else if (currentStatus === 'REJECTED') {
        setTimeline([
          {
            step: 1,
            title: 'Application Submitted',
            date: 'RECENTLY',
            description: `Application ${appNumber || ''} was submitted.`,
            completed: true,
            active: false,
          },
          {
            step: 2,
            title: 'Application Rejected',
            date: 'ATTENTION REQUIRED',
            description: rejectionReason ? `Reason: ${rejectionReason}` : 'Eligibility criteria mismatch.',
            completed: false,
            active: true,
            isError: true,
          },
          {
            step: 3,
            title: 'Corridor Allocation',
            date: 'SUSPENDED',
            description: 'Route allocation cancelled.',
            completed: false,
            active: false,
          },
          {
            step: 4,
            title: 'Digital Pass Inactive',
            date: 'SUSPENDED',
            description: 'Pass not generated.',
            completed: false,
            active: false,
          },
        ]);
      } else {
        setTimeline(initialTimeline);
      }
    }

    if (isAuthenticated) {
      syncStudentData();
    } else {
      setStudentData(null);
      setTimeline(initialTimeline);
    }
  }, [student, isAdmin, user, isAuthenticated]);

  const handleSplashComplete = () => {
    try {
      sessionStorage.setItem('yaathri_intro_played', 'true');
    } catch (e) {
      console.warn('Unable to persist intro session flag', e);
    }
    setShowSplash(false);
  };

  const handlePortalSwitch = (tab) => {
    if (tab === 'verifier') navigate('/verifier');
    else if (tab === 'rto') navigate('/rto');
    else if (tab === 'admin' || tab === 'institution') navigate('/institution');
    else navigate('/student');
  };

  const handleApplicationSubmitted = (newFormData) => {
    setStudentData((prev) => ({
      ...(prev || {}),
      photoUrl: newFormData.photoUrl || prev?.photoUrl,
      name: newFormData.fullName || prev?.name,
      rollNo: newFormData.rollNumber || prev?.rollNo,
      college: newFormData.college || prev?.college,
      course: newFormData.course || prev?.course,
      status: 'PENDING',
    }));
  };

  const handleRenewSuccess = () => {
    setStudentData((prev) => ({
      ...(prev || {}),
      validUntil: '31 MAR 2027',
      status: 'ACTIVE',
    }));
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden selection:bg-sky-500 selection:text-white flex flex-col justify-between">
      {/* 0. Intro Animation on First Session Visit */}
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      {/* 1. WebGL Animated Background */}
      <DarkVeilBackground />

      {/* 2. Global Navigation */}
      <Navbar studentData={studentData} />

      {/* 3. Multi-Page Routes */}
      <main className="pt-16 sm:pt-20 flex-1 w-full relative z-10">
        <ScrollToTop />
        <Routes>
          {/* Public Pages */}
          <Route
            path="/"
            element={
              <HomePage
                studentData={studentData || specimenStudentData}
                onSelectPortal={handlePortalSwitch}
              />
            }
          />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/transport" element={<TransportPage />} />
          <Route path="/verification" element={<VerificationPage />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Authenticated / Role Portals */}
          <Route
            path="/student/*"
            element={
              <ProtectedRoute allowedRoles={['STUDENT']}>
                <StudentPortalPage
                  studentData={studentData || specimenStudentData}
                  timeline={timeline}
                  onApplicationSubmitted={handleApplicationSubmitted}
                  onRenewSuccess={handleRenewSuccess}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/institution/*"
            element={
              <ProtectedRoute allowedRoles={['INSTITUTION', 'ADMIN']}>
                <InstitutionPortalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verifier/*"
            element={
              <ProtectedRoute allowedRoles={['VERIFIER']}>
                <VerifierPortalPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rto/*"
            element={
              <ProtectedRoute allowedRoles={['RTO']}>
                <RtoPortalPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* 4. Global Footer */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <MainApp />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
