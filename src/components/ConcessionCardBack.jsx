import React from 'react';

/**
 * ConcessionCardBack:
 * Pixel-faithful recreation of the physical concession card back from concession_card.png.
 * Contains Student Address, College Address, Additional Details (Blood group, Emergency contact),
 * Principal & RTO Officer signatures, and the signature tricolor accent bar.
 */
export default function ConcessionCardBack({ studentData }) {
  return (
    <div className="w-full h-full bg-white text-[#081b2e] rounded-3xl p-3.5 sm:p-6 flex flex-col justify-between overflow-hidden border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.35)] relative select-none">
      {/* TOP HEADER: STUDENT INFORMATION BANNER */}
      <div className="relative z-10 w-full bg-[#081b2e] rounded-xl py-1.5 sm:py-2 px-3 sm:px-4 text-center shadow-sm">
        <h2 className="text-white text-[11px] sm:text-sm font-black tracking-[0.25em] uppercase">
          STUDENT INFORMATION
        </h2>
      </div>

      {/* SECTION 1: STUDENT ADDRESS BOX */}
      <div className="relative z-10 bg-slate-50/70 border border-slate-200/90 rounded-2xl p-2 sm:p-3 my-0.5 sm:my-1">
        <span className="text-[8.5px] sm:text-[10px] font-black tracking-[0.15em] uppercase text-slate-800 block mb-0.5 sm:mb-1">
          STUDENT ADDRESS
        </span>
        <div className="space-y-0.5 sm:space-y-1 text-[8.5px] sm:text-[10.5px] text-[#081b2e] font-medium leading-relaxed">
          <div className="border-b border-slate-200/80 pb-0.5">
            {studentData?.studentAddress || (studentData?.isSpecimen ? 'Kerala State Student Transit Network' : 'Student Address')}
          </div>
          <div className="border-b border-slate-200/80 pb-0.5">
            {studentData?.isSpecimen ? 'Verified Student Pass Registry' : 'Kerala – 680001'}
          </div>
        </div>
      </div>

      {/* SECTION 2: COLLEGE / SCHOOL ADDRESS BOX */}
      <div className="relative z-10 bg-slate-50/70 border border-slate-200/90 rounded-2xl p-2 sm:p-3 my-0.5 sm:my-1">
        <span className="text-[8.5px] sm:text-[10px] font-black tracking-[0.15em] uppercase text-slate-800 block mb-0.5 sm:mb-1">
          COLLEGE / SCHOOL ADDRESS
        </span>
        <div className="space-y-0.5 sm:space-y-1 text-[8.5px] sm:text-[10.5px] text-[#081b2e] font-medium leading-relaxed">
          <div className="border-b border-slate-200/80 pb-0.5">
            {studentData?.collegeAddress || (studentData?.isSpecimen ? 'Kerala Higher Education Department' : 'College / School Address')}
          </div>
          <div className="border-b border-slate-200/80 pb-0.5">
            {studentData?.isSpecimen ? 'Recognized Educational Institution' : 'Kerala – 680125'}
          </div>
        </div>
      </div>

      {/* SECTION 3: ADDITIONAL STUDENT DETAILS */}
      <div className="relative z-10 bg-slate-50/70 border border-slate-200/90 rounded-2xl p-2.5 sm:p-3 my-1 space-y-1 text-[9px] sm:text-[10px]">
        <span className="text-[9px] sm:text-[10px] font-black tracking-[0.15em] uppercase text-slate-800 block mb-1">
          ADDITIONAL STUDENT DETAILS
        </span>

        <div className="grid grid-cols-12 gap-1 items-baseline border-b border-slate-200/80 pb-0.5">
          <span className="col-span-5 font-semibold text-slate-700">Blood Group</span>
          <span className="col-span-1 text-center font-bold text-slate-500">:</span>
          <span className="col-span-6 font-bold text-red-600">{studentData?.bloodGroup || (studentData?.isSpecimen ? '—' : 'O +ve')}</span>
        </div>

        <div className="grid grid-cols-12 gap-1 items-baseline border-b border-slate-200/80 pb-0.5">
          <span className="col-span-5 font-semibold text-slate-700">Emergency Contact No.</span>
          <span className="col-span-1 text-center font-bold text-slate-500">:</span>
          <span className="col-span-6 font-bold text-[#081b2e] font-mono">{studentData?.emergencyPhone || (studentData?.isSpecimen ? '+91 ••••• •••••' : '+91 94471 98765')}</span>
        </div>

        <div className="grid grid-cols-12 gap-1 items-baseline border-b border-slate-200/80 pb-0.5">
          <span className="col-span-5 font-semibold text-slate-700">Allergies / Medical Info</span>
          <span className="col-span-1 text-center font-bold text-slate-500">:</span>
          <span className="col-span-6 font-semibold text-slate-800">{studentData.medicalInfo || 'No Known Allergies (NIL)'}</span>
        </div>

        <div className="grid grid-cols-12 gap-1 items-baseline">
          <span className="col-span-5 font-semibold text-slate-700">Any Other Information</span>
          <span className="col-span-1 text-center font-bold text-slate-500">:</span>
          <span className="col-span-6 font-semibold text-slate-800 truncate">{studentData.otherInfo || 'Valid for KSRTC & Kochi Metro'}</span>
        </div>
      </div>

      {/* SECTION 4: PRINCIPAL & RTO OFFICER SIGNATURE BOXES */}
      <div className="relative z-10 grid grid-cols-2 gap-2 mt-1">
        {/* Principal Signature */}
        <div className="border border-slate-300 rounded-2xl p-2.5 text-center bg-slate-50/40 flex flex-col justify-end">
          <div className="h-5 flex items-center justify-center">
            <span
              className="font-serif italic text-sm sm:text-base text-slate-700 select-none opacity-85"
              style={{ fontFamily: "'Brush Script MT', 'Dancing Script', cursive" }}
            >
              Dr. Sajeev V.
            </span>
          </div>
          <div className="w-full border-t border-slate-400 mt-0.5" />
          <span className="text-[7.5px] sm:text-[8px] font-bold text-slate-700 tracking-wider uppercase block mt-0.5">
            Principal Signature
          </span>
        </div>

        {/* RTO Officer Signature */}
        <div className="border border-slate-300 rounded-2xl p-2.5 text-center bg-slate-50/40 flex flex-col justify-end">
          <div className="h-5 flex items-center justify-center">
            <span
              className="font-serif italic text-sm sm:text-base text-teal-800 select-none opacity-85"
              style={{ fontFamily: "'Brush Script MT', 'Dancing Script', cursive" }}
            >
              M. K. Biju (RTO)
            </span>
          </div>
          <div className="w-full border-t border-slate-400 mt-0.5" />
          <span className="text-[7.5px] sm:text-[8px] font-bold text-slate-700 tracking-wider uppercase block mt-0.5">
            RTO Officer Signature
          </span>
        </div>
      </div>

      {/* DISCLAIMER MARKING */}
      <div className="relative z-10 text-center text-[8px] sm:text-[8.5px] font-bold tracking-widest text-slate-500 uppercase mt-1">
        SAMPLE – NOT A VALID ID
      </div>

      {/* BOTTOM TRICOLOR ACCENT BAR: NAVY | TEAL | ORANGE */}
      <div className="absolute -bottom-0.5 inset-x-0 h-3 flex overflow-hidden rounded-b-3xl">
        <div className="w-[45%] h-full bg-[#081b2e]" />
        <div className="w-[35%] h-full bg-teal-600" />
        <div className="w-[20%] h-full bg-amber-500" />
      </div>
    </div>
  );
}

