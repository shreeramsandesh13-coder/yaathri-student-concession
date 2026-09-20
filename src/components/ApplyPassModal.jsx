import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import Badge from './ui/Badge';

/**
 * Redesigned 7-Step Student Concession Application Wizard
 * Steps:
 * 01 Personal Information
 * 02 Institution
 * 03 Transport
 * 04 Route
 * 05 Documents
 * 06 Review
 * 07 Submit
 */
const STEPS = [
  { num: 1, title: 'Personal', subtitle: 'Basic student details' },
  { num: 2, title: 'Institution', subtitle: 'Academic enrollment' },
  { num: 3, title: 'Transport', subtitle: 'Transit modes' },
  { num: 4, title: 'Route', subtitle: 'Stages and corridor' },
  { num: 5, title: 'Documents', subtitle: 'ID proof & portrait' },
  { num: 6, title: 'Review', subtitle: 'Confirm application' },
  { num: 7, title: 'Submit', subtitle: 'Official attestation' },
];

export default function ApplyPassModal({ isOpen, onClose, onSubmittedApplication }) {
  const { student, user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdAppId, setCreatedAppId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    fullName: student?.full_name || '',
    rollNumber: student?.roll_number || '',
    phone: student?.phone || '+91 ',
    email: user?.email || '',
    age: '20',
    dob: '14/08/2004',
    bloodGroup: 'O+ve',
    emergencyPhone: '+91 94471 98765',
    studentAddress: 'Mission Quarters, Thrissur Central, Kerala – 680001',
    college: student?.institution_name || 'Christ College of Engineering, Irinjalakuda',
    course: student?.course || 'B.Tech Computer Science',
    year: '3rd Year (Semester 5)',
    collegeAddress: 'Christ College of Engineering, Irinjalakuda, Thrissur – 680125',
    transportType: 'Bus & Metro (Intermodal Concession)',
    startingPoint: 'Thrissur Central',
    destination: 'Ernakulam South',
    route: 'NH 544 Corridor (Thrissur ⇄ Ernakulam via Chalakudy & Aluva)',
  });

  const [idFileName, setIdFileName] = useState('College_ID_Card.pdf');
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const payload = {
        student_name: formData.fullName || 'Student',
        roll_number: formData.rollNumber || 'CCE24CS001',
        institution_name: formData.college,
        course_name: formData.course,
        academic_year: formData.year,
        transport_type: formData.transportType.includes('Metro') ? 'BUS_AND_METRO' : 'KSRTC_ORDINARY',
        starting_point: formData.startingPoint,
        destination: formData.destination,
        route_corridor: formData.route,
        concession_type: 'STUDENT_SUBSIDY_80',
        id_proof_url: 'https://yaathri.kerala.gov.in/docs/student-proof.pdf',
        photo_url: photoPreview || 'https://lh3.googleusercontent.com/aida-public/AB6AXuDxIOtGgfZ1xzAMTLlUAwHX9CcdtIFuDQY4RTI4qWrBjRHW7uru56nH1vurIQKUsbkhbp-43R4ptwoUlode-NXOPgdADsjJybp_UaGdHLFxWPnmoMH-XpFW0AFvy2WBXFqfUqy5lpAsux4nvmvXgvwmzOmC59WAiMH5jxkxMKC_07AlcPSWEnmfW1V637TgWonkvOAuFsu4p9zIfPSF5aJ5iD2ebYMtCGNnsy5CqNYrvksyIuTg39TU',
      };

      const res = await api.applications.create(payload);
      const newId = res.application_number || `APP-2026-${Math.floor(10000 + Math.random() * 90000)}`;
      setCreatedAppId(newId);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      if (onSubmittedApplication) {
        onSubmittedApplication({
          ...formData,
          applicationNumber: newId,
          status: 'PENDING',
        });
      }
    } catch (err) {
      setErrorMessage(err.message || 'Application submission failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setCurrentStep(1);
    setCreatedAppId(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title={createdAppId ? 'Application Submitted!' : 'Student Concession Application'}
      subtitle={
        createdAppId
          ? `Application Reference: ${createdAppId}`
          : `Step ${currentStep} of 7: ${STEPS[currentStep - 1].subtitle}`
      }
      maxWidth="max-w-2xl"
    >
      {createdAppId ? (
        /* SUCCESS CONFIRMATION STATE */
        <div className="text-center py-8 space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <span className="material-symbols-outlined text-[36px]">task_alt</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
              Application Enrolled
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Your application has been logged to the Kerala Higher Education and Transport Registry. It is now awaiting verification from {formData.college}.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111722] border border-slate-200/80 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400 max-w-sm mx-auto space-y-1 text-left">
            <div className="flex justify-between">
              <span>Application No:</span>
              <span className="font-bold text-slate-900 dark:text-white">{createdAppId}</span>
            </div>
            <div className="flex justify-between">
              <span>Corridor:</span>
              <span className="font-bold text-sky-600 dark:text-sky-400">{formData.startingPoint} &rarr; {formData.destination}</span>
            </div>
            <div className="flex justify-between">
              <span>Status:</span>
              <span className="font-bold text-amber-500">PENDING INSTITUTION REVIEW</span>
            </div>
          </div>

          <Button variant="primary" size="lg" onClick={handleResetAndClose} className="w-full sm:w-auto">
            View in Dashboard
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Step Indicator Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span className="font-bold text-slate-900 dark:text-white">
                0{currentStep} &bull; {STEPS[currentStep - 1].title.toUpperCase()}
              </span>
              <span>{Math.round((currentStep / 7) * 100)}% COMPLETE</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden flex">
              {STEPS.map((s) => (
                <div
                  key={s.num}
                  className={`h-full flex-1 transition-all duration-300 border-r border-white dark:border-slate-900 ${
                    s.num <= currentStep ? 'bg-sky-500' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Error Notice */}
          {errorMessage && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center space-x-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP CONTENT SWITCHER */}
          <div className="min-h-[260px] flex flex-col justify-center">
            
            {/* 01 PERSONAL INFORMATION */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name (As per College ID)"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    required
                  />
                  <Input
                    label="Date of Birth"
                    value={formData.dob}
                    onChange={(e) => handleChange('dob', e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    required
                  />
                  <Select
                    label="Blood Group"
                    value={formData.bloodGroup}
                    onChange={(e) => handleChange('bloodGroup', e.target.value)}
                    options={[
                      { value: 'O+ve', label: 'O +ve' },
                      { value: 'A+ve', label: 'A +ve' },
                      { value: 'B+ve', label: 'B +ve' },
                      { value: 'AB+ve', label: 'AB +ve' },
                      { value: 'O-ve', label: 'O -ve' },
                    ]}
                  />
                </div>
                <Input
                  label="Residential Address"
                  value={formData.studentAddress}
                  onChange={(e) => handleChange('studentAddress', e.target.value)}
                  required
                />
              </div>
            )}

            {/* 02 INSTITUTION */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <Input
                  label="College / School Name"
                  value={formData.college}
                  onChange={(e) => handleChange('college', e.target.value)}
                  required
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Student Roll No / Enrollment ID"
                    value={formData.rollNumber}
                    onChange={(e) => handleChange('rollNumber', e.target.value)}
                    required
                  />
                  <Input
                    label="Course of Study"
                    value={formData.course}
                    onChange={(e) => handleChange('course', e.target.value)}
                    required
                  />
                </div>
                <Input
                  label="Academic Year / Semester"
                  value={formData.year}
                  onChange={(e) => handleChange('year', e.target.value)}
                  required
                />
              </div>
            )}

            {/* 03 TRANSPORT */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <Select
                  label="Authorized Transport Mode"
                  value={formData.transportType}
                  onChange={(e) => handleChange('transportType', e.target.value)}
                  options={[
                    { value: 'Bus & Metro (Intermodal Concession)', label: 'Combined KSRTC Bus + Kochi Metro (80% / 50% Subsidy)' },
                    { value: 'KSRTC Ordinary & Fast Passenger', label: 'KSRTC Ordinary & Fast Passenger Only (80% Subsidy)' },
                    { value: 'Kochi Metro Line 1 Only', label: 'Kochi Metro Line 1 Only (50% Student Fare)' },
                  ]}
                />
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111722] border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <span className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase">
                    SUBSIDY GUIDELINES
                  </span>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Under Kerala Motor Vehicles concession order, enrolled collegiate students receive up to 80% fare reduction on KSRTC point-to-point journeys.
                  </p>
                </div>
              </div>
            )}

            {/* 04 ROUTE */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Boarding Point (Origin)"
                    value={formData.startingPoint}
                    onChange={(e) => handleChange('startingPoint', e.target.value)}
                    required
                  />
                  <Input
                    label="Destination (Campus Hub)"
                    value={formData.destination}
                    onChange={(e) => handleChange('destination', e.target.value)}
                    required
                  />
                </div>
                <Input
                  label="Authorized Highway / Transit Corridor"
                  value={formData.route}
                  onChange={(e) => handleChange('route', e.target.value)}
                  required
                />
              </div>
            )}

            {/* 05 DOCUMENTS */}
            {currentStep === 5 && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
                  <span className="material-symbols-outlined text-[32px] text-sky-500">upload_file</span>
                  <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                    College ID Card / Bonafide Certificate
                  </p>
                  <p className="text-[11px] text-slate-400">PDF, PNG, JPG up to 5MB</p>
                  <Badge variant="success" size="sm">ATTACHED: {idFileName}</Badge>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111722] border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="material-symbols-outlined text-emerald-500">photo_camera</span>
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Passport Size Portrait
                    </span>
                  </div>
                  <Badge variant="info" size="sm">READY FOR DIGITAL PASS</Badge>
                </div>
              </div>
            )}

            {/* 06 REVIEW */}
            {currentStep === 6 && (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#111722] border border-slate-200/80 dark:border-slate-800 space-y-2">
                  <div className="flex justify-between pb-1 border-b border-slate-200/60 dark:border-slate-800/60">
                    <span className="text-slate-400">Student:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formData.fullName || 'Student'}</span>
                  </div>
                  <div className="flex justify-between pb-1 border-b border-slate-200/60 dark:border-slate-800/60">
                    <span className="text-slate-400">Institution:</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formData.college}</span>
                  </div>
                  <div className="flex justify-between pb-1 border-b border-slate-200/60 dark:border-slate-800/60">
                    <span className="text-slate-400">Corridor:</span>
                    <span className="font-bold text-sky-600 dark:text-sky-400">{formData.startingPoint} &rarr; {formData.destination}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mode:</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">{formData.transportType}</span>
                  </div>
                </div>
              </div>
            )}

            {/* 07 SUBMIT */}
            {currentStep === 7 && (
              <div className="text-center py-4 space-y-4">
                <span className="material-symbols-outlined text-[44px] text-sky-500">verified</span>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    Confirm &amp; Attest Declaration
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    By submitting, I solemnly declare that I am a full-time enrolled student and that this pass will be used exclusively for academic commuting.
                  </p>
                </div>
              </div>
            )}

          </div>

          {/* Dialog Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={currentStep === 1 ? onClose : handleBack}
              disabled={isSubmitting}
            >
              {currentStep === 1 ? 'Cancel' : 'Back'}
            </Button>

            {currentStep < 7 ? (
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleNext}
                icon={<span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
                iconPosition="right"
              >
                Continue
              </Button>
            ) : (
              <Button
                type="button"
                variant="primary"
                size="md"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                icon={<span className="material-symbols-outlined text-[18px]">send</span>}
                iconPosition="right"
              >
                Submit Application
              </Button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
