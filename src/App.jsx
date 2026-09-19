import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import DarkVeilBackground from './components/AnimatedBackground/DarkVeilBackground';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ApplicationTimeline from './components/ApplicationTimeline';
import QuickActions from './components/QuickActions';
import VerifyPass from './components/VerifyPass';
import PassView from './components/PassView';
import HistoryView from './components/HistoryView';
import AdminView from './components/AdminView';
import VerifierPortal from './components/VerifierPortal';
import RtoPortal from './components/RtoPortal';
import PortalSwitcherBanner from './components/PortalSwitcherBanner';
import Footer from './components/Footer';
import ApplyPassModal from './components/ApplyPassModal';
import RenewModal from './components/RenewModal';
import AuthModal from './components/AuthModal';
import SplashScreen from './components/SplashScreen';
import { initialStudentData, initialTimeline } from './data/student';
import { api } from './services/api';

function MainApp() {
  const { user, student, isAdmin, isInstitution, isVerifier, isRto, isStudent, isAuthenticated } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isRenewOpen, setIsRenewOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [studentData, setStudentData] = useState(() => (isAdmin || isVerifier || isRto || isInstitution ? null : initialStudentData));
  const [timeline, setTimeline] = useState(initialTimeline);

  // Strict role routing & isolation
  useEffect(() => {
    if (isVerifier) {
      setStudentData(null);
      if (activeTab !== 'verifier' && activeTab !== 'portals') {
        setActiveTab('verifier');
      }
    } else if (isRto) {
      setStudentData(null);
      if (activeTab !== 'rto' && activeTab !== 'portals') {
        setActiveTab('rto');
      }
    } else if (isInstitution) {
      setStudentData(null);
      if (activeTab !== 'admin' && activeTab !== 'portals') {
        setActiveTab('admin');
      }
    } else {
      // Student or guest
      if (activeTab === 'admin' || activeTab === 'verifier' || activeTab === 'rto') {
        setActiveTab('dashboard');
      }
      if (!isAuthenticated) {
        setStudentData(initialStudentData);
        setTimeline(initialTimeline);
      }
    }
  }, [isVerifier, isRto, isInstitution, isAuthenticated]);

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
        const apps = await api.applications.list();
        if (apps && apps.length > 0) {
          const latestApp = apps[0];
          currentStatus = latestApp.status;
          appNumber = latestApp.application_number;
          rejectionReason = latestApp.rejection_reason || latestApp.reviewer_notes;
          if (latestApp.issued_pass) {
            passNum = latestApp.issued_pass.pass_number;
            validDate = latestApp.issued_pass.expiry_date || validDate;
            activePassObj = latestApp.issued_pass;
          }
        }
      } catch (e) {
        console.warn('Could not load student applications list:', e);
      }

      try {
        const [instRes, passRes] = await Promise.allSettled([
          api.qr.getInstitutional(),
          api.passes.getActive()
        ]);
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
        console.warn('Could not fetch active pass or institutional qr:', e);
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

      // Dynamically sync timeline based on real application status
      if (currentStatus === 'PENDING') {
        setTimeline([
          {
            step: 1,
            title: "Application Submitted",
            date: "RECENTLY",
            description: `Application ${appNumber || ''} received by RTO Kerala node.`,
            completed: true,
            active: false
          },
          {
            step: 2,
            title: "Institutional & RTO Audit",
            date: "IN PROGRESS",
            description: "Awaiting administrative officer document endorsement.",
            completed: false,
            active: true
          },
          {
            step: 3,
            title: "Corridor Allocation",
            date: "PENDING",
            description: "Route fare subsidy validation.",
            completed: false,
            active: false
          },
          {
            step: 4,
            title: "Digital Pass Issuance",
            date: "PENDING",
            description: "Secure QR digital credential generation.",
            completed: false,
            active: false
          }
        ]);
      } else if (currentStatus === 'REJECTED') {
        setTimeline([
          {
            step: 1,
            title: "Application Submitted",
            date: "RECENTLY",
            description: `Application ${appNumber || ''} was submitted.`,
            completed: true,
            active: false
          },
          {
            step: 2,
            title: "Application Rejected",
            date: "ATTENTION REQUIRED",
            description: rejectionReason ? `Reason: ${rejectionReason}` : "Eligibility criteria mismatch.",
            completed: false,
            active: true,
            isError: true
          },
          {
            step: 3,
            title: "Corridor Allocation",
            date: "SUSPENDED",
            description: "Route allocation cancelled.",
            completed: false,
            active: false
          },
          {
            step: 4,
            title: "Digital Pass Inactive",
            date: "SUSPENDED",
            description: "Pass not generated.",
            completed: false,
            active: false
          }
        ]);
      } else {
        setTimeline(initialTimeline);
      }
    }

    syncStudentData();
  }, [student, isAdmin, user]);

  const handleSplashComplete = () => {
    try {
      sessionStorage.setItem('yaathri_intro_played', 'true');
    } catch (e) {
      console.warn('Unable to persist intro session flag', e);
    }
    setShowSplash(false);
  };

  const handleOpenApply = () => {
    setIsApplyOpen(true);
  };

  const handleGoVerify = () => {
    if (activeTab === 'dashboard') {
      const el = document.getElementById('verify-section');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
        return;
      }
    }
    setActiveTab('verify');
  };

  const handleGoPass = () => {
    setActiveTab('pass');
  };

  const handleApplicationSubmitted = (newFormData) => {
    setStudentData((prev) => ({
      ...(prev || {}),
      photoUrl: newFormData.photoUrl || prev?.photoUrl,
      name: newFormData.fullName || prev?.name,
      rollNo: newFormData.rollNumber || prev?.rollNo,
      college: newFormData.college || prev?.college,
      course: newFormData.course || prev?.course,
      age: newFormData.age || prev?.age,
      dob: newFormData.dob || prev?.dob,
      bloodGroup: newFormData.bloodGroup || prev?.bloodGroup,
      studentAddress: newFormData.studentAddress || prev?.studentAddress,
      collegeAddress: newFormData.collegeAddress || prev?.collegeAddress,
      emergencyPhone: newFormData.emergencyPhone || prev?.emergencyPhone,
      from: newFormData.startingPoint || prev?.from,
      to: newFormData.destination || prev?.to,
      route: newFormData.route || prev?.route,
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
    <div className="min-h-screen relative overflow-x-hidden selection:bg-sky-500 selection:text-white">
      {/* 0. YAATHRI Official Startup Animation */}
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}

      {/* 1. React Bits-Style Dark Veil WebGL Animated Background */}
      <DarkVeilBackground />

      {/* 2. Main Application Content (Layered above background) */}
      <div className="relative z-10 min-h-screen flex flex-col justify-between">
        {/* Global Navigation Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenApply={handleOpenApply}
          onOpenAuth={() => setIsAuthOpen(true)}
          studentData={studentData}
        />

        {/* Main Canvas Content */}
        <main className="pt-20 sm:pt-24 pb-28 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto space-y-16 lg:space-y-24 flex-1 w-full">
          {/* ROLE & TAB ROUTING */}
          {activeTab === 'portals' ? (
            <div className="pt-4 space-y-8">
              <PortalSwitcherBanner onSelectPortal={(tab) => setActiveTab(tab)} />
            </div>
          ) : isVerifier || activeTab === 'verifier' ? (
            <div className="pt-4">
              <VerifierPortal />
            </div>
          ) : isRto || activeTab === 'rto' ? (
            <div className="pt-4">
              <RtoPortal />
            </div>
          ) : isInstitution || activeTab === 'admin' ? (
            <div className="pt-4">
              <AdminView />
            </div>
          ) : (
            /* STUDENT / VISITOR VIEW */
            <>
              {activeTab === 'dashboard' && (
                <>
                  <Hero
                    onOpenApply={handleOpenApply}
                    onGoVerify={() => setActiveTab('portals')}
                    studentData={studentData || initialStudentData}
                  />
                  <PortalSwitcherBanner onSelectPortal={(tab) => setActiveTab(tab)} />
                  <ApplicationTimeline timeline={timeline} studentData={studentData || initialStudentData} />
                  <QuickActions
                    onOpenApply={handleOpenApply}
                    onGoPass={handleGoPass}
                    onGoVerify={() => setActiveTab('portals')}
                    onOpenRenew={() => setIsRenewOpen(true)}
                  />
                </>
              )}

              {activeTab === 'pass' && (
                <>
                  <PassView studentData={studentData || initialStudentData} />
                  <ApplicationTimeline timeline={timeline} studentData={studentData || initialStudentData} />
                </>
              )}

              {activeTab === 'history' && (
                <HistoryView studentData={studentData || initialStudentData} />
              )}
            </>
          )}
        </main>

        {/* Official Footer */}
        <Footer
          onOpenApply={handleOpenApply}
          onGoVerify={handleGoVerify}
          onGoPass={handleGoPass}
        />

        {/* Multi-Step Modal Flows */}
        <ApplyPassModal
          isOpen={isApplyOpen}
          onClose={() => setIsApplyOpen(false)}
          onSubmittedApplication={handleApplicationSubmitted}
        />

        <RenewModal
          isOpen={isRenewOpen}
          onClose={() => setIsRenewOpen(false)}
          studentData={studentData || initialStudentData}
          onRenewSuccess={handleRenewSuccess}
        />

        {/* Authentication Modal */}
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}
