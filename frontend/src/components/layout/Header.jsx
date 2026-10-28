import { useState, useEffect } from 'react';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/clerk-react';
import {
  Calculator,
  LayoutDashboard,
  Smartphone,
  Gift,
  Compass,
  Menu,
  X,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import InstallAppModal from '../common/InstallAppModal';

export default function Header({ currentView = 'dashboard', onNavigate }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if running in standalone PWA mode
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true
    ) {
      setIsStandalone(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () =>
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    } else {
      setShowInstallModal(true);
    }
  };

  const handleNavClick = (view) => {
    setIsMobileMenuOpen(false);
    if (onNavigate) onNavigate(view);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-2xs">
        <div className="w-full px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between">
          {/* Left Section: Mobile Hamburger + Brand Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Hamburger Button (Visible on mobile & tablet: hidden on lg screens) */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-1 text-gray-700 hover:text-black hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              title="Open Navigation Menu"
              aria-label="Open Navigation Menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Brand Logo */}
            <div
              onClick={() => handleNavClick('dashboard')}
              className="flex items-center cursor-pointer select-none"
              title="UniTracker Dashboard"
            >
              <div className="relative flex items-center justify-center w-7 sm:w-8 h-7 sm:h-8 mt-1.5 -mr-1">
                <span
                  className="absolute font-bold text-[1rem] sm:text-[1.15rem]"
                  style={{ color: '#000000', transform: 'rotate(-90deg)' }}
                >
                  uni
                </span>
              </div>
              <h1
                className="font-bold text-2xl sm:text-3xl md:text-4xl m-0 tracking-tight"
                style={{ color: '#000000', letterSpacing: '-0.05em', lineHeight: '1' }}
              >
                tracker
              </h1>
            </div>
          </div>

          {/* Desktop Middle Navigation (Hidden on mobile/tablet, visible on lg screens) */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            <button
              type="button"
              onClick={() => handleNavClick('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                currentView === 'dashboard'
                  ? 'bg-black text-white shadow-2xs'
                  : 'text-gray-600 hover:text-black hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Applications</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('journey')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                currentView === 'journey'
                  ? 'bg-black text-white shadow-2xs'
                  : 'text-gray-600 hover:text-black hover:bg-gray-100'
              }`}
            >
              <Compass className="h-3.5 w-3.5" />
              <span>My Journey</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('calculator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                currentView === 'calculator'
                  ? 'bg-black text-white shadow-2xs'
                  : 'text-gray-600 hover:text-black hover:bg-gray-100'
              }`}
            >
              <Calculator className="h-3.5 w-3.5" />
              <span>Grade Calculator</span>
            </button>

            <button
              type="button"
              onClick={() => handleNavClick('deals')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                currentView === 'deals'
                  ? 'bg-black text-white shadow-2xs'
                  : 'text-gray-600 hover:text-black hover:bg-gray-100'
              }`}
            >
              <Gift className="h-3.5 w-3.5 text-amber-500" />
              <span>Student Deals</span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                Perks
              </span>
            </button>

            {/* PWA Install Button on Desktop */}
            {!isStandalone && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-all cursor-pointer"
                title="Install UniTracker on your laptop or mobile"
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span>Install App</span>
              </button>
            )}
          </nav>

          {/* Right Action Section: Install Shortcut (Mobile) + Auth Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Quick Install Pill for Mobile (Compact icon) */}
            {!isStandalone && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="lg:hidden p-2 text-emerald-700 bg-emerald-50 border border-emerald-200/80 rounded-xl hover:bg-emerald-100 transition-colors cursor-pointer"
                title="Install UniTracker Mobile App"
              >
                <Smartphone className="h-4 w-4" />
              </button>
            )}

            {/* LOGGED OUT STATE */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-xs sm:text-sm font-semibold text-gray-600 hover:text-black transition-colors px-2 py-1.5 cursor-pointer">
                  Log in
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-black hover:bg-gray-800 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all shadow-xs cursor-pointer">
                  Sign up
                </button>
              </SignUpButton>
            </SignedOut>

            {/* LOGGED IN STATE */}
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </header>

      {/* MOBILE SLIDE-OVER DRAWER MENU */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity lg:hidden animate-fadeIn"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          {/* Drawer Panel */}
          <div
            className="fixed inset-y-0 left-0 w-[290px] max-w-[85vw] bg-white shadow-2xl z-50 flex flex-col justify-between p-5 transform transition-transform duration-300 ease-out"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Top */}
            <div className="space-y-5">
              {/* Drawer Header with Logo and Close Button */}
              <div className="flex items-center justify-between pb-3.5 border-b border-gray-100">
                <div
                  onClick={() => handleNavClick('dashboard')}
                  className="flex items-center cursor-pointer select-none"
                >
                  <div className="relative flex items-center justify-center w-7 h-7 mt-1 -mr-1">
                    <span
                      className="absolute font-bold text-[1rem]"
                      style={{ color: '#000000', transform: 'rotate(-90deg)' }}
                    >
                      uni
                    </span>
                  </div>
                  <h1
                    className="font-bold text-2xl m-0 tracking-tight"
                    style={{ color: '#000000', letterSpacing: '-0.05em', lineHeight: '1' }}
                  >
                    tracker
                  </h1>
                </div>

                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
                  title="Close Menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1.5">
                <button
                  type="button"
                  onClick={() => handleNavClick('dashboard')}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentView === 'dashboard'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <LayoutDashboard className="h-4 w-4" />
                    <span>Applications Tracker</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick('journey')}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentView === 'journey'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Compass className="h-4 w-4" />
                    <span>My Journey (Roadmap)</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      currentView === 'journey'
                        ? 'bg-white/20 text-white'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    P1–P7
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick('calculator')}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentView === 'calculator'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Calculator className="h-4 w-4" />
                    <span>Grade Calculator</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 opacity-60" />
                </button>

                <button
                  type="button"
                  onClick={() => handleNavClick('deals')}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    currentView === 'deals'
                      ? 'bg-black text-white shadow-xs'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-black'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Gift className="h-4 w-4 text-amber-500" />
                    <span>Student Deals & Perks</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      currentView === 'deals'
                        ? 'bg-white/20 text-white'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    Perks 🎁
                  </span>
                </button>

                {/* Install App Button in Drawer */}
                {!isStandalone && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleInstallClick();
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-all cursor-pointer mt-2"
                  >
                    <div className="flex items-center space-x-3">
                      <Smartphone className="h-4 w-4 text-emerald-600" />
                      <span>Install App (PWA)</span>
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-200/80 text-emerald-900">
                      Add to Phone
                    </span>
                  </button>
                )}
              </nav>
            </div>

            {/* Drawer Bottom Auth Section */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <SignedOut>
                <div className="grid grid-cols-2 gap-2">
                  <SignInButton mode="modal">
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-center py-2.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 cursor-pointer"
                    >
                      Log in
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full text-center py-2.5 rounded-xl bg-black text-white text-xs font-semibold hover:bg-gray-800 cursor-pointer"
                    >
                      Sign up
                    </button>
                  </SignUpButton>
                </div>
              </SignedOut>

              <SignedIn>
                <div className="flex items-center justify-between p-2.5 bg-gray-50 rounded-xl">
                  <span className="text-xs text-gray-700 font-semibold">Your Account</span>
                  <UserButton afterSignOutUrl="/" />
                </div>
              </SignedIn>

              <p className="text-[10px] text-gray-400 text-center">
                UniTracker • German Master's Application Tracker
              </p>
            </div>
          </div>
        </div>
      )}

      {/* PWA Install Modal */}
      <InstallAppModal
        isOpen={showInstallModal}
        onClose={() => setShowInstallModal(false)}
        deferredPrompt={deferredPrompt}
        onTriggerPrompt={handleInstallClick}
      />
    </>
  );
}
