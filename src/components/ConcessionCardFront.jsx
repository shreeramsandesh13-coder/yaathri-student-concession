import React from 'react';
import YaathriLogo from './YaathriLogo';
import KeralaEmblem from './KeralaEmblem';

/**
 * ConcessionCardFront:
 * Pixel-faithful recreation of the physical concession card front from concession_card.png.
 * Displays real dynamic student data, Yaathri logo, Kerala emblem, photo, details, and signature.
 */
export default function ConcessionCardFront({ studentData = {} }) {
  const data = studentData || {};
  const isGuest = data.isSpecimen || !data.name || data.name === 'SAMPLE / SPECIMEN';
  const details = [
    { label: 'Student Name', value: data.name || 'SAMPLE / SPECIMEN' },
    { label: 'College / School Name', value: data.college || 'Kerala State Student Transit' },
    { label: 'College / School ID', value: data.rollNo || 'SPECIMEN-2026' },
    { label: 'Phone Number', value: data.phone || '+91 ••••• •••••' },
    { label: 'Course of Study', value: data.course || 'Student Concession Pass' },
    { label: 'Age', value: data.age || '—' },
    { label: 'Date of Birth', value: data.dob || '—' },
    { label: 'Destination From', value: data.origin || 'Thrissur Central' },
    { label: 'Destination To', value: data.destination || 'Ernakulam South' },
    { label: 'Date of Issue', value: data.issueDate || 'SAMPLE PASS' },
    { label: 'Date of Expiry', value: data.validUntil || '2026 – 2027' },
  ];

  return (
    <div className="w-full h-full bg-white text-[#081b2e] rounded-3xl p-3.5 sm:p-6 flex flex-col justify-between overflow-hidden border border-slate-200/90 shadow-[0_20px_50px_rgba(0,0,0,0.35)] relative select-none">
      {/* Subtle Card Background Watermark */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50/60 via-white to-slate-50/40 pointer-events-none" />

      {/* TOP HEADER: YAATHRI LOGO + DIVIDER + KERALA TRANSPORT EMBLEM */}
      <div className="relative z-10 flex items-center justify-between pb-1 sm:pb-2">
        <YaathriLogo variant="card" />
        <div className="w-px h-8 sm:h-10 bg-slate-300/80 mx-2 shrink-0" />
        <KeralaEmblem />
      </div>

      {/* CONCESSION CARD PILL BANNER */}
      <div className="relative z-10 w-full bg-[#081b2e] rounded-xl py-1 sm:py-1.5 px-3 sm:px-4 text-center shadow-sm my-0.5 sm:my-1">
        <h2 className="text-white text-[11px] sm:text-sm font-black tracking-[0.22em] uppercase">
          CONCESSION CARD
        </h2>
      </div>

      {/* SUB-HEADER: GREEN BAR • STUDENT TRAVEL SUPPORT • ORANGE BAR */}
      <div className="relative z-10 flex items-center justify-center space-x-2 sm:space-x-2.5 my-0.5 sm:my-1">
        <span className="h-0.5 w-6 sm:w-10 bg-teal-600 rounded-full" />
        <span className="text-[7.5px] sm:text-[9.5px] font-extrabold tracking-[0.18em] uppercase text-slate-700">
          STUDENT TRAVEL SUPPORT
        </span>
        <span className="h-0.5 w-6 sm:w-10 bg-amber-500 rounded-full" />
      </div>

      {/* CENTER: STUDENT PHOTOGRAPH (Circular Photo Area) */}
      <div className="relative z-10 flex justify-center my-1 sm:my-1.5">
        <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-slate-300 bg-slate-100 shadow-md relative flex items-center justify-center shrink-0">
          {studentData?.photoUrl ? (
            <img
              src={studentData.photoUrl}
              alt="Student Portrait"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                if (e.target.nextSibling) {
                  e.target.nextSibling.style.display = 'flex';
                }
              }}
            />
          ) : null}
          <div
            className={`w-full h-full bg-slate-200 text-slate-400 flex items-center justify-center ${
              studentData?.photoUrl ? 'hidden' : 'flex'
            }`}
          >
            <span className="material-symbols-outlined text-[30px] sm:text-[44px]">person</span>
          </div>
        </div>
      </div>

      {/* STUDENT INFORMATION LEDGER TABLE */}
      <div className="relative z-10 px-0.5 sm:px-2 space-y-0.5 text-[8.5px] sm:text-[10.5px] font-medium leading-tight">
        {details.map((item) => (
          <div key={item.label} className="grid grid-cols-12 gap-1 items-baseline">
            <span className="col-span-5 font-semibold text-slate-800 tracking-tight">
              {item.label}
            </span>
            <span className="col-span-1 text-center font-bold text-slate-600">:</span>
            <span className="col-span-6 font-bold text-[#081b2e] truncate">
              {item.value}
            </span>
          </div>
        ))}
      </div>

      {/* STUDENT SIGNATURE BOX */}
      <div className="relative z-10 mt-2 border border-slate-300 rounded-xl p-2.5 text-center bg-slate-50/40">
        <div className="h-5 flex items-center justify-center">
          <span
            className="font-serif italic text-base sm:text-lg text-slate-800 tracking-wider select-none opacity-85"
            style={{ fontFamily: "'Brush Script MT', 'Dancing Script', cursive" }}
          >
            {studentData.name ? studentData.name.split(' ')[0] : 'Shreeram'}
          </span>
        </div>
        <div className="w-44 mx-auto border-t border-slate-400 mt-0.5" />
        <span className="text-[8px] font-bold text-slate-600 tracking-wider uppercase block mt-0.5">
          Student Signature
        </span>
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

