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
  ChevronDown,
  ChevronUp,
  Sparkles,
  BadgeEuro,
} from "lucide-react";

// Replace these URLs with your approved Partner/Affiliate tracking links
export const AFFILIATE_PARTNERS = {
  expatrio: {
    name: "Expatrio Value Package",
    tag: "Most Popular • Free ISIC Card",
    description:
      "Federal Foreign Office approved Blocked Account (€992/mo) + TK Public Health Insurance + Free Travel Insurance.",
    cta: "Open Expatrio Blocked Account",
    url: "https://www.expatrio.com/xp-value-package?utm_source=unitracker.live&utm_medium=affiliate",
    badgeColor: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  fintiba: {
    name: "Fintiba Plus Package",
    tag: "Instant Sutor Bank Account",
    description:
      "Official German Blocked Account with instant visa confirmation document + DAK/MAWISTA statutory health cover.",
    cta: "Compare Fintiba Plus",
    url: "https://www.fintiba.com/fintiba-plus/?utm_source=unitracker.live&utm_medium=affiliate",
    badgeColor: "bg-blue-50 text-blue-800 border-blue-200",
  },
  coracle: {
    name: "Coracle Prime",
    tag: "Lowest Setup Fee (€59)",
    description:
      "No monthly maintenance fee Blocked Account + free incoming travel insurance & public health insurance.",
    cta: "Explore Coracle Prime",
    url: "https://www.coracle.de/prime?utm_source=unitracker.live&utm_medium=affiliate",
    badgeColor: "bg-purple-50 text-purple-800 border-purple-200",
  },
};

const ROADMAP_STEPS = [
  {
    id: "phase-1",
    phase: "Phase 1 • 10–12 Months Before Intake",
    title: "Profile Evaluation, Language & Standardized Tests",
    icon: Languages,
    description:
      "Convert your CGPA to the German Bavarian Formula grade, finalize IELTS/TOEFL (6.5–7.0+), and start foundational German (A1–B1).",
    tasks: [
      { id: "p1-1", label: "Book & complete IELTS Academic / TOEFL iBT" },
      { id: "p1-2", label: "Take GRE (if targeting RWTH Aachen, TU Munich, or Saarland CS)" },
      { id: "p1-3", label: "Start German A1–A2 for daily life & part-time job readiness" },
    ],
    officialLink: {
      label: "DAAD International Programmes Database",
      url: "https://www2.daad.de/deutschland/studienangebote/international-programmes/en/",
    },
  },
  {
    id: "phase-2",
    phase: "Phase 2 • 7–9 Months Before Intake",
    title: "APS Certificate & Document Notarization",
    icon: FileCheck2,
    description:
      "Mandatory for Indian & select international applicants: apply for your Academic Evaluation Centre (APS) certificate before application portals open.",
    tasks: [
      { id: "p2-1", label: "Register online at APS India portal & pay ₹18,000 verification fee" },
      { id: "p2-2", label: "Courier Class 10/12 marksheets, bachelor transcripts, and degree/bonafide" },
      { id: "p2-3", label: "Ensure DigiLocker credentials & professor institutional email are ready" },
    ],
    officialLink: {
      label: "Official APS India Portal",
      url: "https://aps-india.de/",
    },
  },
  {
    id: "phase-3",
    phase: "Phase 3 • 5–7 Months Before Intake",
    title: "University Shortlisting & Uni-Assist VPD",
    icon: GraduationCap,
    description:
      "Shortlist 8–12 public universities across High/Medium/Safe tiers. Apply early for Uni-Assist VPD as processing takes 4–6 weeks.",
    tasks: [
      { id: "p3-1", label: "Shortlist programs in UniTracker & verify ECTS subject requirements" },
      { id: "p3-2", label: "Submit VPD applications on Uni-Assist (€75 first + €30 per additional)" },
      { id: "p3-3", label: "Draft German Tabular CV & course-specific Letters of Motivation (LOM)" },
    ],
    officialLink: {
      label: "MyAssist (Uni-Assist Portal)",
      url: "https://my.uni-assist.de/",
    },
  },
  {
    id: "phase-4",
    phase: "Phase 4 • Winter (Apr–Jul 15) / Summer (Oct–Jan 15)",
    title: "Direct Portal Submissions & Automated Alerts",
    icon: Sparkles,
    description:
      "Upload your received VPD, APS certificate, and SOPs directly to university portals before strict deadlines.",
    tasks: [
      { id: "p4-1", label: "Set 15-day & 10-day email alerts on all cards in UniTracker" },
      { id: "p4-2", label: "Submit applications on university portals & courier hardcopies if required" },
      { id: "p4-3", label: "Prepare for technical admission interviews / online assessments" },
    ],
  },
  {
    id: "phase-5",
    phase: "Phase 5 • Immediately Upon Admission Offer",
    title: "Blocked Account (€11,904) & German Health Insurance",
    icon: Landmark,
    isMonetized: true,
    description:
      "To secure your German National Student Visa and enroll at your university, you must open a Blocked Account (€992/month = €11,904/year) and statutory health insurance.",
    tasks: [
      { id: "p5-1", label: "Open German Blocked Account & transfer €11,904 + buffer fees" },
      { id: "p5-2", label: "Obtain German Statutory Health Insurance (TK / DAK / AOK) + Travel Insurance" },
      { id: "p5-3", label: "Download 06 Blocked Amount Confirmation & Insurance Certificate for Visa" },
    ],
  },
  {
    id: "phase-6",
    phase: "Phase 6 • 2–3 Months Before Departure",
    title: "German Student Visa, Accommodation & Semester Enrolment",
    icon: PlaneTakeoff,
    description:
      "Book your VFS / German Consulate appointment, pay your Semesterbeitrag (€150–€350), and apply for Studierendenwerk dorms.",
    tasks: [
      { id: "p6-1", label: "Book VFS Global visa appointment with APS, Admit Letter & Blocked Account proof" },
      { id: "p6-2", label: "Apply for Studierendenwerk student dorms & WG-Gesucht rooms" },
      { id: "p6-3", label: "Pay Semester Contribution & complete city registration (Anmeldung) on arrival" },
    ],
  },
];

const ROADMAP_STORAGE_KEY = "unitracker_germany_roadmap_v1";

export default function GermanyRoadmap() {
  const [completedStepIds, setCompletedStepIds] = useState(() => {
    try {
      const saved = localStorage.getItem(ROADMAP_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    try {
      localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(completedStepIds));
    } catch {
      // ignore storage errors
    }
  }, [completedStepIds]);

  const allSubTasks = ROADMAP_STEPS.flatMap((s) => s.tasks);
  const completedCount = allSubTasks.filter((t) =>
    completedStepIds.includes(t.id)
  ).length;
  const progressPercent = Math.round(
    (completedCount / allSubTasks.length) * 100
  );

  const toggleSubTask = (taskId) => {
    setCompletedStepIds((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-8">
      {/* Header Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-white/10 text-emerald-300 text-xs font-semibold">
            <Map className="h-3.5 w-3.5" />
            <span>Interactive Step-by-Step Guide</span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Germany Master’s Roadmap & Relocation Checklist
          </h2>
          <p className="text-xs text-gray-300 max-w-2xl">
            Track your end-to-end journey from APS & Uni-Assist VPD to your Blocked Account and German Student Visa.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-xs text-gray-300 font-medium">
              Overall Readiness
            </div>
            <div className="text-lg font-extrabold text-emerald-400">
              {completedCount}/{allSubTasks.length} Steps ({progressPercent}%)
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <span>{isOpen ? "Hide Roadmap" : "Open Roadmap"}</span>
            {isOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-800 h-1.5">
        <div
          className="bg-emerald-400 h-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {isOpen && (
        <div className="p-5 sm:p-6 space-y-6">
          {/* Quick Partner Perks Strip (Always visible inside Roadmap) */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="h-4 w-4 text-emerald-700" />
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                  Official German Visa Requirement • Blocked Account & Health Insurance
                </span>
              </div>
              <p className="text-xs text-gray-700">
                Need your <strong>€11,904 Blocked Account</strong> (€992/mo) and mandatory <strong>German Public Health Insurance (TK/DAK)</strong>? Compare student value packages with free travel insurance below:
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {Object.entries(AFFILIATE_PARTNERS).map(([key, partner]) => (
                <a
                  key={key}
                  href={partner.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-bold bg-black text-white hover:bg-gray-800 transition-all shadow-2xs"
                >
                  <BadgeEuro className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{partner.name}</span>
                  <ExternalLink className="h-3 w-3 opacity-80" />
                </a>
              ))}
            </div>
          </div>

          {/* 6-Phase Timeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ROADMAP_STEPS.map((step) => {
              const IconComponent = step.icon;
              const stepDoneCount = step.tasks.filter((t) =>
                completedStepIds.includes(t.id)
              ).length;
              const isPhaseComplete = stepDoneCount === step.tasks.length;

              return (
                <div
                  key={step.id}
                  className={`border rounded-xl p-4 transition-all flex flex-col justify-between ${
                    step.isMonetized
                      ? "border-emerald-300 bg-emerald-50/20 ring-1 ring-emerald-500/20"
                      : isPhaseComplete
                      ? "border-emerald-200 bg-emerald-50/10"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-2.5">
                        <div
                          className={`p-2 rounded-lg ${
                            isPhaseComplete
                              ? "bg-emerald-600 text-white"
                              : "bg-gray-900 text-white"
                          }`}
                        >
                          <IconComponent className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                            {step.phase}
                          </div>
                          <h3 className="text-sm font-bold text-gray-900">
                            {step.title}
                          </h3>
                        </div>
                      </div>

                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                          isPhaseComplete
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-gray-50 text-gray-600 border-gray-200"
                        }`}
                      >
                        {stepDoneCount}/{step.tasks.length}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Checklist items for this phase */}
                    <div className="space-y-1.5 pt-1">
                      {step.tasks.map((task) => {
                        const checked = completedStepIds.includes(task.id);
                        return (
                          <button
                            key={task.id}
                            type="button"
                            onClick={() => toggleSubTask(task.id)}
                            className="w-full text-left flex items-start space-x-2 p-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                          >
                            {checked ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                            ) : (
                              <Circle className="h-4 w-4 text-gray-300 shrink-0 mt-0.5" />
                            )}
                            <span
                              className={`text-xs font-medium ${
                                checked
                                  ? "line-through text-gray-400"
                                  : "text-gray-800"
                              }`}
                            >
                              {task.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Footer Link or Partner Cards */}
                  {step.officialLink && (
                    <div className="pt-3 mt-3 border-t border-gray-100">
                      <a
                        href={step.officialLink.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-xs font-semibold text-gray-700 hover:text-black"
                      >
                        <span>{step.officialLink.label}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  )}

                  {step.isMonetized && (
                    <div className="pt-3 mt-3 border-t border-emerald-200/80 space-y-2">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                        Recommended Blocked Account Providers:
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {Object.entries(AFFILIATE_PARTNERS).map(([key, p]) => (
                          <a
                            key={key}
                            href={p.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 rounded-lg bg-white border border-gray-200 hover:border-black flex items-center justify-between gap-2 transition-all group"
                          >
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-900 group-hover:underline">
                                  {p.name}
                                </span>
                                <span
                                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${p.badgeColor}`}
                                >
                                  {p.tag}
                                </span>
                              </div>
                              <p className="text-[11px] text-gray-500 mt-0.5">
                                {p.description}
                              </p>
                            </div>
                            <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-black shrink-0" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
