import { useState } from 'react';
import {
  Sparkles,
  Landmark,
  CircleDollarSign,
  Plane,
  Smartphone,
  Home,
  ExternalLink,
  ShieldCheck,
  Check,
  ArrowLeft,
  Gift,
  HelpCircle,
} from 'lucide-react';
import { PARTNER_LINKS } from '../../config/affiliateLinks';

export default function StudentDeals({ onNavigateToDashboard }) {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Resources', icon: Gift },
    { id: 'blockedAccounts', label: 'Blocked Account (€11,904)', icon: Landmark },
    { id: 'forexTransfer', label: 'Forex & Money Transfer', icon: CircleDollarSign },
    { id: 'flightDeals', label: 'Student Flights (40kg Bag)', icon: Plane },
    { id: 'simCards', label: 'German SIM & eSIM', icon: Smartphone },
    { id: 'housing', label: 'Student Housing & WG', icon: Home },
  ];

  const renderCard = (item, Icon, iconColor, perkBorderBg) => (
    <div
      key={item.id}
      className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-5"
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-2">
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full border ${item.badgeColor}`}
          >
            {item.tag}
          </span>
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
        </div>

        <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
          {item.name}
        </h3>

        <p className="text-sm text-gray-600 leading-relaxed">
          {item.description}
        </p>

        <div className={`rounded-xl p-3 text-xs sm:text-sm font-semibold flex items-center space-x-2 border ${perkBorderBg}`}>
          <Icon className={`h-4 w-4 shrink-0 ${iconColor}`} />
          <span>{item.perk}</span>
        </div>
      </div>

      <a
        href={item.url}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full flex items-center justify-center space-x-2 bg-black hover:bg-gray-800 text-white text-sm font-semibold py-3 px-4 rounded-xl transition-colors cursor-pointer"
      >
        <span>{item.cta}</span>
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  );

  return (
    <div className="space-y-10 animate-fadeIn w-full">
      {/* Top Navigation & Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-2xl p-6 sm:p-10 text-white relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <button
            type="button"
            onClick={onNavigateToDashboard}
            className="inline-flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Application Dashboard</span>
          </button>

          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs sm:text-sm font-bold px-3 py-1 rounded-full">
              <Sparkles className="h-4 w-4" />
              <span>Student Relocation Directory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white">
              Student Resources & Relocation Guide
            </h1>
            <p className="text-sm sm:text-base text-gray-200 max-w-3xl leading-relaxed">
              Applying and moving to Germany involves several mandatory steps. Here are the leading platforms and trusted services commonly used by international students for blocked accounts, health insurance, money transfers, and housing.
            </p>
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center gap-2.5 border-b border-gray-200 pb-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section 1: Blocked Account & Health Insurance */}
      {(activeCategory === 'all' || activeCategory === 'blockedAccounts') && (
        <section className="space-y-5">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <Landmark className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                1. German Blocked Accounts (€11,904) & Health Insurance
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Mandatory for your German Student Visa: Deposit €992/month and get statutory TK/DAK health cover.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PARTNER_LINKS.blockedAccounts.map((item) =>
              renderCard(
                item,
                Sparkles,
                'text-emerald-600',
                'bg-emerald-50/80 border-emerald-200 text-emerald-900'
              )
            )}
          </div>
        </section>
      )}

      {/* Section 2: Forex & International Money Transfer */}
      {(activeCategory === 'all' || activeCategory === 'forexTransfer') && (
        <section className="space-y-5 pt-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 text-blue-800 rounded-xl">
              <CircleDollarSign className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                2. International Money Transfer (Sending ₹10–12 Lakhs)
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Avoid paying 2–3% bank telegraphic transfer markups. Transfer directly to your German IBAN at real mid-market exchange rates.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PARTNER_LINKS.forexTransfer.map((item) =>
              renderCard(
                item,
                Check,
                'text-blue-600',
                'bg-blue-50/80 border-blue-200 text-blue-900'
              )
            )}
          </div>
        </section>
      )}

      {/* Section 3: Student Flights with 40kg Luggage */}
      {(activeCategory === 'all' || activeCategory === 'flightDeals') && (
        <section className="space-y-5 pt-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 text-indigo-800 rounded-xl">
              <Plane className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                3. Student Flight Bookings (Extra 10–15kg Free Luggage)
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Flying to Frankfurt (FRA) or Munich (MUC)? Student tickets include 2x23kg checked bags so you can bring winter clothes and spices from home.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PARTNER_LINKS.flightDeals.map((item) =>
              renderCard(
                item,
                Plane,
                'text-indigo-600',
                'bg-indigo-50/80 border-indigo-200 text-indigo-900'
              )
            )}
          </div>
        </section>
      )}

      {/* Section 4: German SIM & eSIM Cards */}
      {(activeCategory === 'all' || activeCategory === 'simCards') && (
        <section className="space-y-5 pt-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-teal-100 text-teal-800 rounded-xl">
              <Smartphone className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                4. German Student SIM & eSIM Cards
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                Never land without data. Download your eSIM digitally before departure or get a contract-free German Telekom SIM for €10/mo.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PARTNER_LINKS.simCards.map((item) =>
              renderCard(
                item,
                Smartphone,
                'text-teal-600',
                'bg-teal-50/80 border-teal-200 text-teal-900'
              )
            )}
          </div>
        </section>
      )}

      {/* Section 5: Student Housing & WG Finder */}
      {(activeCategory === 'all' || activeCategory === 'housing') && (
        <section className="space-y-5 pt-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
              <Home className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                5. Verified Student Housing & WGs (Scam-Free)
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">
                The hardest step in Germany: finding accommodation with City Registration (Anmeldung) support.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PARTNER_LINKS.housing.map((item) =>
              renderCard(
                item,
                ShieldCheck,
                'text-amber-600',
                'bg-amber-50/80 border-amber-200 text-amber-900'
              )
            )}
          </div>
        </section>
      )}

      {/* Pro-Tips & Anti-Scam Advisory */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center space-x-2 text-gray-900 font-bold text-base">
          <HelpCircle className="h-5 w-5 text-emerald-600" />
          <span>Student Relocation Advisory (Germany)</span>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 leading-relaxed">
          <li className="flex items-start space-x-2.5">
            <span className="font-bold text-black">•</span>
            <span><strong>Never wire money via Western Union</strong> or random PayPal accounts for housing without a verified contract and ID verification.</span>
          </li>
          <li className="flex items-start space-x-2.5">
            <span className="font-bold text-black">•</span>
            <span><strong>Always confirm &quot;Wohnungsgeberbestätigung&quot;:</strong> You need this landlord certificate to do your city registration (Anmeldung).</span>
          </li>
          <li className="flex items-start space-x-2.5">
            <span className="font-bold text-black">•</span>
            <span><strong>Double-check baggage allowance:</strong> Regular airline tickets offer only 23kg; student fares give you 40–46kg (2 bags).</span>
          </li>
          <li className="flex items-start space-x-2.5">
            <span className="font-bold text-black">•</span>
            <span><strong>Transfer blocked funds early:</strong> Wire transfers take 2–4 business days to clear into Expatrio/Fintiba escrow.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
