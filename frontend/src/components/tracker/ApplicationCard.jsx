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
} from "lucide-react";

// Priority 1 = High (Green), Priority 2 = Medium (Yellow), Priority 3 = Low (Orange)
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

export default function ApplicationCard({ app, onUpdate, onRemove }) {
  const [isExpanded, setIsExpanded] = useState(true);
  const currentPriority = priorityConfig[app.priority] || priorityConfig["1"];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          {/* Colored Flag & Priority Badge */}
          <div
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-md border text-xs font-bold ${currentPriority.badge}`}
          >
            <Flag
              className={`h-3.5 w-3.5 fill-current ${currentPriority.flag}`}
            />
            <span>
              P{app.priority || "1"} — {currentPriority.label}
            </span>
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            {app.universityName}
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

          <button
            type="button"
            onClick={() => onRemove(app.id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-1.5 rounded-lg hover:bg-red-50"
            title="Delete application"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Primary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        <div className="space-y-1">
          <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <BookOpen className="h-3.5 w-3.5 mr-1" /> Course Name
          </label>
          <input
            type="text"
            placeholder="e.g. M.Sc. Data Science"
            value={app.course || ""}
            onChange={(e) => onUpdate(app.id, "course", e.target.value)}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <Calendar className="h-3.5 w-3.5 mr-1" /> Deadline
          </label>
          <input
            type="date"
            value={app.deadline || ""}
            onChange={(e) =>
              updateApplication(app.id, "deadline", e.target.value)
            }
            className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:brightness-0"
          />
        </div>

        <div className="space-y-1">
          <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <CreditCard className="h-3.5 w-3.5 mr-1" /> Fee Status
          </label>
          <select
            value={app.feeStatus || "Pending"}
            onChange={(e) => onUpdate(app.id, "feeStatus", e.target.value)}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
          >
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Waived">Waived</option>
          </select>
        </div>

        <div className="space-y-1">
          <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <LayoutTemplate className="h-3.5 w-3.5 mr-1" /> Portal
          </label>
          <select
            value={app.portal || "Direct Portal"}
            onChange={(e) => onUpdate(app.id, "portal", e.target.value)}
            className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
          >
            <option value="Direct Portal">Direct Portal</option>
            <option value="Uni-Assist">Uni-Assist</option>
          </select>
        </div>
      </div>

      {/* Expanded Extended Fields */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 mt-4 border-t border-gray-100 bg-gray-50/50 p-4 rounded-xl">
          <div className="space-y-1">
            <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <Flag className="h-3.5 w-3.5 mr-1" /> Priority Level
            </label>
            <select
              value={app.priority || "1"}
              onChange={(e) => onUpdate(app.id, "priority", e.target.value)}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm font-medium"
            >
              <option value="1">Priority 1 (High)</option>
              <option value="2">Priority 2 (Medium)</option>
              <option value="3">Priority 3 (Low)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <Calendar className="h-3.5 w-3.5 mr-1" /> Opening Date
            </label>
            <input
              type="date"
              value={app.deadline || ""}
              onChange={(e) =>
                updateApplication(app.id, "deadline", e.target.value)
              }
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:brightness-0"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <Clock className="h-3.5 w-3.5 mr-1" /> Date Applied
            </label>
            <input
              type="date"
              value={app.deadline || ""}
              onChange={(e) =>
                updateApplication(app.id, "deadline", e.target.value)
              }
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:filter [&::-webkit-calendar-picker-indicator]:brightness-0"
            />
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <AlertCircle className="h-3.5 w-3.5 mr-1" /> VPD Required?
            </label>
            <select
              value={app.vpdRequired || "No"}
              onChange={(e) => onUpdate(app.id, "vpdRequired", e.target.value)}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
            >
              <option value="No">No</option>
              <option value="Yes">Yes</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <CreditCard className="h-3.5 w-3.5 mr-1" /> Application Fee
            </label>
            <input
              type="text"
              placeholder="e.g. 75 EUR"
              value={app.applicationFee || ""}
              onChange={(e) =>
                onUpdate(app.id, "applicationFee", e.target.value)
              }
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
            />
          </div>

          <div className="space-y-1 sm:col-span-2">
            <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <LinkIcon className="h-3.5 w-3.5 mr-1" /> Course Link / Portal URL
            </label>
            <input
              type="url"
              placeholder="https://uni-target.de/course"
              value={app.courseLink || ""}
              onChange={(e) => onUpdate(app.id, "courseLink", e.target.value)}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
            />
          </div>

          <div className="space-y-1 sm:col-span-1">
            <label className="flex items-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <FileText className="h-3.5 w-3.5 mr-1" /> Remarks / Notes
            </label>
            <input
              type="text"
              placeholder="e.g. Requires German B2"
              value={app.remarks || ""}
              onChange={(e) => onUpdate(app.id, "remarks", e.target.value)}
              className="w-full p-2.5 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
            />
          </div>
        </div>
      )}
    </div>
  );
}
