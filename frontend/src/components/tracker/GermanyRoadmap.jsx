import { useState, useEffect } from "react";
import {
  Map,
  CheckCircle2,
  Circle,
  ExternalLink,
  ShieldCheck,
  Landmark,
  FileCheck2,
  GraduationCap,
  PlaneTakeoff,
  Languages,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Plus,
  Trash2,
  CircleDollarSign,
  Plane,
  Smartphone,
  Home,
  Check,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  FileText,
  Clock,
  ListTodo,
  Layers,
  Info,
} from "lucide-react";
import { PARTNER_LINKS } from "../../config/affiliateLinks";

// Backward compatibility export
export const AFFILIATE_PARTNERS = {
  expatrio: PARTNER_LINKS.blockedAccounts[0],
  fintiba: PARTNER_LINKS.blockedAccounts[1],
  coracle: PARTNER_LINKS.blockedAccounts[2],
};

export const ROADMAP_PHASES = [
  {
    id: "p1",
    shortCode: "P1",
    shortTitle: "Prereqs & APS",
    title: "Profile Evaluation, Standardized Tests & APS Certificate",
    timeframe: "10–12 Months Before Intake",
    icon: Languages,
    description:
      "Convert your CGPA to the German Bavarian scale, clear English/German language tests, and apply for mandatory APS verification early.",
    officialLink: {
      label: "Official APS India Portal",
      url: "https://aps-india.de/",
    },
    tasks: [
      {
        id: "p1-1",
        label: "Calculate German Grade using Bavarian Formula (Target < 2.0)",
        docs: "Bachelor Marksheets, Grading scale notification",
        tip: "German universities use a 1.0 (best) to 4.0 scale. Most competitive TU9 programs require 2.0 or better.",
      },
      {
        id: "p1-2",
        label: "Complete IELTS Academic (6.5–7.0+) or TOEFL iBT (90+)",
        docs: "Valid International Passport",
        tip: "Ensure your official TRF scorecard is ready before portals open. Keep scanned digital copies accessible.",
      },
      {
        id: "p1-3",
        label: "Apply for APS Certificate (Mandatory for India/China/Vietnam)",
        docs: "DigiLocker marksheets, Bachelor transcripts, ₹18,000 fee receipt",
        tip: "APS verification takes 4 to 8 weeks. Apply as early as possible because universities require it for admission verification.",
      },
      {
        id: "p1-4",
        label: "Start German Language Fundamentals (A1–A2 level)",
        docs: "Goethe-Institut / Duolingo / Self-study resources",
        tip: "Even for English-taught master's, conversational German is crucial for daily living, visa interviews, and part-time student jobs (Werkstudent).",
      },
      {
        id: "p1-5",
        label: "Take GRE General Test (If targeting RWTH Aachen, TUM, or Saarland CS)",
        docs: "ETS registration, Valid Passport",
        tip: "Review specific course regulations (Prüfungsordnung) to confirm whether a minimum Quantitative score (160+) is required.",
      },
    ],
  },
  {
    id: "p2",
    shortCode: "P2",
    shortTitle: "Docs & VPD",
    title: "Document Dossier, Recommendation Letters & Uni-Assist VPD",
    timeframe: "6–8 Months Before Intake",
    icon: FileCheck2,
    description:
      "Assemble certified academic records, draft German-standard CV and motivation letters, and request your Preliminary Review Documentation (VPD).",
    officialLink: {
      label: "MyAssist (Uni-Assist Portal)",
      url: "https://my.uni-assist.de/",
    },
    tasks: [
      {
        id: "p2-1",
        label: "Draft German-Standard Tabular CV (Europass / Chronological format)",
        docs: "Professional headshot photo, educational timeline without gaps",
        tip: "German academic CVs must be strictly chronological, factual, signed with date, and highlight core research and lab projects.",
      },
      {
        id: "p2-2",
        label: "Write Course-Specific Statements of Purpose / Motivation Letters",
        docs: "Draft SOP referencing course curriculum modules and professors",
        tip: "Avoid generic essays. Connect your bachelor thesis directly to the target program's specialized tracks.",
      },
      {
        id: "p2-3",
        label: "Obtain 2 Academic Recommendation Letters (LORs) & Module Handbook",
        docs: "Official college letterhead, professor institutional email, course syllabus",
        tip: "Having an English syllabus/module handbook is critical for German universities to verify required ECTS subject credits.",
      },
      {
        id: "p2-4",
        label: "Apply for Uni-Assist VPD (Vorprüfungsdokumentation) where required",
        docs: "Transcripts, Degree Certificate, APS Certificate, €75 fee",
        tip: "Uni-Assist verifies foreign academic credentials and converts them into German ECTS. Processing takes 4–6 weeks.",
      },
      {
        id: "p2-5",
        label: "Notarize Certified True Copies of Degree & Transcripts",
        docs: "Original certificates, Government notary or German Embassy attestation",
        tip: "Select universities mandate couriered hardcopies bearing official ink stamps from a registered notary.",
      },
    ],
  },
  {
    id: "p3",
    shortCode: "P3",
    shortTitle: "Applications",
    title: "University Portal Submissions & Admission Offers",
    timeframe: "4–6 Months Before Intake",
    icon: GraduationCap,
    description:
      "Submit applications via direct university portals or Uni-Assist before strict deadlines, complete interviews, and receive admission letters.",
    officialLink: {
      label: "DAAD International Programs Database",
      url: "https://www2.daad.de/deutschland/studienangebote/international-programmes/en/",
    },
    tasks: [
      {
        id: "p3-1",
        label: "Submit online applications before strict deadlines (Winter: Jul 15 / Summer: Jan 15)",
        docs: "VPD, APS Certificate, IELTS scorecard, SOP, CV, Transcripts",
        tip: "Log your application submission numbers and portal logins in UniTracker for easy tracking.",
      },
      {
        id: "p3-2",
        label: "Set 15-day and 10-day automated deadline email alerts in UniTracker",
        docs: "University application IDs",
        tip: "Automated deadline alerts keep you informed if universities request document re-uploads.",
      },
      {
        id: "p3-3",
        label: "Prepare for Technical Admission Interviews & Assessment Tests",
        docs: "Bachelor fundamentals, project slides, code portfolio",
        tip: "Select master's programs conduct 20–30 minute technical video interviews covering math and computer science fundamentals.",
      },
      {
        id: "p3-4",
        label: "Receive Admission Letter (Zulassungsbescheid) & Formally Accept Seat",
        docs: "Official Zulassungsbescheid PDF, signed declaration of acceptance",
        tip: "Once your offer is accepted, immediately initiate Phase 4 (Blocked Account and Health Insurance).",
      },
    ],
  },
  {
    id: "p4",
    shortCode: "P4",
    shortTitle: "Blocked & Forex",
    title: "Blocked Account (€11,904), Forex Transfer & Health Insurance",
    timeframe: "Immediately Upon Receiving Admission Letter",
    icon: Landmark,
    description:
      "Open your mandatory German Blocked Account, transfer ₹10–12 Lakhs at real exchange rates, and secure German statutory health insurance.",
    monetizationType: "blocked_and_forex",
    tasks: [
      {
        id: "p4-1",
        label: "Open official German Blocked Account (€11,904 = €992/month)",
        docs: "Passport copy, Admission Letter (Zulassungsbescheid)",
        tip: "Expatrio, Fintiba, and Coracle are government-approved providers. Digital setup takes ~15 minutes.",
      },
      {
        id: "p4-2",
        label: "Transfer blocked funds via zero-markup foreign exchange (Wise / Remitly)",
        docs: "German Blocked IBAN, PAN card, A2 Form / LRS compliance",
        tip: "Using modern money transfer platforms avoids high bank telegraphic margins and hidden foreign exchange markups (saves up to ₹25,000).",
      },
      {
        id: "p4-3",
        label: "Enroll in German Statutory Health Insurance (TK / DAK) + Travel Insurance",
        docs: "University Admission Letter, Passport",
        tip: "Mandatory for visa and enrollment. Expatrio and Fintiba value packages bundle statutory health cover with free incoming travel insurance.",
      },
      {
        id: "p4-4",
        label: "Download Official 06 Blocked Amount Confirmation (Sperrbestätigung)",
        docs: "06 Confirmation PDF, Health insurance certificate for visa authority",
        tip: "The 06 confirmation document is required by VFS Global and the German Embassy to process your National Student Visa.",
      },
    ],
  },
  {
    id: "p5",
    shortCode: "P5",
    shortTitle: "Student Visa",
    title: "German National Student Visa (Type D) & VFS Appointment",
    timeframe: "2–3 Months Before Departure",
    icon: ShieldCheck,
    description:
      "Book your VFS appointment, assemble your complete document dossier in duplicate, submit biometrics, and receive your visa stamp.",
    officialLink: {
      label: "German Missions Visa Portal",
      url: "https://india.diplo.de/in-en/service/-/2558664",
    },
    tasks: [
      {
        id: "p5-1",
        label: "Book VFS Global / German Embassy Visa Appointment (National Visa Type D)",
        docs: "Passport number, Admission letter, APS verification ID",
        tip: "Visa appointment slots open in waves. Register on the waitlist as soon as your admission letter arrives.",
      },
      {
        id: "p5-2",
        label: "Assemble Official Visa Document Dossier (Original + 2 Complete Photocopy Sets)",
        docs: "Passport, 3 Biometric photos (35x45mm), Zulassungsbescheid, APS Certificate, 06 Blocked confirmation, Health insurance, SOP, CV",
        tip: "Organize the dossier in the exact sequence requested by the German Embassy checklist to prevent appointment delays.",
      },
      {
        id: "p5-3",
        label: "Attend Visa Interview & Submit Biometrics at VFS",
        docs: "Appointment confirmation letter, Visa fee (€75 in local currency), Complete dossier",
        tip: "Be prepared to clearly state why you chose this university, the course curriculum, and your post-study career plans.",
      },
      {
        id: "p5-4",
        label: "Track Visa Dispatch & Verify Stamped National Visa (Type D)",
        docs: "Courier tracking receipt, Stamped Passport",
        tip: "Verify validity dates, spelling of your name, and university remark on your visa sticker as soon as your passport arrives.",
      },
    ],
  },
  {
    id: "p6",
    shortCode: "P6",
    shortTitle: "Pre-Departure",
    title: "Flight Booking (40kg Luggage), German eSIM & Housing Search",
    timeframe: "1 Month Before Departure",
    icon: PlaneTakeoff,
    description:
      "Book student flights with extra baggage allowance, activate your German eSIM before flying, and secure verified initial housing.",
    monetizationType: "departure_deals",
    tasks: [
      {
        id: "p6-1",
        label: "Book Student Flight with Extra 40kg Baggage Allowance (StudentUniverse)",
        docs: "Stamped Visa, Student Admit Card / ISIC Card",
        tip: "Student flight bookings include an extra 10–15kg checked-in luggage allowance (often 2x23kg), saving hundreds on excess baggage fees.",
      },
      {
        id: "p6-2",
        label: "Activate German eSIM for Instant 5G Data Upon Landing (Airalo / Fraenk)",
        docs: "Unlocked smartphone supporting eSIM",
        tip: "Having mobile internet the second you land at Frankfurt or Munich airport lets you navigate trains (DB Navigator), call family, and order taxis.",
      },
      {
        id: "p6-3",
        label: "Secure Accommodation with Landlord Confirmation (Wohnungsgeberbescheinigung)",
        docs: "Rental agreement, AmberStudent / WG-Gesucht / Studentenwerk dorm offer",
        tip: "Ensure the landlord explicitly issues a Wohnungsgeberbescheinigung, as you cannot complete city registration (Anmeldung) without it.",
      },
      {
        id: "p6-4",
        label: "Pack Critical Documents & European Power Adapters",
        docs: "Notarized transcripts, original degree, APS, 10 passport photos, cash in Euros (€500–€1000 for initial days)",
        tip: "Always carry all original documents, medical prescriptions, and laptops in your cabin carry-on bag, never in checked luggage.",
      },
    ],
  },
  {
    id: "p7",
    shortCode: "P7",
    shortTitle: "First 30 Days",
    title: "Arrival, City Registration (Anmeldung) & Bank Account Activation",
    timeframe: "First 30 Days After Landing in Germany",
    icon: Home,
    description:
      "Complete your official address registration, activate your monthly blocked account payouts, complete matriculation, and get your residence permit.",
    tasks: [
      {
        id: "p7-1",
        label: "Complete City Registration (Anmeldung) at the local Bürgeramt (Within 14 Days)",
        docs: "Passport, Wohnungsgeberbescheinigung (Landlord form), Registration form (Anmeldeformular)",
        tip: "Anmeldung is the most important legal step in Germany. You will receive your Meldebestätigung and Tax ID (Steuer-ID) in the mail.",
      },
      {
        id: "p7-2",
        label: "Open German Current Account (Girokonto - N26 / Revolut / Sparkasse)",
        docs: "Passport, Meldebestätigung (City registration proof), Student enrollment certificate",
        tip: "You need a German checking account IBAN to activate your blocked account and set up direct debits for rent and health insurance.",
      },
      {
        id: "p7-3",
        label: "Activate Blocked Account Payouts (€992/month)",
        docs: "German IBAN, Stamped Visa, Meldebestätigung",
        tip: "Upload your German IBAN into Expatrio / Fintiba to begin automated monthly transfers to your daily checking account.",
      },
      {
        id: "p7-4",
        label: "Complete In-Person University Matriculation (Immatrikulation) & Collect Semester Ticket",
        docs: "Admission letter, Health insurance transmission certificate (M10), Fee payment receipt",
        tip: "Collect your student ID card and Deutschlandticket / Semesterticket for unlimited regional trains, buses, and trams.",
      },
      {
        id: "p7-5",
        label: "Apply for Long-Term Student Residence Permit (Aufenthaltstitel) at Ausländerbehörde",
        docs: "Passport, Immatrikulationsbescheinigung, Blocked account statement, Meldebestätigung, Biometric photo",
        tip: "Apply 6–8 weeks before your 6-month entry Type D visa expires to convert it into a 1–2 year electronic residence card (eAT).",
      },
    ],
  },
];

