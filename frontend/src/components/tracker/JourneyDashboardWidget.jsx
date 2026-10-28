import { useState, useEffect } from "react";
import {
  CheckCircle2,
  Circle,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Compass,
  Check,
} from "lucide-react";
import { ROADMAP_PHASES } from "./GermanyRoadmap";

const ROADMAP_STORAGE_KEY = "unitracker_germany_roadmap_v1";
const ROADMAP_ACTIVE_PHASE_KEY = "unitracker_germany_roadmap_active_phase_v2";

export default function JourneyDashboardWidget({ onOpenJourney }) {
  const [completedStepIds, setCompletedStepIds] = useState(() => {
    try {
      const saved = localStorage.getItem(ROADMAP_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [activePhaseId, setActivePhaseId] = useState(() => {
    try {
      const saved = localStorage.getItem(ROADMAP_ACTIVE_PHASE_KEY);
      if (saved && ROADMAP_PHASES.some((p) => p.id === saved)) {
        return saved;
      }
    } catch {}
    return "p1";
  });

  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const handleStorage = () => {
      try {
        const saved = localStorage.getItem(ROADMAP_STORAGE_KEY);
        if (saved) setCompletedStepIds(JSON.parse(saved));
        const savedPhase = localStorage.getItem(ROADMAP_ACTIVE_PHASE_KEY);
        if (savedPhase) setActivePhaseId(savedPhase);
      } catch {}
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const allSubTasks = ROADMAP_PHASES.flatMap((s) => s.tasks);
  const totalCompletedCount = allSubTasks.filter((t) =>
    completedStepIds.includes(t.id)
  ).length;
  const totalProgressPercent =
    allSubTasks.length > 0
      ? Math.round((totalCompletedCount / allSubTasks.length) * 100)
      : 0;

  // Find the current active phase (or the first phase with incomplete tasks)
  const activePhase =
    ROADMAP_PHASES.find((p) => p.id === activePhaseId) || ROADMAP_PHASES[0];

  const activePhaseDone = activePhase.tasks.filter((t) =>
    completedStepIds.includes(t.id)
  ).length;

  const toggleTask = (taskId, e) => {
    e.stopPropagation();
    setCompletedStepIds((prev) => {
      const updated = prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId];
      try {
        localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 transition-all">
      {/* Top Banner Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-800 text-[11px] font-bold">
              <Compass className="h-3 w-3 text-black" />
              <span>Relocation Journey</span>
            </span>
            <span className="text-gray-300">•</span>
            <span className="text-xs font-semibold text-emerald-700">
              {totalProgressPercent}% Overall Readiness
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold text-gray-900">
              Current Stage: {activePhase.shortCode} • {activePhase.title}
            </h3>
          </div>
          <p className="text-xs text-gray-500">
            {activePhase.timeframe} • {activePhaseDone}/{activePhase.tasks.length} tasks completed
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2.5 shrink-0">
          <button
            type="button"
            onClick={() => onOpenJourney && onOpenJourney(activePhase.id)}
            className="px-4 py-2 bg-black hover:bg-gray-800 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer"
          >
            <span>Open Journey ({activePhase.shortCode})</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsExpanded((prev) => !prev)}
            className="p-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl transition-colors cursor-pointer"
            title={isExpanded ? "Collapse preview" : "Expand preview"}
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-black h-full rounded-full transition-all duration-500"
          style={{ width: `${totalProgressPercent}%` }}
        />
      </div>

      {/* Mini Stage Stepper Pills */}
      <div className="grid grid-cols-7 gap-1 pt-1">
        {ROADMAP_PHASES.map((phase) => {
          const isDone = phase.tasks.every((t) => completedStepIds.includes(t.id));
          const isCurrent = phase.id === activePhase.id;

          return (
            <button
              key={phase.id}
              type="button"
              onClick={() => onOpenJourney && onOpenJourney(phase.id)}
              className={`p-2 rounded-lg text-center transition-all cursor-pointer border ${
                isCurrent
                  ? "bg-black text-white border-black font-bold shadow-2xs"
                  : isDone
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                  : "bg-gray-50 text-gray-500 border-gray-100 hover:bg-gray-100"
              }`}
            >
              <div className="text-[11px] font-bold flex items-center justify-center space-x-0.5">
                {isDone ? <Check className="h-3 w-3 stroke-[3]" /> : phase.shortCode}
              </div>
              <div className="text-[9px] truncate hidden md:block">
                {phase.shortTitle}
              </div>
            </button>
          );
        })}
      </div>

      {/* Expandable Task Quick-Checklist */}
      {isExpanded && (
        <div className="pt-3 border-t border-gray-100 space-y-2 animate-fadeIn">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-wider">
            Tasks for {activePhase.shortCode}:
          </div>
          <div className="space-y-1.5">
            {activePhase.tasks.map((task) => {
              const checked = completedStepIds.includes(task.id);
              return (
                <div
                  key={task.id}
                  onClick={(e) => toggleTask(task.id, e)}
                  className="flex items-center space-x-2.5 p-2 rounded-lg hover:bg-gray-50 cursor-pointer text-xs"
                >
                  {checked ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-300 shrink-0" />
                  )}
                  <span
                    className={
                      checked ? "line-through text-gray-400" : "text-gray-800 font-medium"
                    }
                  >
                    {task.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
