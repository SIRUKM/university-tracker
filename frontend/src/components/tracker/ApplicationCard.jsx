import { useState, useEffect, useRef } from "react";
import { useUser } from "@clerk/clerk-react";
import {
  Trash2,
  BookOpen,
  Calendar,
  CreditCard,
  LayoutTemplate,
  Flag,
  FileText,
  Link as LinkIcon,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Clock,
  CheckCircle2,
  PlusCircle,
  GraduationCap,
  Bell,
  BellRing,
  ExternalLink,
  Check,
  Loader2,
  X,
  ListTodo,
  Plus,
  Sparkles,
  Snowflake,
  Sun,
} from "lucide-react";

const priorityConfig = {
  1: {
    label: "High",
    badge: "bg-green-50 text-green-700 border-green-200",
    flag: "text-green-600",
  },
  2: {
    label: "Medium",
    badge: "bg-yellow-50 text-yellow-800 border-yellow-200",
    flag: "text-yellow-600",
  },
  3: {
    label: "Low",
    badge: "bg-orange-50 text-orange-700 border-orange-200",
    flag: "text-orange-500",
  },
};

const reminderLabels = {
  OPENING: "Opening Day",
  "15_DAYS": "15d Before Deadline",
  "10_DAYS": "10d Before Deadline",
};

const REMINDER_STORAGE_KEY = "unitracker_reminders_map";
const CHECKLIST_STORAGE_KEY = "unitracker_checklists_map";
const INTAKE_STORAGE_KEY = "unitracker_intake_map";

const DEFAULT_GERMAN_TASKS = [
  "Tailor course-specific Letter of Motivation (SOP)",
  "Update Tabular CV / Europass format",
  "Check module handbook & ECTS credit table",
  "Apply for Uni-Assist VPD (if required)",
  "Compile APS Certificate, IELTS/TOEFL & Transcripts",
];

const getAppCompositeKey = (app) =>
  `${(app?.universityName || "").trim().toLowerCase()}__${(app?.course || "").trim().toLowerCase()}`;

const getSavedIntake = (app) => {
  if (app?.intake) {
    return (app.intake || "").toLowerCase().includes("summer")
      ? "Summer"
      : "Winter";
  }
  try {
    const raw = localStorage.getItem(INTAKE_STORAGE_KEY);
    if (!raw) return "Winter";
    const map = JSON.parse(raw);
    const keyById = app?.id;
    const keyByName = getAppCompositeKey(app);
    const val = map[keyById] || map[keyByName];
    return val && val.toLowerCase().includes("summer") ? "Summer" : "Winter";
  } catch {
    return "Winter";
  }
};

