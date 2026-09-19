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
import Footer from './components/Footer';
import ApplyPassModal from './components/ApplyPassModal';
import RenewModal from './components/RenewModal';
import AuthModal from './components/AuthModal';
import SplashScreen from './components/SplashScreen';
import { initialStudentData, initialTimeline } from './data/student';
import { api } from './services/api';

function MainApp() {
  const { user, student, isAdmin } = useAuth();
  const [showSplash, setShowSplash] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return !sessionStorage.getItem('yaathri_intro_played');
    } catch {
      return false;
    }
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [isRenewOpen, setIsRenewOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [studentData, setStudentData] = useState(initialStudentData);
  const [timeline, setTimeline] = useState(initialTimeline);

  // Sync with live backend student profile and application status when authenticated
  useEffect(() => {
    async function syncStudentData() {
      if (!student) return;

      const baseName = student.full_name || `${student.first_name || ''} ${student.last_name || ''}`.trim() || 'Student';
      let currentStatus = 'ACTIVE';
      let passNum = 'SCP-2026-00124';
      let validDate = '31 MAR 2027';
      let rejectionReason = null;
      let appNumber = 'APP-2026-00124';

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
        }
      } catch (e) {
        console.warn('Could not fetch active pass or institutional qr:', e);
      }

      setStudentData((prev) => ({
        ...prev,
        id: student.id,
        name: baseName,
        rollNo: student.roll_number || prev.rollNo,
        studentIdNumber: student.student_id_number || prev.studentIdNumber || 'STU-2024-8841',
        college: student.institution_name || student.college_address || student.institution?.name || prev.college,
        course: student.course || prev.course,
        year: student.semester || student.year_semester || prev.year,
        bloodGroup: student.blood_group || prev.bloodGroup,
        photoUrl: student.photo_url || prev.photoUrl,
        passId: activePassObj?.id || prev.passId || 1,
        passNumber: passNum,
        validUntil: validDate,
        status: currentStatus,
        applicationId: appNumber,
        rejectionReason: rejectionReason,
        institutionalQrCode: instQr || prev.institutionalQrCode || 'YAATHRI-ID:9f4c6b81a02e482db8e69d718b5c9012',
        routeCorridor: activePassObj?.route_name || activePassObj?.route?.corridor || prev.routeCorridor,
        origin: activePassObj?.starting_point || activePassObj?.route?.from_location || prev.origin,
        destination: activePassObj?.destination || activePassObj?.route?.to_location || prev.destination,
        transportMode: activePassObj?.transport_type || prev.transportMode || 'Bus & Metro',
        subsidyRate: activePassObj?.subsidy_rate || prev.subsidyRate || '80% KSRTC / 50% METRO',
        issueDate: activePassObj?.valid_from || activePassObj?.issue_date || prev.issueDate,
      }));

      // Dynamically sync timeline based on real application status
      if (currentStatus === 'PENDING') {
        setTimeline([
          {
            step: 1,
            title: "Application Submitted",
            date: "RECENTLY",
            description: `Application ${appNumber} received by RTO Kerala node.`,
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
            description: "NFC digital credential generation.",
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
            description: `Application ${appNumber} was submitted.`,
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
  }, [student]);

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
    console.log('Application registered for:', newFormData.fullName);
    setStudentData((prev) => ({
      ...prev,
      photoUrl: newFormData.photoUrl || prev.photoUrl,
      name: newFormData.fullName || prev.name,
      rollNo: newFormData.rollNumber || prev.rollNo,
      college: newFormData.college || prev.college,
      course: newFormData.course || prev.course,
      age: newFormData.age || prev.age,
      dob: newFormData.dob || prev.dob,
      bloodGroup: newFormData.bloodGroup || prev.bloodGroup,
      studentAddress: newFormData.studentAddress || prev.studentAddress,
      collegeAddress: newFormData.collegeAddress || prev.collegeAddress,
      emergencyPhone: newFormData.emergencyPhone || prev.emergencyPhone,
      from: newFormData.startingPoint || prev.from,
      to: newFormData.destination || prev.to,
      route: newFormData.route || prev.route,
    }));
  };

  const handleRenewSuccess = () => {
    setStudentData((prev) => ({
      ...prev,
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
          {activeTab === 'dashboard' && (
            <>
              <Hero
                onOpenApply={handleOpenApply}
                onGoVerify={handleGoVerify}
                studentData={studentData}
              />
              <ApplicationTimeline timeline={timeline} studentData={studentData} />
              <QuickActions
                onOpenApply={handleOpenApply}
                onGoPass={handleGoPass}
                onGoVerify={handleGoVerify}
                onOpenRenew={() => setIsRenewOpen(true)}
              />
              <VerifyPass />
            </>
          )}

          {activeTab === 'pass' && (
            <>
              <PassView studentData={studentData} />
              <ApplicationTimeline timeline={timeline} studentData={studentData} />
            </>
          )}

          {activeTab === 'verify' && (
            <div className="pt-6">
              <VerifyPass />
            </div>
          )}

          {activeTab === 'history' && (
            <HistoryView studentData={studentData} />
          )}

          {activeTab === 'admin' && (
            <div className="pt-6">
              {isAdmin ? (
                <AdminView />
              ) : (
                <div className="bg-white/80 dark:bg-[#0D1118]/90 backdrop-blur-md rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800 text-center space-y-4 max-w-xl mx-auto shadow-sm">
                  <div className="w-16 h-16 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto text-2xl font-bold">
                    🛡️
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    Officer &amp; RTO Desk Authorization Required
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    This administration console requires institutional clerk or Kerala Motor Vehicles Department (RTO) credentials.
                  </p>
                  <button
                    onClick={() => setIsAuthOpen(true)}
                    className="px-6 py-2.5 rounded-full bg-slate-900 dark:bg-sky-500 text-white dark:text-slate-950 font-bold text-sm shadow hover:opacity-90 cursor-pointer"
                  >
                    Sign In as Officer / RTO Admin
                  </button>
                </div>
              )}
            </div>
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
          studentData={studentData}
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
