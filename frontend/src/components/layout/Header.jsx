import { useState, useEffect } from 'react';
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';
import { Calculator, LayoutDashboard, Smartphone } from 'lucide-react';
import InstallAppModal from '../common/InstallAppModal';

export default function Header({ currentView = 'dashboard', onNavigate }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);

  useEffect(() => {
    // Check if running in standalone PWA mode
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
      setIsStandalone(true);
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

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

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="w-full px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between">
          
          {/* Logo Section */}
          <div
            onClick={() => onNavigate && onNavigate('dashboard')}
            className="flex items-center cursor-pointer pl-1 sm:pl-4 select-none"
            title="UniTracker Dashboard"
          >
            <div className="relative flex items-center justify-center w-8 h-8 mt-2 -mr-1">
               <span 
                 className="absolute font-bold text-[1.15rem]" 
                 style={{ color: '#000000', transform: 'rotate(-90deg)' }}
               >
                 uni
               </span>
            </div>
            <h1 
              className="font-bold text-3xl sm:text-4xl m-0" 
              style={{ color: '#000000', letterSpacing: '-0.05em', lineHeight: '1' }}
            >
              tracker
            </h1>
          </div>

          {/* Middle Nav Section (Between Logo and Auth) */}
          <nav className="flex items-center space-x-1 sm:space-x-2">
            <button
              type="button"
              onClick={() => onNavigate && onNavigate('dashboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                currentView === 'dashboard'
                  ? 'bg-black text-white shadow-2xs'
                  : 'text-gray-600 hover:text-black hover:bg-gray-100'
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Applications</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate && onNavigate('calculator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer ${
                currentView === 'calculator'
                  ? 'bg-black text-white shadow-2xs'
                  : 'text-gray-600 hover:text-black hover:bg-gray-100'
              }`}
            >
              <Calculator className="h-3.5 w-3.5" />
              <span>Grade Calculator</span>
            </button>

            {/* PWA Install Button (visible unless already running as standalone installed PWA) */}
            {!isStandalone && (
              <button
                type="button"
                onClick={handleInstallClick}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/80 transition-all cursor-pointer"
                title="Install UniTracker on your phone or desktop"
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Install App</span>
                <span className="inline md:hidden">App</span>
              </button>
            )}
          </nav>

          {/* Auth / Action Section */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* LOGGED OUT STATE */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-xs sm:text-sm font-semibold text-gray-600 hover:text-black transition-colors cursor-pointer">
                Log in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-black hover:bg-gray-800 text-white text-xs sm:text-sm font-semibold px-3.5 sm:px-5 py-2 rounded-lg transition-all shadow-sm cursor-pointer">
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

    <InstallAppModal
      isOpen={showInstallModal}
      onClose={() => setShowInstallModal(false)}
    />
  </>
  );
}
