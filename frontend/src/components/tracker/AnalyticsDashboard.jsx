import { useMemo, useState } from 'react';
import {
  Euro,
  Trophy,
  Send,
  FileCheck2,
  AlertTriangle,
  BarChart3,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// Extracts numeric value from strings like "75 EUR", "€30.50", or "75"
const parseFeeAmount = (feeStr) => {
  if (!feeStr) return 0;
  const cleaned = String(feeStr).replace(/[^0-9.]/g, '');
  const val = parseFloat(cleaned);
  return isNaN(val) ? 0 : val;
};

const EUR_TO_INR_RATE = 93; // Approx conversion for quick reference

export default function AnalyticsDashboard({ applications }) {
  const [showInr, setShowInr] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const stats = useMemo(() => {
    const total = applications.length;
    let admitted = 0;
    let rejected = 0;
    let submitted = 0;
    let drafting = 0;

    let feePaid = 0;
    let feePending = 0;
    let feeWaived = 0;

    let vpdTotal = 0;
    let vpdReceived = 0;
    let uniAssistCount = 0;
    let directPortalCount = 0;

    let urgentCount = 0;
    let nextDeadlineApp = null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    applications.forEach((app) => {
      // 1. Status counts
      const status = app.status || 'Drafting';
      if (status === 'Admitted') admitted++;
      else if (status === 'Rejected') rejected++;
      else if (status === 'Submitted') submitted++;
      else drafting++;

      // 2. Financials
      const amount = parseFeeAmount(app.applicationFee);
      const feeStatus = app.feeStatus || 'Pending';
      if (feeStatus === 'Paid') feePaid += amount;
      else if (feeStatus === 'Waived') feeWaived += amount;
      else feePending += amount;

      // 3. Portal & VPD
      if (app.portal === 'Uni-Assist') uniAssistCount++;
      else directPortalCount++;

      if (app.vpdRequired === 'Yes') {
        vpdTotal++;
        if (app.vpdStatus === 'Received') vpdReceived++;
      }

      // 4. Upcoming Deadlines (only for unsubmitted drafts)
      if (status === 'Drafting' && app.deadline) {
        const dDate = new Date(`${app.deadline}T00:00:00`);
        const diffDays = Math.ceil((dDate - today) / (1000 * 60 * 60 * 24));

        if (diffDays >= 0 && diffDays <= 14) {
          urgentCount++;
        }
        if (diffDays >= 0) {
          if (!nextDeadlineApp || diffDays < nextDeadlineApp.diffDays) {
            nextDeadlineApp = {
              name: app.universityName,
              course: app.course,
              diffDays,
            };
          }
        }
      }
    });

    const completedCount = admitted + rejected + submitted;
    const completionRate = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    return {
      total,
      admitted,
      rejected,
      submitted,
      drafting,
      feePaid,
      feePending,
      feeWaived,
      vpdTotal,
      vpdReceived,
      uniAssistCount,
      directPortalCount,
      urgentCount,
      nextDeadlineApp,
      completionRate,
    };
  }, [applications]);

  if (applications.length === 0) return null;

  const formatMoney = (eurAmount) => {
    if (showInr) {
      const inr = Math.round(eurAmount * EUR_TO_INR_RATE);
      return `₹${inr.toLocaleString('en-IN')}`;
    }
    return `€${eurAmount.toFixed(0)}`;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 bg-gray-900 text-white rounded-lg">
            <BarChart3 className="h-4 w-4" />
          </div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
            Admissions & Financial Analytics
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          {!isCollapsed && (
            <button
              type="button"
              onClick={() => setShowInr(!showInr)}
              className="text-xs font-semibold px-2.5 py-1 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-700 transition-colors"
              title="Toggle Currency between EUR and Approx INR"
            >
              Currency: {showInr ? 'INR (₹)' : 'EUR (€)'}
            </button>
          )}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-xs font-semibold text-gray-500 hover:text-black px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 flex items-center space-x-1 transition-colors"
          >
            <span>{isCollapsed ? 'Show Insights' : 'Hide'}</span>
            {isCollapsed ? (
              <ChevronDown className="h-3.5 w-3.5" />
            ) : (
              <ChevronUp className="h-3.5 w-3.5" />
            )}
          </button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* 4 Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* 1. Decisions Card */}
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/60 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase">
                <span>Decisions</span>
                <Trophy className="h-4 w-4 text-emerald-600" />
              </div>
              <div className="my-2 flex items-baseline space-x-3">
                <div>
                  <span className="text-2xl font-extrabold text-emerald-600">
                    {stats.admitted}
                  </span>
                  <span className="text-xs font-medium text-gray-500 ml-1">Admitted</span>
                </div>
                <span className="text-gray-300">|</span>
                <div>
                  <span className="text-lg font-bold text-red-500">
                    {stats.rejected}
                  </span>
                  <span className="text-xs font-medium text-gray-500 ml-1">Rejected</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">
                {stats.submitted} awaiting university decision
              </p>
            </div>

            {/* 2. Financials Card */}
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/60 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase">
                <span>Total Fees Paid</span>
                <Euro className="h-4 w-4 text-gray-700" />
              </div>
              <div className="my-2">
                <span className="text-2xl font-extrabold text-gray-900">
                  {formatMoney(stats.feePaid)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Pending: <strong className="text-amber-700">{formatMoney(stats.feePending)}</strong></span>
                {stats.feeWaived > 0 && (
                  <span>Waived: <strong className="text-emerald-700">{formatMoney(stats.feeWaived)}</strong></span>
                )}
              </div>
            </div>

            {/* 3. Submission Progress & Portals */}
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/60 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase">
                <span>Submission Rate</span>
                <Send className="h-4 w-4 text-blue-600" />
              </div>
              <div className="my-2 flex items-baseline space-x-2">
                <span className="text-2xl font-extrabold text-gray-900">
                  {stats.completionRate}%
                </span>
                <span className="text-xs text-gray-500">
                  ({stats.total - stats.drafting} of {stats.total} sent)
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {stats.uniAssistCount} Uni-Assist • {stats.directPortalCount} Direct
              </p>
            </div>

            {/* 4. VPD & Deadline Radar */}
            <div className="p-4 rounded-xl border border-gray-100 bg-gray-50/60 flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs font-semibold text-gray-500 uppercase">
                <span>VPD & Urgency</span>
                {stats.urgentCount > 0 ? (
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                ) : (
                  <FileCheck2 className="h-4 w-4 text-gray-600" />
                )}
              </div>
              <div className="my-2">
                {stats.vpdTotal > 0 ? (
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-2xl font-extrabold text-gray-900">
                      {stats.vpdReceived}/{stats.vpdTotal}
                    </span>
                    <span className="text-xs text-gray-500">VPDs Received</span>
                  </div>
                ) : (
                  <span className="text-sm font-bold text-gray-700">No VPDs Required</span>
                )}
              </div>
              <p className="text-xs text-gray-500 truncate">
                {stats.nextDeadlineApp ? (
                  <span>
                    Next due: <strong className="text-gray-800">{stats.nextDeadlineApp.name}</strong> ({stats.nextDeadlineApp.diffDays}d)
                  </span>
                ) : (
                  <span>No pending draft deadlines</span>
                )}
              </p>
            </div>
          </div>

          {/* Visual Application Pipeline Bar */}
          <div className="space-y-1.5 pt-1">
            <div className="flex justify-between text-xs text-gray-500 font-medium">
              <span>Application Pipeline Distribution</span>
              <div className="flex items-center space-x-3">
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1"></span>Admitted ({stats.admitted})</span>
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>Submitted ({stats.submitted})</span>
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-gray-300 mr-1"></span>Drafting ({stats.drafting})</span>
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-red-400 mr-1"></span>Rejected ({stats.rejected})</span>
              </div>
            </div>
            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden flex">
              {stats.admitted > 0 && (
                <div
                  style={{ width: `${(stats.admitted / stats.total) * 100}%` }}
                  className="bg-emerald-500 h-full transition-all duration-500"
                />
              )}
              {stats.submitted > 0 && (
                <div
                  style={{ width: `${(stats.submitted / stats.total) * 100}%` }}
                  className="bg-blue-500 h-full transition-all duration-500"
                />
              )}
              {stats.drafting > 0 && (
                <div
                  style={{ width: `${(stats.drafting / stats.total) * 100}%` }}
                  className="bg-gray-300 h-full transition-all duration-500"
                />
              )}
              {stats.rejected > 0 && (
                <div
                  style={{ width: `${(stats.rejected / stats.total) * 100}%` }}
                  className="bg-red-400 h-full transition-all duration-500"
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
