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
  X,
  ChevronDown,
  ChevronUp,
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

  // View Mode: 'focused' (single phase stepper) or 'timeline' (all stages vertical)
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
      tip: "Personal task added to your relocation roadmap.",
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
    <div className="space-y-6 w-full">
      {/* Top Header Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            {onNavigateToDashboard && isStandalonePage && (
              <button
                type="button"
                onClick={onNavigateToDashboard}
                className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-gray-500 hover:text-black mb-1 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </button>
            )}
            
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Germany Master's Relocation Journey</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-gray-900">
              Relocation Journey & Visa Roadmap
            </h1>
            
            <p className="text-sm sm:text-base text-gray-600 max-w-3xl leading-relaxed">
              Step-by-step guidance from APS verification and Uni-Assist VPD to your €11,904 Blocked Account, National Visa (Type D), and City Registration (Anmeldung).
            </p>
          </div>

          {/* Overall Progress Metric Card */}
          <div className="bg-gray-50/80 border border-gray-200 rounded-xl p-4 sm:p-5 min-w-[240px] shrink-0 space-y-2.5">
            <div className="flex items-center justify-between text-xs sm:text-sm font-bold">
              <span className="text-gray-700">Total Completion</span>
              <span className="text-emerald-700 font-extrabold">
                {totalCompletedCount}/{allSubTasks.length} ({totalProgressPercent}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${totalProgressPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500 pt-0.5">
              <span>7 Linear Milestones</span>
              <span>{allSubTasks.length - totalCompletedCount} remaining</span>
            </div>
          </div>
        </div>

        {/* View Mode Toggle Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-gray-100">
          <span className="text-xs sm:text-sm text-gray-500 font-medium">
            Select a stage below to view requirements, required documents, and expert tips
          </span>
          <div className="inline-flex p-1 bg-gray-100 rounded-xl border border-gray-200 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setViewMode("focused")}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
                viewMode === "focused"
                  ? "bg-white text-gray-900 shadow-2xs"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              <ListTodo className="h-4 w-4" />
              <span>Focused Stage</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("timeline")}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all flex items-center space-x-1.5 cursor-pointer ${
                viewMode === "timeline"
                  ? "bg-white text-gray-900 shadow-2xs"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>All Stages Timeline</span>
            </button>
          </div>
        </div>
      </div>

      {/* Connected Milestone Stepper Track */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="relative">
          <div className="overflow-x-auto no-scrollbar pb-2 pt-1">
            <div className="flex items-center min-w-[760px] justify-between relative px-2">
              {/* Background Connective Line */}
              <div className="absolute top-5 left-10 right-10 h-0.5 bg-gray-200 -z-0 pointer-events-none" />

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
                  <div key={phase.id} className="flex-1 flex flex-col items-center relative z-10 group">
                    <button
                      type="button"
                      onClick={() => {
                        setActivePhaseId(phase.id);
                        setViewMode("focused");
                      }}
                      className="flex flex-col items-center cursor-pointer focus:outline-none"
                    >
                      {/* Node Circle */}
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 border-2 ${
                          isCompleted
                            ? "bg-emerald-600 border-emerald-600 text-white shadow-xs group-hover:bg-emerald-700"
                            : isActive
                            ? "bg-gray-950 border-gray-950 text-white ring-4 ring-gray-100 shadow-sm"
                            : "bg-white border-gray-300 text-gray-600 group-hover:border-gray-500 group-hover:text-gray-900"
                        }`}
                      >
                        {isCompleted ? (
                          <Check className="h-4 w-4 stroke-[3]" />
                        ) : (
                          <span>{phase.shortCode}</span>
                        )}
                      </div>

                      {/* Node Title & Task Counter */}
                      <div className="mt-2 text-center">
                        <div
                          className={`text-xs font-semibold tracking-tight transition-colors ${
                            isActive
                              ? "text-gray-950 font-bold"
                              : isCompleted
                              ? "text-emerald-800"
                              : "text-gray-600 group-hover:text-gray-900"
                          }`}
                        >
                          {phase.shortTitle}
                        </div>
                        <div className="text-[11px] text-gray-400 mt-0.5 font-medium">
                          {isCompleted ? (
                            <span className="text-emerald-700 font-semibold">Done</span>
                          ) : (
                            `${phaseDone}/${phaseTasks.length} tasks`
                          )}
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: FOCUSED STAGE */}
      {viewMode === "focused" && (
        <div className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            {/* Active Stage Header */}
            <div className="space-y-3 pb-5 border-b border-gray-100">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-gray-950 text-white">
                    {activePhase.shortCode}
                  </span>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Stage {currentPhaseIndex + 1} of {ROADMAP_PHASES.length}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="text-xs font-medium text-gray-600 flex items-center space-x-1.5 bg-gray-50 border border-gray-200/80 px-2.5 py-1 rounded-md">
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
                      activePhasePercent === 100 ? "bg-emerald-600" : "bg-gray-900"
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

              <div className="space-y-3">
                {activePhaseTasks.map((task) => {
                  const checked = completedStepIds.includes(task.id);
                  const taskDate = taskDates[task.id];
                  const isTipOpen = expandedTipTaskId === task.id;

                  return (
                    <div
                      key={task.id}
                      className={`border rounded-xl p-4 sm:p-5 transition-all duration-200 ${
                        checked
                          ? "bg-gray-50/70 border-gray-200 opacity-80"
                          : "bg-white border-gray-200 hover:border-gray-300 shadow-2xs"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        {/* Checkbox & Task Information */}
                        <div className="flex items-start space-x-3.5 flex-1 min-w-0">
                          <button
                            type="button"
                            onClick={() => toggleSubTask(task.id)}
                            className={`mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                              checked
                                ? "bg-emerald-600 border-emerald-600 text-white"
                                : "border-gray-300 hover:border-gray-500 bg-white"
                            }`}
                            aria-label={checked ? "Mark task as incomplete" : "Mark task as complete"}
                          >
                            {checked && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                          </button>

                          <div className="space-y-1.5 flex-1 min-w-0">
                            <span
                              onClick={() => toggleSubTask(task.id)}
                              className={`text-sm sm:text-base font-semibold block cursor-pointer select-none leading-snug ${
                                checked ? "line-through text-gray-400" : "text-gray-900"
                              }`}
                            >
                              {task.label}
                            </span>

                            {/* Document requirement chip */}
                            {task.docs && (
                              <div className="inline-flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200/80 px-2.5 py-1 rounded-md max-w-full">
                                <FileText className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                                <span className="font-semibold text-gray-700 shrink-0">Required:</span>
                                <span className="truncate">{task.docs}</span>
                              </div>
                            )}

                            {/* Practical Guidance Toggle Button */}
                            {task.tip && (
                              <div className="pt-0.5">
                                <button
                                  type="button"
                                  onClick={() => setExpandedTipTaskId(isTipOpen ? null : task.id)}
                                  className="inline-flex items-center space-x-1.5 text-xs font-medium text-emerald-700 hover:text-emerald-900 transition-colors cursor-pointer"
                                >
                                  <Info className="h-3.5 w-3.5" />
                                  <span>{isTipOpen ? "Hide guidance" : "Official guidance & regulations"}</span>
                                  {isTipOpen ? (
                                    <ChevronUp className="h-3 w-3" />
                                  ) : (
                                    <ChevronDown className="h-3 w-3" />
                                  )}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action controls (Date picker & delete if custom) */}
                        <div className="flex items-center space-x-2 shrink-0">
                          <div className="relative inline-flex items-center">
                            <input
                              type="date"
                              value={taskDate || ""}
                              onChange={(e) => handleSetTaskDate(task.id, e.target.value)}
                              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
                              title={taskDate ? `Target Date: ${taskDate}` : "Set target completion date"}
                            />
                            <div
                              className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                taskDate
                                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold"
                                  : "bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-200"
                              }`}
                            >
                              <Calendar className="h-3.5 w-3.5 text-gray-400" />
                              <span>{taskDate ? formatDisplayDate(taskDate) : "Set Target Date"}</span>
                              {taskDate && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSetTaskDate(task.id, "");
                                  }}
                                  className="relative z-20 hover:text-red-600 ml-0.5 cursor-pointer"
                                  title="Clear date"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                          </div>

                          {task.isCustom && (
                            <button
                              type="button"
                              onClick={() => handleDeleteCustomTask(activePhase.id, task.id)}
                              className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition-colors cursor-pointer"
                              title="Delete custom task"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Expandable Guidance Box */}
                      {isTipOpen && task.tip && (
                        <div className="mt-3.5 p-3.5 sm:p-4 rounded-xl bg-blue-50/70 border border-blue-100/90 text-xs sm:text-sm text-slate-700 space-y-1">
                          <div className="font-semibold text-blue-900 flex items-center space-x-1.5">
                            <Info className="h-4 w-4 text-blue-600 shrink-0" />
                            <span>Practical Advice & Guidelines</span>
                          </div>
                          <p className="text-slate-600 leading-relaxed sm:pl-5.5">{task.tip}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add Custom Task Form */}
              {isAddingCustom ? (
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="text"
                    value={newCustomTaskText}
                    onChange={(e) => setNewCustomTaskText(e.target.value)}
                    placeholder="E.g., Request recommendation letter from Prof. Schmidt..."
                    className="flex-1 px-3.5 py-2.5 border border-gray-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleAddCustomTask();
                      if (e.key === "Escape") setIsAddingCustom(false);
                    }}
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomTask}
                    className="px-4 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs sm:text-sm font-semibold cursor-pointer transition-colors"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAddingCustom(false)}
                    className="px-3.5 py-2.5 text-gray-500 hover:text-black rounded-xl text-xs sm:text-sm font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingCustom(true)}
                  className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-gray-500 hover:text-black px-2.5 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer mt-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add personal task to {activePhase.shortTitle}...</span>
                </button>
              )}
            </div>

            {/* Seamless Native Resource Integration (For Phase 4 & Phase 6) */}
            {activePhase.monetizationType === "blocked_and_forex" && (
              <div className="pt-6 border-t border-gray-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Official Blocked Account Providers & Zero-Fee Forex
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      German Federal Foreign Office approved providers & bank-transfer services:
                    </p>
                  </div>
                  {onNavigateToDeals && (
                    <button
                      type="button"
                      onClick={onNavigateToDeals}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center space-x-1 cursor-pointer self-start sm:self-auto"
                    >
                      <span>Compare All Student Perks</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {PARTNER_LINKS.blockedAccounts.map((p) => (
                    <div
                      key={p.id}
                      className="p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-400 transition-all flex flex-col justify-between gap-3 shadow-2xs"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-gray-900">
                            {p.name}
                          </span>
                          <span className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                            {p.tag}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {p.description}
                        </p>
                      </div>
                      
                      <div className="space-y-3 pt-2 border-t border-gray-100">
                        <div className="text-xs font-semibold text-emerald-700">
                          {p.perk}
                        </div>
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full inline-flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-xs font-bold bg-gray-900 hover:bg-black text-white transition-colors"
                        >
                          <span>Open {p.name}</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Forex Transfer Options */}
                <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-blue-950 flex items-center space-x-2">
                      <CircleDollarSign className="h-4 w-4 text-blue-700" />
                      <span>Zero-Markup Money Transfer (₹10–12 Lakhs)</span>
                    </div>
                    <p className="text-xs text-blue-900/80 leading-relaxed">
                      Transferring the €11,904 blocked amount via Wise avoids high bank telegraphic margins and hidden foreign exchange spreads, saving up to ₹25,000 in fees.
                    </p>
                  </div>
                  <a
                    href={PARTNER_LINKS.forexTransfer[0]?.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-bold inline-flex items-center justify-center space-x-1.5 shrink-0 transition-colors shadow-xs"
                  >
                    <span>Transfer with Wise</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            )}

            {activePhase.monetizationType === "departure_deals" && (
              <div className="pt-6 border-t border-gray-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">
                      Student Travel Discounts, German eSIM & Housing
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Essential relocation partners for international students moving to Germany:
                    </p>
                  </div>
                  {onNavigateToDeals && (
                    <button
                      type="button"
                      onClick={onNavigateToDeals}
                      className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center space-x-1 cursor-pointer self-start sm:self-auto"
                    >
                      <span>All Student Deals</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {/* Flight */}
                  <div className="p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-400 transition-all flex flex-col justify-between gap-3 shadow-2xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900 flex items-center space-x-1.5">
                          <Plane className="h-4 w-4 text-sky-600" />
                          <span>Student Flights</span>
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-sky-50 text-sky-800 border border-sky-200">
                          Extra 40kg Luggage
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        StudentUniverse negotiated student airline fares with Lufthansa, Emirates, and Qatar Airways including 2x23kg checked bags.
                      </p>
                    </div>
                    <a
                      href={(PARTNER_LINKS.flightDeals || PARTNER_LINKS.flights || [])[0]?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-xs font-bold bg-gray-900 hover:bg-black text-white transition-colors mt-2"
                    >
                      <span>Book Student Flight</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  {/* eSIM */}
                  <div className="p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-400 transition-all flex flex-col justify-between gap-3 shadow-2xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900 flex items-center space-x-1.5">
                          <Smartphone className="h-4 w-4 text-purple-600" />
                          <span>Airalo German eSIM</span>
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200">
                          Instant 5G Data
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        Instant digital activation before takeoff; provides high-speed data the moment you touch down in Frankfurt or Munich.
                      </p>
                    </div>
                    <a
                      href={PARTNER_LINKS.simCards[0]?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-xs font-bold bg-gray-900 hover:bg-black text-white transition-colors mt-2"
                    >
                      <span>Get German eSIM</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>

                  {/* Housing */}
                  <div className="p-4 rounded-xl border border-gray-200 bg-white hover:border-gray-400 transition-all flex flex-col justify-between gap-3 shadow-2xs">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-900 flex items-center space-x-1.5">
                          <Home className="h-4 w-4 text-amber-600" />
                          <span>AmberStudent Housing</span>
                        </span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          Anmeldung Eligible
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed">
                        100% verified student private rooms and apartments with official landlord registration confirmation (Wohnungsgeberbescheinigung).
                      </p>
                    </div>
                    <a
                      href={PARTNER_LINKS.housing[0]?.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg text-xs font-bold bg-gray-900 hover:bg-black text-white transition-colors mt-2"
                    >
                      <span>Browse Student Housing</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Step Navigation Bar */}
            <div className="pt-6 border-t border-gray-200 flex items-center justify-between">
              <button
                type="button"
                onClick={goToPrevPhase}
                disabled={currentPhaseIndex === 0}
                className={`inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  currentPhaseIndex === 0
                    ? "opacity-30 cursor-not-allowed text-gray-400"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous Stage</span>
              </button>

              <div className="text-xs sm:text-sm text-gray-500 font-medium hidden sm:inline">
                Stage {currentPhaseIndex + 1} of {ROADMAP_PHASES.length}
              </div>

              <button
                type="button"
                onClick={goToNextPhase}
                disabled={currentPhaseIndex === ROADMAP_PHASES.length - 1}
                className={`inline-flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors cursor-pointer ${
                  currentPhaseIndex === ROADMAP_PHASES.length - 1
                    ? "opacity-30 cursor-not-allowed text-gray-400"
                    : "bg-gray-900 hover:bg-black text-white shadow-xs"
                }`}
              >
                <span>Next: {ROADMAP_PHASES[currentPhaseIndex + 1]?.shortTitle || "Completed"}</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: ALL STAGES TIMELINE */}
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
                    ? "border-gray-950 shadow-xs ring-1 ring-gray-950/10"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
                  <div className="flex items-center space-x-3.5">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold ${
                        isCompleted
                          ? "bg-emerald-600 text-white"
                          : isCurrent
                          ? "bg-gray-950 text-white"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {isCompleted ? <Check className="h-4 w-4 stroke-[3]" /> : phase.shortCode}
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
                <div className="pt-4 space-y-2.5">
                  {phaseTasks.map((task) => {
                    const checked = completedStepIds.includes(task.id);
                    return (
                      <div
                        key={task.id}
                        onClick={() => toggleSubTask(task.id)}
                        className="flex items-center space-x-3 py-1 cursor-pointer select-none group"
                      >
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center shrink-0 transition-colors ${
                            checked
                              ? "bg-emerald-600 border-emerald-600 text-white"
                              : "border-gray-300 group-hover:border-gray-400 bg-white"
                          }`}
                        >
                          {checked && <Check className="h-3 w-3 stroke-[3]" />}
                        </div>
                        <span
                          className={`text-xs sm:text-sm font-medium leading-snug ${
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
