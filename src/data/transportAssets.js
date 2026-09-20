import busDesktop from '../assets/image/busdesktop.jpeg';
import busMobile from '../assets/image/busmobile.jpeg';
import metroDesktop from '../assets/image/metrodesktop.jpeg';
import metroMobile from '../assets/image/metromobile.jpeg';
import graduationDesktop from '../assets/image/graduationdesktop.jpeg';
import graduationMobile from '../assets/image/graduationmobile.jpeg';
import rtoDesktop from '../assets/image/rtodesktop.jpeg';
import rtoMobile from '../assets/image/rtomobile.jpeg';

/**
 * CENTRALIZED IMMUTABLE TRANSPORT ASSET & CHAPTER REGISTRY
 * 
 * Explicit named mapping to guarantee that KSRTC ALWAYS receives bus assets,
 * Metro receives metro assets, College receives graduation assets, and RTO receives rto assets.
 * Positional array indexing is strictly forbidden for asset lookup.
 */
export const TRANSPORT_REGISTRY = {
  ksrtc: {
    id: 'ksrtc',
    chapterNumber: '01',
    name: 'KSRTC',
    subtitle: 'Kerala State Road Transport Corporation',
    heading: 'Digital concessions for everyday bus journeys.',
    summary: 'Seamless concession verification across public bus networks throughout Kerala.',
    description:
      'Empowering lakhs of daily student commuters across thousands of rural, semi-urban, and interstate routes with contactless cryptographic pass verification.',
    desktopAsset: busDesktop,
    mobileAsset: busMobile,
    alt: 'KSRTC Public Bus Fleet in Kerala',
    routeExample: {
      from: 'Thrissur Central Stand',
      to: 'Ernakulam South Depot',
      corridor: 'Corridor K-04 (Via Chalakudy & Angamaly)',
      stops: 8,
      subsidyRate: '81.5% State Concession',
      standardFare: '₹95',
      concessionFare: '₹18',
    },
    verificationWorkflow: [
      { step: '01', title: 'Student Presents Pass', desc: 'Passenger displays active YAATHRI 3D pass or 90s offline travel token.' },
      { step: '02', title: 'Conductor Scans QR', desc: 'Handheld mobile camera reads encrypted token in under 0.3 seconds.' },
      { step: '03', title: 'Pass Verified', desc: 'Instant student portrait, roll number, and valid date range display.' },
      { step: '04', title: 'Route Confirmed', desc: 'System confirms current bus route matches student authorized corridor.' },
      { step: '05', title: 'Travel Cleared', desc: 'Boarding record logs to depot shift ledger for RTO audit.' },
    ],
    features: [
      'QR-based cryptographic verification',
      'Student concession fare validation',
      'Route-aware pass enforcement',
      'Fast conductor mobile terminal app',
      'Tamper-proof digital identity',
    ],
    stats: [
      { label: 'State Routes', value: '4,200+' },
      { label: 'Daily Students', value: '3.2 Lakh' },
      { label: 'Concession Rate', value: 'Up to 80%' },
    ],
    actions: [
      { label: 'Apply KSRTC Pass', to: '/student/apply', variant: 'primary' },
      { label: 'Conductor Terminal', to: '/verifier', variant: 'outline' },
      { label: 'View Bus Corridor', to: '/routes', variant: 'ghost' },
    ],
  },

  metro: {
    id: 'metro',
    chapterNumber: '02',
    name: 'KOCHI METRO',
    subtitle: 'Kochi Metro Rail Limited (KMRL)',
    heading: 'One digital pass for connected urban journeys.',
    summary: 'Contactless student transit across high-density urban corridors with automated turnstiles.',
    description:
      'High-speed rapid transit integration enabling frictionless student passage through optical turnstiles with anti-passback security and single-use 90-second tokens.',
    desktopAsset: metroDesktop,
    mobileAsset: metroMobile,
    alt: 'Kochi Metro Rapid Urban Transit Train',
    routeExample: {
      from: 'Aluva Metro Interchange',
      to: 'MG Road / Maharaja’s College',
      corridor: 'Line 1 (Phase 1 Corridor)',
      stops: 16,
      subsidyRate: '50% Metro Student Pass',
      standardFare: '₹60',
      concessionFare: '₹30',
    },
    verificationWorkflow: [
      { step: '01', title: 'Generate Token', desc: 'Student generates 90-second single-use travel token in YAATHRI app.' },
      { step: '02', title: 'Align at Turnstile', desc: 'Passenger places QR against optical reader glass at metro gate.' },
      { step: '03', title: 'Cryptographic Check', desc: 'Turnstile gate validates token signature within 300 milliseconds.' },
      { step: '04', title: 'Gate Unlocks', desc: 'Paddle doors open for contactless boarding with zero queue.' },
      { step: '05', title: 'Stage Recorded', desc: 'Entry and exit station stages are recorded for fare reconciliation.' },
    ],
    features: [
      'Digital student concession fare',
      '0.3s high-speed turnstile verification',
      'Route and station validity checks',
      'Real-time pass active status',
      'Anti-passback cryptographic safeguards',
    ],
    stats: [
      { label: 'Metro Stations', value: '25 Active' },
      { label: 'Gate Scan Time', value: '0.3 Sec' },
      { label: 'Student Subsidy', value: '50% Off' },
    ],
    actions: [
      { label: 'Apply Metro Concession', to: '/student/apply', variant: 'primary' },
      { label: 'Gate Scanner View', to: '/verification', variant: 'outline' },
      { label: 'View Metro Line', to: '/routes', variant: 'ghost' },
    ],
  },

  college: {
    id: 'college',
    chapterNumber: '03',
    name: 'COLLEGE / SCHOOL',
    subtitle: 'Accredited Higher Education & Higher Secondary',
    heading: 'Verified student identity from campus to transit.',
    summary: 'Institutional enrollment validation linking academic records with state transit passes.',
    description:
      'Principals, deans, and registrar clerks review applications, verify bona fide student status, inspect enrollment documents, and issue digital endorsements in real time.',
    desktopAsset: graduationDesktop,
    mobileAsset: graduationMobile,
    alt: 'Higher Education Academic Graduation Identity',
    routeExample: {
      from: 'Student Residence Corridor',
      to: 'College Campus Bus Stop',
      corridor: 'Designated College Commute Line',
      stops: 'Daily Commute',
      subsidyRate: 'Academic Session Pass',
      standardFare: 'Commercial Tariff',
      concessionFare: 'Subsidized Rate',
    },
    verificationWorkflow: [
      { step: '01', title: 'Student Enrolls', desc: 'Student applies online with student ID and fee receipt upload.' },
      { step: '02', title: 'Registrar Audits', desc: 'College administrative staff inspects proofs in document drawer.' },
      { step: '03', title: 'Institution Approves', desc: 'Principal or desk officer endorses application with one click.' },
      { step: '04', title: 'Pass Generated', desc: 'Cryptographically signed digital pass is issued to student.' },
      { step: '05', title: 'Academic Sync', desc: 'Pass validity dynamically syncs with academic semester dates.' },
    ],
    features: [
      'Digital student enrollment verification',
      'In-browser document proof inspection',
      'One-click institutional endorsement',
      'Automated semester expiry calculation',
      'Zero paper forms or manual physical seals',
    ],
    stats: [
      { label: 'Registered Colleges', value: '450+' },
      { label: 'Approval Speed', value: 'Under 24h' },
      { label: 'Paper Elimination', value: '100%' },
    ],
    actions: [
      { label: 'Institution Registrar Desk', to: '/institution', variant: 'primary' },
      { label: 'Attestation Workflow', to: '/how-it-works', variant: 'outline' },
      { label: 'Student Portal', to: '/student', variant: 'ghost' },
    ],
  },

  rto: {
    id: 'rto',
    chapterNumber: '04',
    name: 'RTO / MVD',
    subtitle: 'Kerala Motor Vehicles Department & Directorate',
    heading: 'Authorized verification and transport oversight.',
    summary: 'State-wide regulatory enforcement, verifier terminal licensing, and live audit telemetry.',
    description:
      'The central supervisory authority overseeing bus conductors, private fleet crews, and metro turnstile terminals with real-time audit logs and instant authority suspension rights.',
    desktopAsset: rtoDesktop,
    mobileAsset: rtoMobile,
    alt: 'Kerala Regional Transport Office Vehicle Oversight',
    routeExample: {
      from: 'Kerala Transport Commission',
      to: 'All 14 Regional RTO Depots',
      corridor: 'Statewide Transit Regulatory Corridor',
      stops: '14 Regional Nodes',
      subsidyRate: 'Government Subsidy Fund',
      standardFare: 'Audited',
      concessionFare: 'Reconciled',
    },
    verificationWorkflow: [
      { step: '01', title: 'Staff Credentialing', desc: 'RTO issues cryptographically signed verifier IDs to conductors.' },
      { step: '02', title: 'Corridor Gazetting', desc: 'State defines subsidized transit routes and concession rates.' },
      { step: '03', title: 'Live Audit Stream', desc: 'Every boarding inspection across Kerala streams to RTO ledger.' },
      { step: '04', title: 'Authority Enforcement', desc: 'Instant suspension of lost or compromised handheld devices.' },
      { step: '05', title: 'Subsidy Settlement', desc: 'Automated reimbursement telemetry for transport operators.' },
    ],
    features: [
      'Authorized verifier directory & device status',
      'One-click instant verifier suspension',
      'State-wide verification audit ledger',
      'Transport fleet & route compliance tracking',
      'Accredited educational institution registry',
    ],
    stats: [
      { label: 'Enforcement Nodes', value: '14 RTOs' },
      { label: 'Licensed Devices', value: '1,200+' },
      { label: 'Tamper Protection', value: '100%' },
    ],
    actions: [
      { label: 'RTO Authority Console', to: '/rto', variant: 'primary' },
      { label: 'Verification Telemetry', to: '/verification', variant: 'outline' },
      { label: 'Transit Corridors', to: '/routes', variant: 'ghost' },
    ],
  },
};

export const TRANSPORT_CHAPTERS = [
  TRANSPORT_REGISTRY.ksrtc,
  TRANSPORT_REGISTRY.metro,
  TRANSPORT_REGISTRY.college,
  TRANSPORT_REGISTRY.rto,
];