const ROADMAP_STORAGE_KEY = "unitracker_germany_roadmap_v1";
const ROADMAP_CUSTOM_TASKS_KEY = "unitracker_germany_roadmap_custom_tasks_v1";
const ROADMAP_DATES_KEY = "unitracker_germany_roadmap_dates_v1";
const ROADMAP_ACTIVE_PHASE_KEY = "unitracker_germany_roadmap_active_phase_v2";

const formatDisplayDate = (dateStr) => {
  if (!dateStr) return "";
  try {
    const [yyyy, mm, dd] = dateStr.split("-");
    const d = new Date(parseInt(yyyy, 10), parseInt(mm, 10) - 1, parseInt(dd, 10));
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
};

export default function GermanyRoadmap({
  onNavigateToDeals,
  onNavigateToDashboard,
  initialPhaseId,
  isStandalonePage = false,
}) {
  const [completedStepIds, setCompletedStepIds] = useState(() => {
    try {
      const saved = localStorage.getItem(ROADMAP_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customTasks, setCustomTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(ROADMAP_CUSTOM_TASKS_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [taskDates, setTaskDates] = useState(() => {
    try {
      const saved = localStorage.getItem(ROADMAP_DATES_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Active Phase selection (Defaults to P1 or stored, or initialPhaseId)
  const [activePhaseId, setActivePhaseId] = useState(() => {
    if (initialPhaseId && ROADMAP_PHASES.some((p) => p.id === initialPhaseId)) {
      return initialPhaseId;
    }
    try {
      const saved = localStorage.getItem(ROADMAP_ACTIVE_PHASE_KEY);
      if (saved && ROADMAP_PHASES.some((p) => p.id === saved)) {
        return saved;
      }
    } catch {}
    return "p1";
  });

  // View Mode: 'focused' (single phase stepper, like VisaFlow) or 'timeline' (all stages vertical)
  const [viewMode, setViewMode] = useState("focused");
  const [expandedTipTaskId, setExpandedTipTaskId] = useState(null);
  const [newCustomTaskText, setNewCustomTaskText] = useState("");
  const [isAddingCustom, setIsAddingCustom] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(completedStepIds));
    } catch {}
  }, [completedStepIds]);

  useEffect(() => {
    try {
      localStorage.setItem(ROADMAP_CUSTOM_TASKS_KEY, JSON.stringify(customTasks));
    } catch {}
  }, [customTasks]);

  useEffect(() => {
    try {
      localStorage.setItem(ROADMAP_DATES_KEY, JSON.stringify(taskDates));
    } catch {}
  }, [taskDates]);

  useEffect(() => {
    try {
      localStorage.setItem(ROADMAP_ACTIVE_PHASE_KEY, activePhaseId);
    } catch {}
  }, [activePhaseId]);

  // Overall statistics
  const allSubTasks = ROADMAP_PHASES.flatMap((s) => [
    ...s.tasks,
    ...(customTasks[s.id] || []),
  ]);
  const totalCompletedCount = allSubTasks.filter((t) =>
    completedStepIds.includes(t.id)
  ).length;
  const totalProgressPercent =
    allSubTasks.length > 0
      ? Math.round((totalCompletedCount / allSubTasks.length) * 100)
      : 0;

  const currentPhaseIndex = ROADMAP_PHASES.findIndex((p) => p.id === activePhaseId);
  const activePhase = ROADMAP_PHASES[currentPhaseIndex] || ROADMAP_PHASES[0];

  const activePhaseTasks = [
    ...activePhase.tasks,
    ...(customTasks[activePhase.id] || []),
  ];
  const activePhaseDoneCount = activePhaseTasks.filter((t) =>
    completedStepIds.includes(t.id)
  ).length;
  const activePhasePercent =
    activePhaseTasks.length > 0
      ? Math.round((activePhaseDoneCount / activePhaseTasks.length) * 100)
      : 0;

  const toggleSubTask = (taskId) => {
    setCompletedStepIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSetTaskDate = (taskId, dateStr) => {
    setTaskDates((prev) => {
      if (!dateStr) {
        const next = { ...prev };
        delete next[taskId];
        return next;
      }
      return { ...prev, [taskId]: dateStr };
    });
  };

  const handleAddCustomTask = () => {
    if (!newCustomTaskText.trim()) return;
    const newTask = {
      id: `custom-${crypto.randomUUID()}`,
      label: newCustomTaskText.trim(),
      isCustom: true,
      tip: "Custom task added to your personal roadmap.",
    };
    setCustomTasks((prev) => ({
      ...prev,
      [activePhase.id]: [...(prev[activePhase.id] || []), newTask],
    }));
    setNewCustomTaskText("");
    setIsAddingCustom(false);
  };

  const handleDeleteCustomTask = (phaseId, taskId) => {
    setCustomTasks((prev) => ({
      ...prev,
      [phaseId]: (prev[phaseId] || []).filter((t) => t.id !== taskId),
    }));
    setCompletedStepIds((prev) => prev.filter((id) => id !== taskId));
    setTaskDates((prev) => {
      const next = { ...prev };
      delete next[taskId];
      return next;
    });
  };

  const goToPrevPhase = () => {
    if (currentPhaseIndex > 0) {
      setActivePhaseId(ROADMAP_PHASES[currentPhaseIndex - 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goToNextPhase = () => {
    if (currentPhaseIndex < ROADMAP_PHASES.length - 1) {
      setActivePhaseId(ROADMAP_PHASES[currentPhaseIndex + 1].id);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            {onNavigateToDashboard && isStandalonePage && (
              <button
                type="button"
                onClick={onNavigateToDashboard}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-500 hover:text-black mb-2 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back to Dashboard</span>
              </button>
            )}
            <div className="inline-flex items-center space-x-2 text-xs font-semibold text-gray-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Germany Master's Relocation Journey</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
              Step-by-Step Relocation Journey & Visa Checklist
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 max-w-2xl leading-relaxed">
              Navigate the strict linear timeline from APS & Uni-Assist VPD to your €11,904 Blocked Account, National Visa (Type D), and City Registration (Anmeldung).
            </p>
          </div>

          {/* Overall Progress Tracker Pill */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3.5 min-w-[200px] shrink-0 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-gray-600">Total Progress</span>
              <span className="text-emerald-700">
                {totalCompletedCount}/{allSubTasks.length} ({totalProgressPercent}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${totalProgressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-gray-500 pt-0.5">
              <span>7 Linear Stages</span>
              <span>{allSubTasks.length - totalCompletedCount} remaining</span>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 text-xs">
          <span className="text-gray-500 hidden sm:inline">
            Select a phase below to inspect requirements & guidance
          </span>
          <div className="inline-flex p-1 bg-gray-100 rounded-xl border border-gray-200">
            <button
              type="button"
              onClick={() => setViewMode("focused")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
                viewMode === "focused"
                  ? "bg-white text-black shadow-2xs"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              <ListTodo className="h-3.5 w-3.5" />
              <span>Focused Stage</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("timeline")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
                viewMode === "timeline"
                  ? "bg-white text-black shadow-2xs"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>All Stages Timeline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Horizontal Stage Stepper Bar (VisaFlow / SaaS Style) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-2.5 shadow-xs overflow-x-auto no-scrollbar">
        <div className="flex items-center gap-1.5 min-w-max">
          {ROADMAP_PHASES.map((phase, idx) => {
            const phaseTasks = [
              ...phase.tasks,
              ...(customTasks[phase.id] || []),
            ];
            const phaseDone = phaseTasks.filter((t) =>
              completedStepIds.includes(t.id)
            ).length;
            const isCompleted = phaseTasks.length > 0 && phaseDone === phaseTasks.length;
            const isActive = activePhaseId === phase.id && viewMode === "focused";

            return (
              <button
                key={phase.id}
                type="button"
                onClick={() => {
                  setActivePhaseId(phase.id);
                  setViewMode("focused");
                }}
                className={`flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  isActive
                    ? "bg-black text-white border-black shadow-xs ring-2 ring-black/10"
                    : isCompleted
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/70"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-black"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    isActive
                      ? "bg-white text-black"
                      : isCompleted
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {isCompleted ? <Check className="h-3 w-3 stroke-[3]" /> : phase.shortCode}
                </div>
                <div className="text-left">
                  <div className="leading-tight">{phase.shortTitle}</div>
                  <div
                    className={`text-[10px] font-normal ${
                      isActive ? "text-gray-300" : "text-gray-400"
                    }`}
                  >
                    {phaseDone}/{phaseTasks.length} tasks
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW MODE 1: FOCUSED STAGE (VisaFlow P1-P7 Style) */}
      {viewMode === "focused" && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            {/* Active Stage Header */}
            <div className="space-y-3 pb-5 border-b border-gray-100">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-gray-900 text-white">
                    {activePhase.shortCode}
                  </span>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Phase {currentPhaseIndex + 1} of {ROADMAP_PHASES.length}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs font-medium text-gray-500 flex items-center space-x-1">
                    <Clock className="h-3.5 w-3.5 text-gray-400" />
                    <span>{activePhase.timeframe}</span>
                  </span>
                </div>

                {activePhase.officialLink && (
                  <a
                    href={activePhase.officialLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-700 hover:text-black bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <span>{activePhase.officialLink.label}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  {activePhase.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                  {activePhase.description}
                </p>
              </div>

              {/* Phase Progress Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-gray-600">Stage Readiness</span>
                  <span className={activePhasePercent === 100 ? "text-emerald-700 font-bold" : "text-gray-900"}>
                    {activePhaseDoneCount} of {activePhaseTasks.length} tasks completed ({activePhasePercent}%)
                  </span>
                </div>
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      activePhasePercent === 100 ? "bg-emerald-600" : "bg-black"
                    }`}
                    style={{ width: `${activePhasePercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Checklist Tasks */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Required Action Checklist
                </h3>
                <span className="text-xs text-gray-400">
                  Click to mark complete • Set target dates
                </span>
              </div>

              <div className="space-y-2.5">
                {activePhaseTasks.map((task) => {
                  const checked = completedStepIds.includes(task.id);
                  const taskDate = taskDates[task.id];
                  const isTipOpen = expandedTipTaskId === task.id;

                  return (
                    <div
                      key={task.id}
                      className={`border rounded-xl p-4 transition-all ${
                        checked
                          ? "bg-gray-50/70 border-gray-200 opacity-90"
                          : "bg-white border-gray-200 hover:border-gray-300 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        {/* Checkbox & Task Name */}
                        <div className="flex items-start space-x-3 flex-1 min-w-0">
                          <button
                            type="button"
                            onClick={() => toggleSubTask(task.id)}
                            className="mt-0.5 shrink-0 text-gray-400 hover:text-black transition-colors cursor-pointer"
                          >
                            {checked ? (
                              <CheckCircle2 className="h-5 w-5 text-emerald-600 fill-emerald-50" />
                            ) : (
                              <Circle className="h-5 w-5 text-gray-300 hover:text-gray-400" />
                            )}
                          </button>

                          <div className="space-y-1 flex-1 min-w-0">
                            <span
                              onClick={() => toggleSubTask(task.id)}
                              className={`text-sm font-semibold block cursor-pointer select-none leading-snug ${
                                checked ? "line-through text-gray-400" : "text-gray-900"
                              }`}
                            >
                              {task.label}
                            </span>

                            {/* Required Documents Pill */}
                            {task.docs && (
                              <div className="flex items-center space-x-1.5 text-[11px] text-gray-500 pt-0.5">
                                <FileText className="h-3 w-3 text-gray-400 shrink-0" />
                                <span className="font-medium text-gray-700">Documents:</span>
                                <span className="truncate">{task.docs}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions (Target Date & Delete if custom) */}
                        <div className="flex items-center space-x-2 shrink-0">
                          {/* Calendar Date Picker */}
                          <div className="relative inline-flex items-center">
                            <input
                              type="date"
                              value={taskDate || ""}
                              onChange={(e) => handleSetTaskDate(task.id, e.target.value)}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                              title={taskDate ? `Date: ${taskDate}` : "Set target completion date"}
                            />
                            <div
                              className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                                taskDate
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                  : "bg-gray-50 hover:bg-gray-100 text-gray-500 border border-gray-200"
                              }`}
                            >
                              <Calendar className="h-3 w-3 text-gray-400" />
                              <span>{taskDate ? formatDisplayDate(taskDate) : "Set Date"}</span>
                            </div>
                          </div>

                          {/* Guidance Dropdown Toggle */}
                          {task.tip && (
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedTipTaskId(isTipOpen ? null : task.id)
                              }
                              className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                                isTipOpen
                                  ? "bg-gray-100 text-black border-gray-300"
                                  : "text-gray-400 hover:text-black border-transparent hover:bg-gray-50"
                              }`}
                              title="View official guidance & tips"
                            >
                              <Info className="h-3.5 w-3.5" />
                            </button>
                          )}

                          {/* Delete custom task */}
                          {task.isCustom && (
                            <button
                              type="button"
                              onClick={() => handleDeleteCustomTask(activePhase.id, task.id)}
                              className="text-gray-400 hover:text-red-600 p-1 rounded-md transition-colors cursor-pointer"
                              title="Delete task"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Expandable Tip / Guidance */}
                      {isTipOpen && task.tip && (
                        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600 leading-relaxed bg-gray-50/80 -mx-4 -mb-4 p-3.5 rounded-b-xl space-y-1">
                          <div className="font-semibold text-gray-800 flex items-center space-x-1">
                            <Info className="h-3 w-3 text-blue-600" />
                            <span>Practical Guidance & Regulations:</span>
                          </div>
                          <p>{task.tip}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add Custom Task Input */}
              {isAddingCustom ? (
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="text"
                    value={newCustomTaskText}
                    onChange={(e) => setNewCustomTaskText(e.target.value)}
                    placeholder="E.g., Follow up with Professor Schmidt for LOR..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-black"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddCustomTask();
                      if (e.key === "Escape") setIsAddingCustom(false);
                    }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTask}
                    className="px-3.5 py-2 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCustom(false)}
                    className="px-3 py-2 text-gray-500 hover:text-black rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingCustom(true)}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-500 hover:text-black px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer mt-1"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add personal task to {activePhase.shortCode}...</span>
                </button>
              )}
            </div>

            {/* Seamless Native Resource Integration (For Phase 4 & Phase 6) */}
            {activePhase.monetizationType === "blocked_and_forex" && (
              <div className="pt-6 border-t border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                      Approved Blocked Account Providers & Zero-Fee Forex
                    </h3>
                    <p className="text-xs text-gray-500">
                      Official Federal Foreign Office approved providers & bank-transfer services:
                    </p>
                  </div>
                  {onNavigateToDeals && (
                    <button
                      type="button"
                      onClick={onNavigateToDeals}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1 cursor-pointer"
                    >
                      <span>Compare All Perks</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {PARTNER_LINKS.blockedAccounts.map((p) => (
                    <a
                      key={p.id}
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-black transition-all flex flex-col justify-between gap-3 group"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-gray-900 group-hover:underline">
                            {p.name}
                          </span>
                          <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-black" />
                        </div>
                        <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          {p.tag}
                        </span>
                        <p className="text-[11px] text-gray-500 leading-snug">
                          {p.description}
                        </p>
                      </div>
                      <div className="text-[11px] font-bold text-emerald-700 pt-1 border-t border-gray-100">
                        {p.perk}
                      </div>
                    </a>
                  ))}
                </div>

                {/* Forex Transfer Options */}
                <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-blue-900 flex items-center space-x-1.5">
                      <CircleDollarSign className="h-3.5 w-3.5 text-blue-700" />
                      <span>Zero-Markup Money Transfer (₹10–12 Lakhs)</span>
                    </div>
                    <p className="text-xs text-blue-800/80">
                      Transferring blocked amount via Wise or Remitly avoids traditional bank telegraphic markup (saves up to ₹25,000).
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <a
                      href={PARTNER_LINKS.forexTransfer[0]?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-black hover:bg-gray-800 text-white rounded-lg text-xs font-bold inline-flex items-center space-x-1 transition-all"
                    >
                      <span>Transfer with Wise</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {activePhase.monetizationType === "departure_deals" && (
              <div className="pt-6 border-t border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
                      Student Travel Discounts, German eSIM & Housing
                    </h3>
                    <p className="text-xs text-gray-500">
                      Essential relocation partners for international students moving to Germany:
                    </p>
                  </div>
                  {onNavigateToDeals && (
                    <button
                      type="button"
                      onClick={onNavigateToDeals}
                      className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center space-x-1 cursor-pointer"
                    >
                      <span>All Student Deals</span>
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Flight */}
                  <a
                    href={(PARTNER_LINKS.flightDeals || PARTNER_LINKS.flights || [])[0]?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-black transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900 flex items-center space-x-1.5">
                          <Plane className="h-3 w-3 text-sky-600" />
                          <span>Student Flights</span>
                        </span>
                        <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-black" />
                      </div>
                      <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                        Extra 40kg Luggage
                      </span>
                      <p className="text-[11px] text-gray-500 leading-snug">
                        StudentUniverse negotiated fares with Lufthansa, Emirates, and Qatar Airways.
                      </p>
                    </div>
                  </a>

                  {/* eSIM */}
                  <a
                    href={PARTNER_LINKS.simCards[0]?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-black transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900 flex items-center space-x-1.5">
                          <Smartphone className="h-3 w-3 text-purple-600" />
                          <span>Airalo German eSIM</span>
                        </span>
                        <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-black" />
                      </div>
                      <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                        Instant 5G on Landing
                      </span>
                      <p className="text-[11px] text-gray-500 leading-snug">
                        Instant digital activation before takeoff; zero physical SIM swapping.
                      </p>
                    </div>
                  </a>

                  {/* Housing */}
                  <a
                    href={PARTNER_LINKS.housing[0]?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3.5 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-black transition-all flex flex-col justify-between gap-3 group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-900 flex items-center space-x-1.5">
                          <Home className="h-3 w-3 text-amber-600" />
                          <span>AmberStudent Housing</span>
                        </span>
                        <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-black" />
                      </div>
                      <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                        Anmeldung Eligible
                      </span>
                      <p className="text-[11px] text-gray-500 leading-snug">
                        100% verified student private rooms and studios with landlord registration proof.
                      </p>
                    </div>
                  </a>
                </div>
              </div>
            )}

            {/* Bottom Step Navigation Bar */}
            <div className="pt-6 border-t border-gray-200 flex items-center justify-between">
              <button
                type="button"
                onClick={goToPrevPhase}
                disabled={currentPhaseIndex === 0}
                className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  currentPhaseIndex === 0
                    ? "opacity-30 cursor-not-allowed text-gray-400"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous Phase</span>
              </button>

              <div className="text-xs text-gray-400 font-medium hidden sm:inline">
                Phase {currentPhaseIndex + 1} of {ROADMAP_PHASES.length}
              </div>

              <button
                type="button"
                onClick={goToNextPhase}
                disabled={currentPhaseIndex === ROADMAP_PHASES.length - 1}
                className={`inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                  currentPhaseIndex === ROADMAP_PHASES.length - 1
                    ? "opacity-30 cursor-not-allowed text-gray-400"
                    : "bg-black hover:bg-gray-800 text-white shadow-xs"
                }`}
              >
                <span>Next: {ROADMAP_PHASES[currentPhaseIndex + 1]?.shortTitle || "Completed"}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: ALL STAGES VERTICAL TIMELINE */}
      {viewMode === "timeline" && (
        <div className="space-y-4">
          {ROADMAP_PHASES.map((phase, idx) => {
            const phaseTasks = [
              ...phase.tasks,
              ...(customTasks[phase.id] || []),
            ];
            const phaseDone = phaseTasks.filter((t) =>
              completedStepIds.includes(t.id)
            ).length;
            const isCompleted = phaseTasks.length > 0 && phaseDone === phaseTasks.length;
            const isCurrent = activePhaseId === phase.id;

            return (
              <div
                key={phase.id}
                className={`bg-white border rounded-2xl p-5 sm:p-6 transition-all ${
                  isCurrent
                    ? "border-black shadow-xs ring-1 ring-black/10"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                        isCompleted
                          ? "bg-emerald-600 text-white"
                          : isCurrent
                          ? "bg-black text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {isCompleted ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : phase.shortCode}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                        {phase.timeframe}
                      </div>
                      <h3 className="text-base font-bold text-gray-900">
                        {phase.title}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                        isCompleted
                          ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                          : "bg-gray-50 text-gray-700 border-gray-200"
                      }`}
                    >
                      {phaseDone}/{phaseTasks.length} tasks
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setActivePhaseId(phase.id);
                        setViewMode("focused");
                      }}
                      className="text-xs font-bold text-gray-900 hover:text-black underline cursor-pointer"
                    >
                      Open Stage Focus →
                    </button>
                  </div>
                </div>

                {/* Tasks List */}
                <div className="pt-4 space-y-2">
                  {phaseTasks.map((task) => {
                    const checked = completedStepIds.includes(task.id);
                    return (
                      <div
                        key={task.id}
                        onClick={() => toggleSubTask(task.id)}
                        className="flex items-center space-x-3 py-1 cursor-pointer select-none group"
                      >
                        {checked ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-gray-300 group-hover:text-gray-400 shrink-0" />
                        )}
                        <span
                          className={`text-xs font-medium leading-snug ${
                            checked ? "line-through text-gray-400" : "text-gray-800"
                          }`}
                        >
                          {task.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
