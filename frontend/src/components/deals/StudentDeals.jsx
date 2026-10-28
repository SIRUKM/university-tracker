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
    { id: 'all', label: 'All Deals 🎁', icon: Gift },
    { id: 'blockedAccounts', label: 'Blocked Account (€11,904)', icon: Landmark },
    { id: 'forexTransfer', label: 'Forex & Money Transfer', icon: CircleDollarSign },
    { id: 'flightDeals', label: 'Student Flights (40kg Bag)', icon: Plane },
    { id: 'simCards', label: 'German SIM & eSIM', icon: Smartphone },
    { id: 'housing', label: 'Student Housing & WG', icon: Home },
  ];

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Top Navigation & Header Banner */}
      <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-black rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden shadow-lg">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <button
            type="button"
            onClick={onNavigateToDashboard}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Application Dashboard</span>
          </button>

          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold px-3 py-1 rounded-full">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Verified German Student Partner Discounts</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Student Perks & Relocation Directory
            </h1>
            <p className="text-gray-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Applying and moving to Germany comes with high mandatory costs. We have partnered with official providers to offer students fee discounts, free travel covers, extra flight luggage, and zero-fee money transfers.
            </p>
          </div>
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-white hover:bg-gray-100 text-gray-700 border border-gray-200'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Section 1: Blocked Account & Health Insurance */}
      {(activeCategory === 'all' || activeCategory === 'blockedAccounts') && (
        <section className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-emerald-100 text-emerald-800 rounded-lg">
              <Landmark className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                1. German Blocked Accounts (€11,904) & Health Insurance
              </h2>
              <p className="text-xs text-gray-500">
                Mandatory for your German Student Visa: Deposit €992/month and get statutory TK/DAK health cover.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PARTNER_LINKS.blockedAccounts.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}
                    >
                      {item.tag}
                    </span>
                    <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                  </div>

                  <h3 className="text-sm font-bold text-gray-900">{item.name}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-2.5 text-[11px] text-emerald-900 font-medium flex items-center space-x-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span>{item.perk}</span>
                  </div>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-1.5 bg-black hover:bg-gray-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
                >
                  <span>{item.cta}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section 2: Forex & International Money Transfer */}
      {(activeCategory === 'all' || activeCategory === 'forexTransfer') && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-100 text-blue-800 rounded-lg">
              <CircleDollarSign className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                2. International Money Transfer (Sending ₹10–12 Lakhs)
              </h2>
              <p className="text-xs text-gray-500">
                Avoid paying 2–3% bank telegraphic transfer markups. Transfer directly to your German IBAN at real mid-market exchange rates.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PARTNER_LINKS.forexTransfer.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <span
                    className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}
                  >
                    {item.tag}
                  </span>

                  <h3 className="text-sm font-bold text-gray-900">{item.name}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="bg-blue-50/70 border border-blue-200/80 rounded-xl p-2.5 text-[11px] text-blue-900 font-medium flex items-center space-x-1.5">
                    <Check className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                    <span>{item.perk}</span>
                  </div>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-1.5 bg-black hover:bg-gray-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
                >
                  <span>{item.cta}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section 3: Student Flights with 40kg Luggage */}
      {(activeCategory === 'all' || activeCategory === 'flightDeals') && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-indigo-100 text-indigo-800 rounded-lg">
              <Plane className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                3. Student Flight Bookings (Extra 10–15kg Free Luggage)
              </h2>
              <p className="text-xs text-gray-500">
                Flying to Frankfurt (FRA) or Munich (MUC)? Student tickets include 2x23kg checked bags so you can bring winter clothes and spices from home.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PARTNER_LINKS.flightDeals.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <span
                    className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}
                  >
                    {item.tag}
                  </span>

                  <h3 className="text-sm font-bold text-gray-900">{item.name}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="bg-indigo-50/70 border border-indigo-200/80 rounded-xl p-2.5 text-[11px] text-indigo-900 font-medium flex items-center space-x-1.5">
                    <Plane className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                    <span>{item.perk}</span>
                  </div>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-1.5 bg-black hover:bg-gray-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
                >
                  <span>{item.cta}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section 4: German SIM & eSIM Cards */}
      {(activeCategory === 'all' || activeCategory === 'simCards') && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-teal-100 text-teal-800 rounded-lg">
              <Smartphone className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                4. German Student SIM & eSIM Cards
              </h2>
              <p className="text-xs text-gray-500">
                Never land without data. Download your eSIM digitally before departure or get a contract-free German Telekom SIM for €10/mo.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PARTNER_LINKS.simCards.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <span
                    className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}
                  >
                    {item.tag}
                  </span>

                  <h3 className="text-sm font-bold text-gray-900">{item.name}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="bg-teal-50/70 border border-teal-200/80 rounded-xl p-2.5 text-[11px] text-teal-900 font-medium flex items-center space-x-1.5">
                    <Smartphone className="h-3.5 w-3.5 text-teal-600 shrink-0" />
                    <span>{item.perk}</span>
                  </div>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-1.5 bg-black hover:bg-gray-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
                >
                  <span>{item.cta}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Section 5: Student Housing & WG Finder */}
      {(activeCategory === 'all' || activeCategory === 'housing') && (
        <section className="space-y-4 pt-4">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
              <Home className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">
                5. Verified Student Housing & WGs (Scam-Free)
              </h2>
              <p className="text-xs text-gray-500">
                The hardest step in Germany: finding accommodation with City Registration (Anmeldung) support.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PARTNER_LINKS.housing.map((item) => (
              <div
                key={item.id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <span
                    className={`inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}
                  >
                    {item.tag}
                  </span>

                  <h3 className="text-sm font-bold text-gray-900">{item.name}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-2.5 text-[11px] text-amber-900 font-medium flex items-center space-x-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                    <span>{item.perk}</span>
                  </div>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-1.5 bg-black hover:bg-gray-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
                >
                  <span>{item.cta}</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Pro-Tips & Anti-Scam Advisory */}
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 space-y-3">
        <div className="flex items-center space-x-2 text-gray-900 font-bold text-sm">
          <HelpCircle className="h-4 w-4 text-emerald-600" />
          <span>Student Relocation Advisory (Germany)</span>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-gray-600">
          <li className="flex items-start space-x-2">
            <span className="font-bold text-black">•</span>
            <span><strong>Never wire money via Western Union</strong> or random PayPal accounts for housing without a verified contract and ID verification.</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-bold text-black">•</span>
            <span><strong>Always confirm "Wohnungsgeberbestätigung":</strong> You need this landlord certificate to do your city registration (Anmeldung).</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-bold text-black">•</span>
            <span><strong>Double-check baggage allowance:</strong> Regular airline tickets offer only 23kg; student fares give you 40–46kg (2 bags).</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="font-bold text-black">•</span>
            <span><strong>Transfer blocked funds early:</strong> Wire transfers take 2–4 business days to clear into Expatrio/Fintiba escrow.</span>
          </li>
        </ul>
      </div>

      {/* Affiliate Transparency Note */}
      <div className="text-center pt-2 pb-6">
        <p className="text-[11px] text-gray-400">
          UniTracker is 100% free for students. Some links are partner/affiliate links that offer student discounts and support our hosting at no cost to you.
        </p>
      </div>
    </div>
  );
}