const saveIntakeLocally = (app, intakeVal) => {
  try {
    const raw = localStorage.getItem(INTAKE_STORAGE_KEY);
    const map = raw ? JSON.parse(raw) : {};
    const keyById = app?.id;
    const keyByName = getAppCompositeKey(app);
    const normalized = (intakeVal || "").toLowerCase().includes("summer")
      ? "Summer"
      : "Winter";
    if (keyById) map[keyById] = normalized;
    map[keyByName] = normalized;
    localStorage.setItem(INTAKE_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore
  }
};

const getSavedReminder = (app) => {
  if (app?.reminderType && app.reminderType !== "NONE") {
    return app.reminderType;
  }
  try {
    const raw = localStorage.getItem(REMINDER_STORAGE_KEY);
    if (!raw) return "NONE";
    const map = JSON.parse(raw);
    const keyById = app?.id;
    const keyByName = getAppCompositeKey(app);
    return map[keyById] || map[keyByName] || "NONE";
  } catch {
    return "NONE";
  }
};

const saveReminderLocally = (app, reminderType) => {
  try {
    const raw = localStorage.getItem(REMINDER_STORAGE_KEY);
    const map = raw ? JSON.parse(raw) : {};
    const keyById = app?.id;
    const keyByName = getAppCompositeKey(app);
    if (!reminderType || reminderType === "NONE") {
      if (keyById) delete map[keyById];
      delete map[keyByName];
    } else {
      if (keyById) map[keyById] = reminderType;
      map[keyByName] = reminderType;
    }
    localStorage.setItem(REMINDER_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore storage errors
  }
};

const getSavedChecklist = (app) => {
  if (app?.checklistJson) {
    try {
      const parsed = JSON.parse(app.checklistJson);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // fallback to localStorage
    }
  }
  try {
    const raw = localStorage.getItem(CHECKLIST_STORAGE_KEY);
    if (!raw) return [];
    const map = JSON.parse(raw);
    const keyById = app?.id;
    const keyByName = getAppCompositeKey(app);
    return map[keyById] || map[keyByName] || [];
  } catch {
    return [];
  }
};

const saveChecklistLocally = (app, checklistArray) => {
  try {
    const raw = localStorage.getItem(CHECKLIST_STORAGE_KEY);
    const map = raw ? JSON.parse(raw) : {};
    const keyById = app?.id;
    const keyByName = getAppCompositeKey(app);
    if (keyById) map[keyById] = checklistArray;
    map[keyByName] = checklistArray;
    localStorage.setItem(CHECKLIST_STORAGE_KEY, JSON.stringify(map));
  } catch {
    // ignore storage errors
  }
};

const getDeadlineBadge = (deadlineStr) => {
  if (!deadlineStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(`${deadlineStr}T00:00:00`);
  if (isNaN(deadlineDate.getTime())) return null;

  const diffDays = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      text: `${Math.abs(diffDays)}d overdue`,
      classes: "bg-gray-100 text-gray-600 border-gray-300",
    };
  }
  if (diffDays === 0) {
    return {
      text: "Due Today!",
      classes: "bg-red-100 text-red-800 border-red-300 animate-pulse",
    };
  }
  if (diffDays <= 7) {
    return {
      text: `${diffDays} ${diffDays === 1 ? "day" : "days"} left`,
      classes: "bg-red-50 text-red-700 border-red-200",
    };
  }
  if (diffDays <= 30) {
    return {
      text: `${diffDays} days left`,
      classes: "bg-amber-50 text-amber-800 border-amber-300",
    };
  }
  return {
    text: `${diffDays} days left`,
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
};

const getIntakeBadge = (intakeStr) => {
  const isSummer = (intakeStr || "").toLowerCase().includes("summer");
  if (isSummer) {
    return {
      text: "Summer Semester",
      classes: "bg-amber-100/90 text-amber-800 border-amber-300 font-semibold",
      icon: "summer",
    };
  }
  return {
    text: "Winter Semester",
    classes: "bg-sky-100/90 text-sky-800 border-sky-300 font-semibold",
    icon: "winter",
  };
};

const getShiftedCalendarDate = (dateStr, daysOffset = 0) => {
  const date = new Date(`${dateStr}T00:00:00`);
  date.setDate(date.getDate() + daysOffset);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
};

export default function ApplicationCard({
  app,
  onSave,
  onRemove,
  isDraft = false,
  onCancelDraft,
}) {
  const { isSignedIn, user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || null;

  const [checklist, setChecklist] = useState(() => getSavedChecklist(app));
  const [showChecklist, setShowChecklist] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [showPresets, setShowPresets] = useState(false);
  const [dismissedPresets, setDismissedPresets] = useState([]);

  const [formData, setFormData] = useState(() => ({
    ...app,
    intake: getSavedIntake(app),
    reminderType: getSavedReminder(app),
    checklistJson: JSON.stringify(getSavedChecklist(app)),
  }));
  const [isExpanded, setIsExpanded] = useState(isDraft);
  const [courseError, setCourseError] = useState(false);
  const [saveState, setSaveState] = useState("idle");
  const [showReminderMenu, setShowReminderMenu] = useState(false);
  const reminderMenuRef = useRef(null);

  useEffect(() => {
    const savedList = getSavedChecklist(app);
    setChecklist(savedList);
    setFormData({
      ...app,
      intake: getSavedIntake(app),
      reminderType: getSavedReminder(app),
      checklistJson: JSON.stringify(savedList),
    });
    setCourseError(false);
  }, [app]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        reminderMenuRef.current &&
        !reminderMenuRef.current.contains(event.target)
      ) {
        setShowReminderMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const currentPriority =
    priorityConfig[formData.priority] || priorityConfig["1"];
  const deadlineBadge = getDeadlineBadge(formData.deadline);
  const intakeBadge = getIntakeBadge(formData.intake);
  const isSummer = (formData.intake || "Winter").toLowerCase().includes("summer");
  const hasUnsavedChanges =
    isDraft || JSON.stringify(formData) !== JSON.stringify(app);
  const activeReminderLabel = reminderLabels[formData.reminderType];

  const completedTasksCount = checklist.filter((t) => t.completed).length;
  const totalTasksCount = checklist.length;
  const allTasksDone =
    totalTasksCount > 0 && completedTasksCount === totalTasksCount;

  const syncChecklistChanges = async (updatedList) => {
    setChecklist(updatedList);
    saveChecklistLocally(formData, updatedList);
    const serialized = JSON.stringify(updatedList);
    const updatedFormData = {
      ...formData,
      checklistJson: serialized,
    };
    setFormData(updatedFormData);

    if (!isDraft && formData.course?.trim()) {
      try {
        await onSave({
          ...updatedFormData,
          course: updatedFormData.course.trim(),
          userEmail: userEmail || updatedFormData.userEmail || null,
        });
      } catch {
        // local state is already preserved
      }
    }
  };

  const handleAddTask = (e) => {
    e?.preventDefault();
    if (!newTaskText.trim()) return;
    const nextList = [
      ...checklist,
      {
        id: crypto.randomUUID(),
        text: newTaskText.trim(),
        completed: false,
      },
    ];
    setNewTaskText("");
    syncChecklistChanges(nextList);
  };

  const handleToggleTask = (taskId) => {
    const nextList = checklist.map((item) =>
      item.id === taskId ? { ...item, completed: !item.completed } : item,
    );
    syncChecklistChanges(nextList);
  };

  const handleDeleteTask = (taskId) => {
    const nextList = checklist.filter((item) => item.id !== taskId);
    syncChecklistChanges(nextList);
  };

  const handleAddSinglePreset = (presetText) => {
    const isAlreadyPresent = checklist.some(
      (t) => t.text.trim().toLowerCase() === presetText.trim().toLowerCase(),
    );
    if (isAlreadyPresent) return;
    const nextList = [
      ...checklist,
      {
        id: crypto.randomUUID(),
        text: presetText,
        completed: false,
      },
    ];
    syncChecklistChanges(nextList);
  };

  const handleAddAllPresets = () => {
    const existingTexts = new Set(
      checklist.map((t) => t.text.trim().toLowerCase()),
    );
    const available = DEFAULT_GERMAN_TASKS.filter(
      (preset) =>
        !dismissedPresets.includes(preset) &&
        !existingTexts.has(preset.trim().toLowerCase()),
    );
    const additions = available.map((preset) => ({
      id: crypto.randomUUID(),
      text: preset,
      completed: false,
    }));
    if (additions.length > 0) {
      syncChecklistChanges([...checklist, ...additions]);
    }
  };

  const handleDismissPreset = (presetText) => {
    setDismissedPresets((prev) => [...prev, presetText]);
  };

  const debounceTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const performSave = async (dataToSave) => {
    if (isDraft) return;
    if (!dataToSave.course || !dataToSave.course.trim()) {
      return;
    }
    setSaveState("saving");
    try {
      saveReminderLocally(dataToSave, dataToSave.reminderType);
      saveChecklistLocally(dataToSave, checklist);
      saveIntakeLocally(dataToSave, dataToSave.intake || "Winter");
      await onSave({
        ...dataToSave,
        intake: (dataToSave.intake || "Winter").toLowerCase().includes("summer")
          ? "Summer"
          : "Winter",
        course: dataToSave.course.trim(),
        checklistJson: JSON.stringify(checklist),
        userEmail: userEmail || dataToSave.userEmail || null,
      });
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2200);
    } catch {
      setSaveState("idle");
    }
  };

  const handleChange = (field, value) => {
    if (field === "course" && value.trim()) {
      setCourseError(false);
    }
    const updated = { ...formData, [field]: value };
    setFormData(updated);

    if (isDraft) return;

    // Immediate auto-save for priority, status, semester, portal, feeStatus, vpd, dates
    const immediateFields = [
      "priority",
      "status",
      "intake",
      "portal",
      "feeStatus",
      "vpdRequired",
      "vpdStatus",
      "greRequired",
      "openingDate",
      "deadline",
      "dateApplied",
    ];

    if (immediateFields.includes(field)) {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      performSave(updated);
    } else {
      // Debounce typing inputs (course, remarks, link, fee)
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        performSave(updated);
      }, 650);
    }
  };

  const handleBlur = () => {
    if (isDraft) return;
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    performSave(formData);
  };

  const handleSaveClick = async () => {
    if (!formData.course || !formData.course.trim()) {
      setCourseError(true);
      return;
    }
    setCourseError(false);
    setSaveState("saving");
    try {
      saveReminderLocally(formData, formData.reminderType);
      saveChecklistLocally(formData, checklist);
      saveIntakeLocally(formData, formData.intake || "Winter");
      await onSave({
        ...formData,
        intake: (formData.intake || "Winter").toLowerCase().includes("summer")
          ? "Summer"
          : "Winter",
        course: formData.course.trim(),
        checklistJson: JSON.stringify(checklist),
        userEmail: userEmail || formData.userEmail || null,
      });
      if (!isDraft) {
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 2000);
      }
    } catch {
      setSaveState("idle");
    }
  };

  const handleSelectReminderOption = async (optionType) => {
    setShowReminderMenu(false);

    if (optionType !== "custom") {
      if (!isSignedIn && optionType !== "none") {
        alert(
          "Please sign in at the top right to receive automated email reminders in your inbox.",
        );
        return;
      }

      const mappedType =
        optionType === "opening"
          ? "OPENING"
          : optionType === "15days"
            ? "15_DAYS"
            : optionType === "10days"
              ? "10_DAYS"
              : "NONE";

      const updated = {
        ...formData,
        course: formData.course?.trim() || "M.Sc. Program",
        userEmail: userEmail || formData.userEmail || null,
        reminderType: mappedType,
        reminderSent: false,
        checklistJson: JSON.stringify(checklist),
      };

      saveReminderLocally(updated, mappedType);
      setFormData(updated);

      if (!isDraft) {
        setSaveState("saving");
        try {
          await onSave(updated);
          setSaveState("saved");
          setTimeout(() => setSaveState("idle"), 2000);
        } catch {
          setSaveState("idle");
        }
      }
      return;
    }

    const uni = formData.universityName;
    const course = formData.course || "Master's";
    const baseDate =
      formData.deadline ||
      formData.openingDate ||
      new Date().toISOString().split("T")[0];
    const targetDateCompact = getShiftedCalendarDate(baseDate, 0);
    const title = encodeURIComponent(
      `Application Reminder: ${uni} (${course})`,
    );
    const details = encodeURIComponent(
      `University: ${uni}\nCourse: ${course}\nApplication Deadline: ${
        formData.deadline || "Not set"
      }\nOpening Date: ${formData.openingDate || "Not set"}\nPortal: ${
        formData.portal || "Direct Portal"
      }\nLink: ${formData.courseLink || "https://unitracker.live"}`,
    );

    const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${targetDateCompact}/${targetDateCompact}&details=${details}`;
    window.open(calUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className={`border rounded-xl p-5 shadow-sm transition-all duration-300 ease-in-out ${
        isDraft
          ? isSummer
            ? "border-amber-400 ring-2 ring-amber-400/20 shadow-md bg-amber-50/50"
            : "border-sky-400 ring-2 ring-sky-400/20 shadow-md bg-sky-50/50"
          : isSummer
            ? "bg-amber-50/40 hover:bg-amber-50/60 border-amber-200/90 hover:border-amber-300 shadow-xs hover:shadow-md"
            : "bg-sky-50/40 hover:bg-sky-50/60 border-sky-200/90 hover:border-sky-300 shadow-xs hover:shadow-md"
      }`}
    >
      {/* Card Header */}
      <div className={`flex flex-wrap items-center justify-between gap-3 pb-4 border-b transition-colors duration-300 ${
        isSummer ? "border-amber-200/70" : "border-sky-200/70"
      }`}>
        <div className="flex flex-wrap items-center gap-2.5">
          <div
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md border text-xs font-bold ${currentPriority.badge}`}
          >
            <Flag
              className={`h-3.5 w-3.5 fill-current ${currentPriority.flag}`}
            />
            <span>
              P{formData.priority || "1"} — {currentPriority.label}
            </span>
          </div>

          {/* Intake Badge (WiSe / SoSe) */}
          {intakeBadge && (
            <span
              className={`px-2.5 py-1 rounded-md border text-xs font-semibold flex items-center space-x-1 ${intakeBadge.classes}`}
            >
              {intakeBadge.icon === "winter" ? (
                <Snowflake className="h-3.5 w-3.5 mr-0.5 text-sky-500" />
              ) : intakeBadge.icon === "summer" ? (
                <Sun className="h-3.5 w-3.5 mr-0.5 text-amber-500" />
              ) : (
                <Calendar className="h-3.5 w-3.5 mr-0.5 text-gray-500" />
              )}
              <span>{intakeBadge.text}</span>
            </span>
          )}

          <h3 className="text-lg font-bold text-gray-900 flex flex-wrap items-center gap-2">
            <span>{formData.universityName}</span>
            {formData.courseLink && (
              <a
                href={formData.courseLink}
                target="_blank"
                rel="noopener noreferrer"
                title="Open Official University / Course Website"
                className="inline-flex items-center space-x-1 text-xs font-semibold text-gray-600 hover:text-black bg-gray-100 hover:bg-gray-200 px-2 py-0.5 rounded-md transition-colors"
              >
                <span>Website</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
            {isDraft && (
              <span className="text-xs font-normal text-gray-500">
                (New Draft)
              </span>
            )}
          </h3>

          {/* Dynamic Color-Coded Deadline Badge */}
          {deadlineBadge && (
            <span
              className={`px-2.5 py-0.5 rounded-full border text-xs font-semibold flex items-center space-x-1 ${deadlineBadge.classes}`}
            >
              <Clock className="h-3 w-3 mr-1" />
              <span>{deadlineBadge.text}</span>
            </span>
          )}

          {/* Remind Me Button + Static Adjacent Reminder Badge */}
          {(formData.deadline || formData.openingDate) && (
            <div
              className="flex flex-wrap items-center gap-2"
              ref={reminderMenuRef}
            >
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowReminderMenu((prev) => !prev)}
                  className={`text-xs font-semibold border px-2.5 py-0.5 rounded-full flex items-center space-x-1 transition-all ${
                    activeReminderLabel
                      ? "bg-gray-900 text-white border-gray-900 hover:bg-gray-800"
                      : "bg-gray-50 text-gray-600 border-gray-200 hover:text-black hover:bg-gray-100"
                  }`}
                >
                  {activeReminderLabel ? (
                    <BellRing className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <Bell className="h-3 w-3" />
                  )}
                  <span>Remind Me</span>
                  <ChevronDown className="h-3 w-3 ml-0.5 opacity-70" />
                </button>

                {showReminderMenu && (
                  <div className="absolute left-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-30">
                    <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Automated Email Alert
                    </div>

                    <button
                      type="button"
                      disabled={!formData.openingDate}
                      onClick={() => handleSelectReminderOption("opening")}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center justify-between disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="font-medium text-gray-800 flex items-center gap-1.5">
                        {formData.reminderType === "OPENING" && (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        )}
                        <span>When application opens</span>
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {formData.openingDate
                          ? formData.openingDate
                          : "No date"}
                      </span>
                    </button>

                    <button
                      type="button"
                      disabled={!formData.deadline}
                      onClick={() => handleSelectReminderOption("15days")}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center justify-between disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="font-medium text-gray-800 flex items-center gap-1.5">
                        {formData.reminderType === "15_DAYS" && (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        )}
                        <span>15 days before deadline</span>
                      </span>
                      <span className="text-[10px] text-gray-400">
                        -15d email
                      </span>
                    </button>

                    <button
                      type="button"
                      disabled={!formData.deadline}
                      onClick={() => handleSelectReminderOption("10days")}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center justify-between disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      <span className="font-medium text-gray-800 flex items-center gap-1.5">
                        {formData.reminderType === "10_DAYS" && (
                          <Check className="h-3.5 w-3.5 text-emerald-600" />
                        )}
                        <span>10 days before deadline</span>
                      </span>
                      <span className="text-[10px] text-gray-400">
                        -10d email
                      </span>
                    </button>

                    {activeReminderLabel && (
                      <button
                        type="button"
                        onClick={() => handleSelectReminderOption("none")}
                        className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 font-medium transition-colors"
                      >
                        Turn off email reminder
                      </button>
                    )}

                    <div className="my-1 border-t border-gray-100" />

                    <button
                      type="button"
                      onClick={() => handleSelectReminderOption("custom")}
                      className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center justify-between text-black font-semibold transition-colors"
                    >
                      <span>Custom calendar reminder...</span>
                      <ExternalLink className="h-3 w-3 text-gray-400" />
                    </button>
                  </div>
                )}
              </div>

              {/* Static Permanent Badge Adjacent to "Remind Me" */}
              {activeReminderLabel && (
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-600 text-white border border-emerald-600 shadow-sm"
                  title={`Automated email reminder active for ${formData.universityName} (${formData.course || "Course"})`}
                >
                  <Check className="h-3 w-3 stroke-[2.5]" />
                  <span>Reminder Set: {activeReminderLabel}</span>
                  <button
                    type="button"
                    onClick={() => handleSelectReminderOption("none")}
                    className="ml-0.5 hover:text-emerald-200 transition-colors"
                    title="Remove reminder"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* To-Do Checklist Toggle Button & Progress Pill */}
          <button
            type="button"
            onClick={() => setShowChecklist((prev) => !prev)}
            className={`text-xs font-semibold border px-2.5 py-0.5 rounded-full flex items-center space-x-1.5 transition-all ${
              allTasksDone
                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                : totalTasksCount > 0
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:text-black hover:bg-gray-100"
            }`}
          >
            <ListTodo className="h-3.5 w-3.5" />
            <span>
              {totalTasksCount > 0
                ? `Tasks (${completedTasksCount}/${totalTasksCount})`
                : "To-Do List"}
            </span>
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-semibold text-gray-600 hover:text-black px-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors flex items-center space-x-1"
          >
            <span>{isExpanded ? "Less details" : "All details"}</span>
            {isExpanded ? (
              <ChevronUp className="h-3.5 w-3.5" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5" />
            )}
          </button>

          {isDraft ? (
            <button
              type="button"
              onClick={onCancelDraft}
              className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
              title="Cancel"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onRemove(formData.id)}
              className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
              title="Delete application"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Collapsible Per-Application To-Do Checklist Panel */}
      {showChecklist && (
        <div className="mt-4 p-4 bg-gray-50/80 border border-gray-200 rounded-xl space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <ListTodo className="h-4 w-4 text-gray-800" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-800">
                Application Checklist — {formData.universityName}
              </h4>
              {totalTasksCount > 0 && (
                <span className="text-xs font-semibold text-gray-500">
                  ({Math.round((completedTasksCount / totalTasksCount) * 100)}%
                  complete)
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowPresets((prev) => !prev)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center space-x-1.5 border transition-all cursor-pointer ${
                showPresets
                  ? "bg-amber-100 text-amber-900 border-amber-300"
                  : "bg-white text-gray-700 hover:text-black border-gray-200 hover:border-gray-300 shadow-2xs"
              }`}
            >
              <Sparkles className="h-3 w-3 text-amber-500" />
              <span>
                {showPresets ? "Hide Suggestions" : "German App Presets"}
              </span>
              {showPresets ? (
                <ChevronUp className="h-3 w-3 text-amber-800" />
              ) : (
                <ChevronDown className="h-3 w-3 text-gray-400" />
              )}
            </button>
          </div>

          {/* Collapsible German Presets / Suggestions Panel */}
          {showPresets && (
            <div className="p-3.5 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                  <span className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                    Suggested German Application Tasks
                  </span>
                  <span className="text-[11px] text-amber-800">
                    (Pick items to add)
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {DEFAULT_GERMAN_TASKS.some(
                    (p) =>
                      !dismissedPresets.includes(p) &&
                      !checklist.some(
                        (t) =>
                          t.text.trim().toLowerCase() ===
                          p.trim().toLowerCase(),
                      ),
                  ) && (
                    <button
                      type="button"
                      onClick={handleAddAllPresets}
                      className="text-[11px] font-semibold text-amber-900 hover:text-black bg-amber-200/80 hover:bg-amber-300 px-2.5 py-1 rounded-md transition-colors cursor-pointer"
                    >
                      + Add All
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setShowPresets(false)}
                    className="text-amber-800 hover:text-amber-950 p-1 rounded-md hover:bg-amber-100 transition-colors cursor-pointer"
                    title="Collapse suggestions"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {DEFAULT_GERMAN_TASKS.filter((p) => !dismissedPresets.includes(p))
                .length === 0 ? (
                <div className="flex items-center justify-between text-xs text-amber-800 py-1">
                  <span>All suggestions have been dismissed.</span>
                  <button
                    type="button"
                    onClick={() => setDismissedPresets([])}
                    className="text-xs font-semibold text-amber-900 underline hover:text-black cursor-pointer"
                  >
                    Reset suggestions
                  </button>
                </div>
              ) : (
                <ul className="space-y-1.5">
                  {DEFAULT_GERMAN_TASKS.filter(
                    (p) => !dismissedPresets.includes(p),
                  ).map((preset) => {
                    const isAdded = checklist.some(
                      (t) =>
                        t.text.trim().toLowerCase() ===
                        preset.trim().toLowerCase(),
                    );
                    return (
                      <li
                        key={preset}
                        className="flex items-center justify-between gap-2 bg-white px-3 py-2 rounded-lg border border-amber-200/60 shadow-2xs"
                      >
                        <span className="text-xs font-medium text-gray-800">
                          {preset}
                        </span>
                        <div className="flex items-center space-x-1.5 shrink-0">
                          {isAdded ? (
                            <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                              <Check className="h-3 w-3" />
                              <span>Added</span>
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={() => handleAddSinglePreset(preset)}
                              className="inline-flex items-center space-x-1 text-[11px] font-bold text-white bg-black hover:bg-gray-800 px-2.5 py-1 rounded-md transition-colors cursor-pointer shadow-2xs"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Add</span>
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleDismissPreset(preset)}
                            className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-gray-100 transition-colors cursor-pointer"
                            title="Dismiss suggestion"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          {/* Progress Bar */}
          {totalTasksCount > 0 && (
            <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full transition-all duration-300"
                style={{
                  width: `${(completedTasksCount / totalTasksCount) * 100}%`,
                }}
              />
            </div>
          )}

          {/* Task Items */}
          {checklist.length === 0 ? (
            <p className="text-xs text-gray-500 py-1">
              No tasks added yet. Add a custom step below or open German App
              Presets above.
            </p>
          ) : (
            <ul className="space-y-1.5">
              {checklist.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-gray-200/80 hover:border-gray-300 transition-all"
                >
                  <label className="flex items-center space-x-2.5 cursor-pointer flex-1">
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleToggleTask(item.id)}
                      className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer accent-black"
                    />
                    <span
                      className={`text-xs font-medium transition-all ${
                        item.completed
                          ? "line-through text-gray-400"
                          : "text-gray-800"
                      }`}
                    >
                      {item.text}
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => handleDeleteTask(item.id)}
                    className="text-gray-400 hover:text-red-500 p-1 transition-colors cursor-pointer"
                    title="Delete task"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Add New Task Input + Collapse Button */}
          <div className="flex items-center space-x-2 pt-1">
            <input
              type="text"
              placeholder="Add a custom task (e.g. Request LOR from Prof. Sharma)..."
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTask(e);
                }
              }}
              className="flex-1 p-2 bg-white border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              type="button"
              onClick={handleAddTask}
              className="bg-black hover:bg-gray-800 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add</span>
            </button>
            <button
              type="button"
              onClick={() => setShowChecklist(false)}
              className="border border-gray-200 hover:border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors cursor-pointer shadow-2xs"
              title="Collapse checklist"
            >
              <ChevronUp className="h-3.5 w-3.5 text-gray-500" />
              <span>Collapse</span>
            </button>
          </div>
        </div>
      )}

      {/* Primary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        <div className="space-y-1">
          <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <BookOpen className="h-3.5 w-3.5 mr-1" /> Course Name{" "}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            required
            placeholder="e.g. M.Sc. Data Science"
            value={formData.course || ""}
            onChange={(e) => handleChange("course", e.target.value)}
            onBlur={handleBlur}
            className={`w-full p-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 text-sm ${
              courseError
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-black"
            }`}
          />
          {courseError && (
            <p className="text-xs text-red-500 font-medium">
              Course name is required.
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {isSummer ? (
              <Sun className="h-3.5 w-3.5 mr-1 text-amber-500" />
            ) : (
              <Snowflake className="h-3.5 w-3.5 mr-1 text-sky-500" />
            )}
            Semester
          </label>
          <select
            value={isSummer ? "Summer" : "Winter"}
            onChange={(e) => handleChange("intake", e.target.value)}
            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm font-medium"
          >
            <option value="Winter">❄️ Winter Semester</option>
            <option value="Summer">☀️ Summer Semester</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <Flag className="h-3.5 w-3.5 mr-1" /> Priority Level
          </label>
          <select
            value={formData.priority || "1"}
            onChange={(e) => handleChange("priority", e.target.value)}
            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm font-medium"
          >
            <option value="1">Priority 1 (High)</option>
            <option value="2">Priority 2 (Medium)</option>
            <option value="3">Priority 3 (Low)</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Application Status
          </label>
          <select
            value={formData.status || "Drafting"}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm font-medium"
          >
            <option value="Drafting">📝 Drafting Docs</option>
            <option value="Submitted">🚀 Submitted</option>
            <option value="Admitted">🎉 Admitted</option>
            <option value="Rejected">❌ Rejected</option>
          </select>
        </div>
      </div>

      {/* Expanded Extended Fields */}
      {isExpanded && (
        <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 mt-4 border-t p-4 rounded-xl transition-colors duration-300 ${
          isSummer ? "bg-amber-100/35 border-amber-200/60" : "bg-sky-100/35 border-sky-200/60"
        }`}>
          <div className="space-y-1">
            <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <Calendar className="h-3.5 w-3.5 mr-1" /> Opening Date
            </label>
            <input
              type="date"
              value={formData.openingDate || ""}
              onChange={(e) => handleChange("openingDate", e.target.value)}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:brightness-0"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <Clock className="h-3.5 w-3.5 mr-1" /> Date Applied
            </label>
            <input
              type="date"
              value={formData.dateApplied || ""}
              onChange={(e) => handleChange("dateApplied", e.target.value)}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:brightness-0"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <Calendar className="h-3.5 w-3.5 mr-1" /> Deadline
            </label>
            <input
              type="date"
              value={formData.deadline || ""}
              onChange={(e) => handleChange("deadline", e.target.value)}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:brightness-0"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <LayoutTemplate className="h-3.5 w-3.5 mr-1" /> Portal
            </label>
            <select
              value={formData.portal || "Direct Portal"}
              onChange={(e) => handleChange("portal", e.target.value)}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
            >
              <option value="Direct Portal">Direct Portal</option>
              <option value="Uni-Assist">Uni-Assist</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <CreditCard className="h-3.5 w-3.5 mr-1" /> Application Fee
            </label>
            <input
              type="text"
              placeholder="e.g. 75 EUR"
              value={formData.applicationFee || ""}
              onChange={(e) => handleChange("applicationFee", e.target.value)}
              onBlur={handleBlur}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <CreditCard className="h-3.5 w-3.5 mr-1" /> Fee Status
            </label>
            <select
              value={formData.feeStatus || "Pending"}
              onChange={(e) => handleChange("feeStatus", e.target.value)}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
            >
              <option value="Pending">Pending</option>
              <option value="Paid">Paid</option>
              <option value="Waived">Waived</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <AlertCircle className="h-3.5 w-3.5 mr-1" /> VPD Required?
            </label>
            <select
              value={formData.vpdRequired || "No"}
              onChange={(e) => handleChange("vpdRequired", e.target.value)}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          {formData.vpdRequired === "Yes" && (
            <div className="space-y-1 animate-fadeIn">
              <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <AlertCircle className="h-3.5 w-3.5 mr-1" /> VPD Status
              </label>
              <select
                value={formData.vpdStatus || "Pending"}
                onChange={(e) => handleChange("vpdStatus", e.target.value)}
                className={`w-full p-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm font-medium ${
                  formData.vpdStatus === "Received"
                    ? "bg-green-50 text-green-800 border-green-300"
                    : formData.vpdStatus === "Submitted"
                      ? "bg-blue-50 text-blue-800 border-blue-300"
                      : "bg-amber-50 text-amber-800 border-amber-300"
                }`}
              >
                <option value="Pending">VPD Pending</option>
                <option value="Submitted">VPD Submitted</option>
                <option value="Received">VPD Received</option>
              </select>
            </div>
          )}

          <div className="space-y-1">
            <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <GraduationCap className="h-3.5 w-3.5 mr-1" /> GRE Requirement
            </label>
            <select
              value={formData.greRequired || "No"}
              onChange={(e) => handleChange("greRequired", e.target.value)}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
              <option value="Optional">Optional</option>
            </select>
          </div>

          <div className="space-y-1 sm:col-span-2">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <LinkIcon className="h-3.5 w-3.5 mr-1" /> Course Link / Portal
                URL
              </label>

              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(
                  `${formData.universityName} ${formData.course || "Master's"} admission requirements curriculum`,
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-[11px] text-gray-500 hover:text-black font-semibold hover:underline"
                title="Search course page on Google"
              >
                <span>Find Course on Google</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>

            <input
              type="url"
              placeholder="https://uni-target.de/course"
              value={formData.courseLink || ""}
              onChange={(e) => handleChange("courseLink", e.target.value)}
              onBlur={handleBlur}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <FileText className="h-3.5 w-3.5 mr-1" /> Remarks / Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Requires German B2"
              value={formData.remarks || ""}
              onChange={(e) => handleChange("remarks", e.target.value)}
              onBlur={handleBlur}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
            />
          </div>
        </div>
      )}

      {/* Save Status / Draft Actions Footer */}
      <div className={`pt-4 mt-4 border-t flex items-center justify-between transition-colors duration-300 ${
        isSummer ? "border-amber-200/70" : "border-sky-200/70"
      }`}>
        <div className="flex items-center space-x-2">
          {!isDraft ? (
            <div className="flex items-center space-x-1.5 text-xs">
              {saveState === "saving" ? (
                <span className="flex items-center space-x-1.5 text-gray-500 font-medium">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-400" />
                  <span>Saving changes...</span>
                </span>
              ) : saveState === "saved" ? (
                <span className="flex items-center space-x-1.5 text-emerald-700 font-semibold animate-fadeIn">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Saved</span>
                </span>
              ) : hasUnsavedChanges ? (
                <span className="text-xs text-amber-600 font-medium">
                  • Saving...
                </span>
              ) : (
                <span className="text-[11px] text-gray-400 font-medium">
                  Auto-saved
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs text-gray-500 font-medium">New draft entry</span>
          )}
        </div>

        <div className="flex space-x-3">
          {isDraft && (
            <button
              type="button"
              onClick={onCancelDraft}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
          {isDraft ? (
            <button
              type="button"
              disabled={saveState === "saving"}
              onClick={handleSaveClick}
              className="flex items-center space-x-2 bg-black hover:bg-gray-800 text-white text-sm font-semibold px-6 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              {saveState === "saving" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <PlusCircle className="h-4 w-4" />
              )}
              <span>
                {saveState === "saving"
                  ? "Adding..."
                  : "Add Application to Tracker"}
              </span>
            </button>
          ) : (
            hasUnsavedChanges && (
              <button
                type="button"
                disabled={saveState === "saving"}
                onClick={handleSaveClick}
                className="text-xs font-semibold px-3 py-1.5 bg-black hover:bg-gray-800 text-white rounded-lg transition-colors cursor-pointer"
              >
                {saveState === "saving" ? "Saving..." : "Save now"}
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}
