import { X, Sparkles, Check, ExternalLink, Landmark, Plane, Smartphone, CircleDollarSign } from 'lucide-react';
import { PARTNER_LINKS } from '../../config/affiliateLinks';

export default function AdmittedCelebrationModal({ isOpen, onClose, app }) {
  if (!isOpen || !app) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative space-y-6 my-8 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-black p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          title="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Celebration Header */}
        <div className="text-center space-y-2 pt-2">
          <div className="inline-flex items-center space-x-1.5 bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-1 rounded-full animate-bounce">
            <Sparkles className="h-3.5 w-3.5 text-amber-600" />
            <span>Admitted! Herzlichen Glückwunsch! 🎉</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            You're Going to Germany! 🇩🇪
          </h2>

          <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto">
            Congratulations on receiving your admit offer for <strong className="text-black">{app.course || 'Master Program'}</strong> at <strong className="text-black">{app.universityName}</strong>!
          </p>
        </div>

        {/* Next Essential Steps Checklist */}
        <div className="space-y-3 bg-gray-50/80 border border-gray-200/90 rounded-2xl p-4 sm:p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900 flex items-center space-x-1.5">
            <Check className="h-4 w-4 text-emerald-600" />
            <span>Your 4 Immediate Next Steps for German Visa:</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Step 1: Blocked Account */}
            <div className="p-3 bg-white border border-gray-200 rounded-xl space-y-1.5 shadow-2xs">
              <div className="flex items-center space-x-1.5 font-bold text-gray-900">
                <Landmark className="h-3.5 w-3.5 text-emerald-600" />
                <span>1. Blocked Account (€11,904)</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Mandatory for German visa. Expatrio offers free health & travel insurance.
              </p>
              <a
                href={PARTNER_LINKS.blockedAccounts[0]?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 hover:underline pt-0.5"
              >
                <span>Open Expatrio Account</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>

            {/* Step 2: Money Transfer */}
            <div className="p-3 bg-white border border-gray-200 rounded-xl space-y-1.5 shadow-2xs">
              <div className="flex items-center space-x-1.5 font-bold text-gray-900">
                <CircleDollarSign className="h-3.5 w-3.5 text-blue-600" />
                <span>2. Forex Transfer</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Send your ₹10–12L at real mid-market exchange rate without high bank markups.
              </p>
              <a
                href={PARTNER_LINKS.forexTransfer[0]?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-[11px] font-bold text-blue-700 hover:text-blue-800 hover:underline pt-0.5"
              >
                <span>Transfer via Wise (Zero Fee)</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>

            {/* Step 3: Student Flight */}
            <div className="p-3 bg-white border border-gray-200 rounded-xl space-y-1.5 shadow-2xs">
              <div className="flex items-center space-x-1.5 font-bold text-gray-900">
                <Plane className="h-3.5 w-3.5 text-indigo-600" />
                <span>3. 40kg Student Flights</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Special student airline fares with double checked luggage (2x23kg).
              </p>
              <a
                href={PARTNER_LINKS.flightDeals[0]?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-[11px] font-bold text-indigo-700 hover:text-indigo-800 hover:underline pt-0.5"
              >
                <span>Search StudentUniverse</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>

            {/* Step 4: German SIM */}
            <div className="p-3 bg-white border border-gray-200 rounded-xl space-y-1.5 shadow-2xs">
              <div className="flex items-center space-x-1.5 font-bold text-gray-900">
                <Smartphone className="h-3.5 w-3.5 text-teal-600" />
                <span>4. German eSIM Card</span>
              </div>
              <p className="text-[11px] text-gray-500">
                Instant 5G connection when you land at Frankfurt/Munich airport.
              </p>
              <a
                href={PARTNER_LINKS.simCards[0]?.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-[11px] font-bold text-teal-700 hover:text-teal-800 hover:underline pt-0.5"
              >
                <span>Get Airalo eSIM</span>
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-3 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
        >
          Continue Tracking Applications
        </button>
      </div>
    </div>
  );
}
