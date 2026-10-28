/**
 * UniTracker Partner & Affiliate Links Configuration
 * ----------------------------------------------------
 * When your partner applications are approved, simply replace the 'url' fields
 * below with your personalized affiliate tracking URLs.
 * 
 * All buttons across the Germany Roadmap, Student Deals directory, and 
 * Admission Celebration modals will automatically update across the entire app!
 */

export const AFFILIATE_CATEGORIES = {
  BLOCKED_ACCOUNT: 'blocked_account',
  FOREX: 'forex',
  FLIGHTS: 'flights',
  SIM_CARDS: 'sim_cards',
  HOUSING: 'housing',
};

export const PARTNER_LINKS = {
  // 1. Blocked Account & Health Insurance (Mandatory €11,904 visa deposit)
  blockedAccounts: [
    {
      id: 'expatrio',
      name: 'Expatrio Value Package',
      tag: 'Most Popular • Free ISIC Card',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      description: 'Federal Foreign Office approved Blocked Account + TK Statutory Health Insurance + Free incoming travel cover + €150 cashback potential.',
      cta: 'Open Expatrio Blocked Account',
      // REPLACE with your approved affiliate tracking URL:
      url: 'https://www.expatrio.com/xp-value-package?utm_source=unitracker.live&utm_medium=affiliate',
      perk: 'Free Travel Insurance & €150 Value Package Bonus',
    },
    {
      id: 'fintiba',
      name: 'Fintiba Plus Package',
      tag: 'Instant Sutor Bank Account',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
      description: 'Official German Blocked Account with instant digital visa blocking confirmation document + DAK/MAWISTA public health cover.',
      cta: 'Open Fintiba Plus',
      // REPLACE with your approved affiliate tracking URL:
      url: 'https://www.fintiba.com/fintiba-plus/?utm_source=unitracker.live&utm_medium=affiliate',
      perk: 'Instant Blocking Confirmation for VFS Appointment',
    },
    {
      id: 'coracle',
      name: 'Coracle Prime',
      tag: 'Lowest Setup Fee (€59)',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
      description: 'Zero monthly account maintenance fee + free incoming travel insurance for enrollment and visa stamping.',
      cta: 'Explore Coracle Prime',
      // REPLACE with your approved affiliate tracking URL:
      url: 'https://www.coracle.de/prime?utm_source=unitracker.live&utm_medium=affiliate',
      perk: 'No Monthly Fees + €59 One-time Setup',
    },
  ],

  // 2. International Money Transfer & Forex (Sending ₹10–12 Lakhs to Germany)
  forexTransfer: [
    {
      id: 'wise',
      name: 'Wise (formerly TransferWise)',
      tag: 'Zero Markup • Real Exchange Rate',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      description: 'Transfer your ₹10–12 Lakhs blocked amount directly to Expatrio/Fintiba German IBAN with zero exchange markup and instant tracking.',
      cta: 'Transfer with Wise (Zero Fee)',
      // REPLACE with your approved affiliate tracking URL:
      url: 'https://wise.com/?utm_source=unitracker.live&utm_medium=affiliate',
      perk: 'First transfer free up to €500 / ₹50,000',
    },
    {
      id: 'remitly',
      name: 'Remitly Education Forex',
      tag: 'Fast & Secure Bank Wire',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
      description: 'Special student remittance corridors directly from Indian/international bank accounts to European banking partners.',
      cta: 'Check Remitly Rates',
      // REPLACE with your approved affiliate tracking URL:
      url: 'https://www.remitly.com/?utm_source=unitracker.live&utm_medium=affiliate',
      perk: 'Guaranteed delivery time or fee refunded',
    },
    {
      id: 'instarem',
      name: 'Instarem Currency Transfer',
      tag: 'Low FX Spread + Reward Points',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      description: 'Competitive foreign exchange margins with InstaPoints rewards on large educational transfers for blocked accounts.',
      cta: 'Send via Instarem',
      // REPLACE with your approved affiliate tracking URL:
      url: 'https://www.instarem.com/?utm_source=unitracker.live&utm_medium=affiliate',
      perk: 'Instant tracking & zero hidden fees',
    },
  ],

  // 3. Student Flights with Extra Baggage Allowance (30–40kg)
  flightDeals: [
    {
      id: 'studentuniverse',
      name: 'StudentUniverse Flights',
      tag: 'Up to 40kg Student Luggage',
      badgeColor: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      description: 'Exclusive negotiated flight fares for students with Lufthansa, Emirates, Qatar Airways, British Airways with double checked-in luggage (2x23kg).',
      cta: 'Search Student Flights',
      // REPLACE with your approved affiliate tracking URL:
      url: 'https://www.studentuniverse.com/?utm_source=unitracker.live&utm_medium=affiliate',
      perk: 'Extra 10–15kg free student baggage allowance',
    },
    {
      id: 'skyscanner',
      name: 'Skyscanner Flight Comparison',
      tag: 'Cheapest Direct Routes',
      badgeColor: 'bg-sky-50 text-sky-800 border-sky-200',
      description: 'Compare all flights to Frankfurt (FRA), Munich (MUC), Berlin (BER), and Hamburg (HAM) across multiple booking sites.',
      cta: 'Compare Airline Fares',
      // REPLACE with your approved affiliate tracking URL:
      url: 'https://www.skyscanner.net/?utm_source=unitracker.live&utm_medium=affiliate',
      perk: 'Real-time fare comparison across 100+ airlines',
    },
  ],
  // Alias for compatibility
  get flights() {
    return this.flightDeals;
  },

  // 4. German Student SIM & eSIM Cards
  simCards: [
    {
      id: 'airalo',
      name: 'Airalo Germany eSIM',
      tag: 'Instant 5G Data Upon Landing',
      badgeColor: 'bg-teal-50 text-teal-800 border-teal-200',
      description: 'Download your eSIM digitally before flying. As soon as your flight touches down in Germany, you have instant WhatsApp, Google Maps & Uber access.',
      cta: 'Get Germany eSIM ($4.50+)',
      // REPLACE with your approved affiliate tracking URL:
      url: 'https://www.airalo.com/germany-esim?utm_source=unitracker.live&utm_medium=affiliate',
      perk: '100% digital install with zero physical SIM swapping',
    },
    {
      id: 'fraenk',
      name: 'Fraenk (Telekom Network)',
      tag: '€10/month • No Contract',
      badgeColor: 'bg-pink-50 text-pink-800 border-pink-200',
      description: 'The favorite SIM among students in Germany: 12GB+ high-speed D-Netz (Telekom), unlimited calls/SMS in Germany & EU, cancel monthly anytime.',
      cta: 'View Fraenk SIM Plans',
      // REPLACE with your approved affiliate tracking URL:
      url: 'https://fraenk.de/?utm_source=unitracker.live&utm_medium=affiliate',
      perk: 'Best German 5G network coverage with monthly cancel option',
    },
    {
      id: 'lebara',
      name: 'Lebara Germany Prepaid',
      tag: 'Free International Calling Mins',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
      description: 'Low-cost prepaid student plans featuring included international calling minutes back home to India, USA, and 50+ countries.',
      cta: 'Order Free Prepaid SIM',
      // REPLACE with your approved affiliate tracking URL:
      url: 'https://mobile.lebara.com/de/en/?utm_source=unitracker.live&utm_medium=affiliate',
      perk: 'Includes 100–500 free international call minutes',
    },
  ],

  // 5. Student Accommodation & WG (Shared Flat Search)
  housing: [
    {
      id: 'amberstudent',
      name: 'AmberStudent Housing',
      tag: 'Verified Student Dorms & Studios',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      description: '100% verified student private apartments, single rooms, and studios near top German universities with zero scam risk and city registration (Anmeldung) support.',
      cta: 'Find Student Rooms',
      // REPLACE with your approved affiliate tracking URL:
      url: 'https://amberstudent.com/?utm_source=unitracker.live&utm_medium=affiliate',
      perk: 'Anmeldung (City Registration) eligible accommodation',
    },
    {
      id: 'housinganywhere',
      name: 'HousingAnywhere',
      tag: 'Secure Online Booking',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      description: 'Mid-term furnished student room rentals in Munich, Berlin, Aachen, Stuttgart. Rent is protected until 48 hours after you move in.',
      cta: 'Search Furnished WGs',
      // REPLACE with your approved affiliate tracking URL:
      url: 'https://housinganywhere.com/?utm_source=unitracker.live&utm_medium=affiliate',
      perk: '48-hour buyer protection against fraud & fake listings',
    },
  ],
};
