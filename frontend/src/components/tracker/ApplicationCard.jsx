import { useState, useEffect, useRef } from "react";
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
  ExternalLink,
  Check,
  Loader2,
  X,
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

// Calculate days remaining and return color-coded badge styles
const getDeadlineBadge = (deadlineStr) => {
  if (!deadlineStr) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadlineDate = new Date(`${deadlineStr}T00:00:00`);
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
      classes: "bg-amber-50 text-amber-800 border-amber-200",
    };
  }
  return {
    text: `${diffDays} days left`,
    classes: "bg-emerald-50 text-emerald-700 border-emerald-200",
  };
};

// Shift a YYYY-MM-DD date by `daysOffset` and format as YYYYMMDD for Google Calendar
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
  const [formData, setFormData] = useState(app);
  const [isExpanded, setIsExpanded] = useState(isDraft);
  const [courseError, setCourseError] = useState(false);
  const [saveState, setSaveState] = useState("idle");
  const [showReminderMenu, setShowReminderMenu] = useState(false);
  const reminderMenuRef = useRef(null);

  useEffect(() => {
    setFormData(app);
    setCourseError(false);
  }, [app]);

  // Close the Reminder dropdown when clicking outside
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

  const currentPriority = priorityConfig[formData.priority] || priorityConfig["1"];
  const deadlineBadge = getDeadlineBadge(formData.deadline);
  const hasUnsavedChanges = isDraft || JSON.stringify(formData) !== JSON.stringify(app);

  const handleChange = (field, value) => {
    if (field === "course" && value.trim()) {
      setCourseError(false);
    }
    setSaveState("idle");
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveClick = async () => {
    if (!formData.course || !formData.course.trim()) {
      setCourseError(true);
      return;
    }
    setCourseError(false);
    setSaveState("saving");
    try {
      await onSave({ ...formData, course: formData.course.trim() });
      if (!isDraft) {
        setSaveState("saved");
        setTimeout(() => setSaveState("idle"), 2000);
      }
    } catch {
      setSaveState("idle");
    }
  };

  // Open Google Calendar for the selected reminder option
  const handleSelectReminderOption = (optionType) => {
    const uni = formData.universityName;
    const course = formData.course || "Master's";
    let targetDateCompact = "";
    let eventTitle = "";

    if (optionType === "opening") {
      if (!formData.openingDate) return;
      targetDateCompact = getShiftedCalendarDate(formData.openingDate, 0);
      eventTitle = `Application Opens: ${uni} (${course})`;
    } else if (optionType === "15days") {
      if (!formData.deadline) return;
      targetDateCompact = getShiftedCalendarDate(formData.deadline, -15);
      eventTitle = `15 Days Left to Apply: ${uni} (${course})`;
    } else if (optionType === "10days") {
      if (!formData.deadline) return;
      targetDateCompact = getShiftedCalendarDate(formData.deadline, -10);
      eventTitle = `10 Days Left to Apply: ${uni} (${course})`;
    } else {
      // Custom reminder (defaults to deadline date, opening date, or today)
      const baseDate =
        formData.deadline ||
        formData.openingDate ||
        new Date().toISOString().split("T")[0];
      targetDateCompact = getShiftedCalendarDate(baseDate, 0);
      eventTitle = `Application Reminder: ${uni} (${course})`;
    }

    const title = encodeURIComponent(eventTitle);
    const details = encodeURIComponent(
      `University: ${uni}\nCourse: ${course}\nApplication Deadline: ${
        formData.deadline || "Not set"
      }\nOpening Date: ${formData.openingDate || "Not set"}\nPortal: ${
        formData.portal || "Direct Portal"
      }\nLink: ${formData.courseLink || "https://unitracker.live"}`
    );

    const calUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${targetDateCompact}/${targetDateCompact}&details=${details}`;
    window.open(calUrl, "_blank", "noopener,noreferrer");
    setShowReminderMenu(false);
  };

  return (
    <div
      className={`bg-white border rounded-xl p-5 shadow-sm transition-all ${
        isDraft
          ? "border-black ring-2 ring-black/5 shadow-md bg-gray-50/30"
          : "border-gray-200 hover:shadow-md"
      }`}
    >
      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100">
        <div className="flex flex-wrap items-center gap-2.5">
          <div
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md border text-xs font-bold ${currentPriority.badge}`}
          >
            <Flag className={`h-3.5 w-3.5 fill-current ${currentPriority.flag}`} />
            <span>
              P{formData.priority || "1"} — {currentPriority.label}
            </span>
          </div>

          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>{formData.universityName}</span>
            {formData.courseLink && (
              <a
                href={formData.courseLink}
                target="_blank"
                rel="noopener noreferrer"
                title="Open Course Website"
                className="text-gray-400 hover:text-black transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {isDraft && (
              <span className="text-xs font-normal text-gray-500">(New Draft)</span>
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

          {/* Remind Me Dropdown Menu */}
          {(formData.deadline || formData.openingDate) && (
            <div className="relative" ref={reminderMenuRef}>
              <button
                type="button"
                onClick={() => setShowReminderMenu((prev) => !prev)}
                className="text-xs font-medium text-gray-600 hover:text-black bg-gray-50 hover:bg-gray-100 border border-gray-200 px-2.5 py-0.5 rounded-full flex items-center space-x-1 transition-colors"
              >
                <Bell className="h-3 w-3" />
                <span>Remind Me</span>
                <ChevronDown className="h-3 w-3 ml-0.5 text-gray-400" />
              </button>

              {showReminderMenu && (
                <div className="absolute left-0 mt-2 w-60 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 z-30">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Set Calendar Alert
                  </div>

                  {/* Option 1: When Application Opens */}
                  <button
                    type="button"
                    disabled={!formData.openingDate}
                    onClick={() => handleSelectReminderOption("opening")}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center justify-between disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="font-medium text-gray-800">
                      When application opens
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {formData.openingDate ? formData.openingDate : "No date"}
                    </span>
                  </button>

                  {/* Option 2: 15 Days Before Deadline */}
                  <button
                    type="button"
                    disabled={!formData.deadline}
                    onClick={() => handleSelectReminderOption("15days")}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center justify-between disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="font-medium text-gray-800">
                      15 days before deadline
                    </span>
                    <span className="text-[10px] text-gray-400">-15d</span>
                  </button>

                  {/* Option 3: 10 Days Before Deadline */}
                  <button
                    type="button"
                    disabled={!formData.deadline}
                    onClick={() => handleSelectReminderOption("10days")}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center justify-between disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="font-medium text-gray-800">
                      10 days before deadline
                    </span>
                    <span className="text-[10px] text-gray-400">-10d</span>
                  </button>

                  <div className="my-1 border-t border-gray-100" />

                  {/* Option 4: Custom Reminder */}
                  <button
                    type="button"
                    onClick={() => handleSelectReminderOption("custom")}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-gray-50 flex items-center justify-between text-black font-semibold transition-colors"
                  >
                    <span>Custom reminder...</span>
                    <ExternalLink className="h-3 w-3 text-gray-400" />
                  </button>
                </div>
              )}
            </div>
          )}
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

      {/* Primary Row: Course Name (Mandatory), Priority Level, Application Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
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
            className={`w-full p-2.5 bg-white border rounded-lg focus:outline-none focus:ring-2 text-sm ${
              courseError
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-200 focus:ring-black"
            }`}
          />
          {courseError && (
            <p className="text-xs text-red-500 font-medium">Course name is required.</p>
          )}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 mt-4 border-t border-gray-100 bg-gray-50/50 p-4 rounded-xl">
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
            <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <LinkIcon className="h-3.5 w-3.5 mr-1" /> Course Link / Portal URL
            </label>
            <input
              type="url"
              placeholder="https://uni-target.de/course"
              value={formData.courseLink || ""}
              onChange={(e) => handleChange("courseLink", e.target.value)}
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
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
            />
          </div>
        </div>
      )}

      {/* Save / Update Button */}
      <div className="pt-4 mt-4 border-t border-gray-200 flex items-center justify-between">
        <div>
          {!isDraft && hasUnsavedChanges && saveState === "idle" && (
            <span className="text-xs text-amber-600 font-medium">
              • Unsaved changes
            </span>
          )}
        </div>
        <div className="flex space-x-3">
          {isDraft && (
            <button
              type="button"
              onClick={onCancelDraft}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            disabled={saveState === "saving"}
            onClick={handleSaveClick}
            className={`flex items-center space-x-2 text-white text-sm font-semibold px-6 py-2 rounded-xl transition-all shadow-sm ${
              saveState === "saved"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {saveState === "saving" && <Loader2 className="h-4 w-4 animate-spin" />}
            {saveState === "saved" && <Check className="h-4 w-4" />}
            {isDraft && saveState === "idle" && <PlusCircle className="h-4 w-4" />}
            <span>
              {saveState === "saving"
                ? "Saving..."
                : saveState === "saved"
                ? "Saved"
                : isDraft
                ? "Add Application to Tracker"
                : "Update"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
