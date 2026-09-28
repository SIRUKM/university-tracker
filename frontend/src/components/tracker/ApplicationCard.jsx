import { useState } from "react";
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

export default function ApplicationCard({ 
  app, 
  onSave, 
  onRemove, 
  isDraft = false, 
  onCancelDraft 
}) {
  // Local state so edits don't trigger live sorting until "Add" is clicked
  const [formData, setFormData] = useState(app);
  const [isExpanded, setIsExpanded] = useState(true);
  const currentPriority = priorityConfig[formData.priority] || priorityConfig["1"];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className={`bg-white border rounded-xl p-5 shadow-sm transition-all ${isDraft ? 'border-black ring-2 ring-black/5 shadow-md bg-gray-50/30' : 'border-gray-200 hover:shadow-md'}`}>
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
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
          <h3 className="text-lg font-bold text-gray-900">
            {formData.universityName} {isDraft && <span className="text-xs font-normal text-gray-500 ml-2">(New Draft)</span>}
          </h3>
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

      {/* Primary Row: Course Name (reduced size), Priority Level, Application Status */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="space-y-1">
          <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <BookOpen className="h-3.5 w-3.5 mr-1" /> Course Name
          </label>
          <input
            type="text"
            placeholder="e.g. M.Sc. Data Science"
            value={formData.course || ""}
            onChange={(e) => handleChange("course", e.target.value)}
            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
          />
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
          
          {/* All Dates Adjacent: Opening Date -> Date Applied -> Deadline */}
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

          {/* Application Fee & Fee Status adjacent */}
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

          {/* Conditional VPD Status with neutral gray label */}
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

      {/* Add Button at the Bottom */}
      <div className="pt-4 mt-4 border-t border-gray-200 flex justify-end space-x-3">
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
          onClick={() => onSave(formData)}
          className="flex items-center space-x-2 bg-black hover:bg-gray-800 text-white text-sm font-semibold px-6 py-2 rounded-xl transition-all shadow-sm"
        >
          <PlusCircle className="h-4 w-4" />
          <span>{isDraft ? "Add Application to Tracker" : "Add"}</span>
        </button>
      </div>
    </div>
  );
}
