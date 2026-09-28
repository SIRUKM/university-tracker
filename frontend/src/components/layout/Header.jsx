import { useState } from 'react';
import { Settings, LogOut } from 'lucide-react';

export default function Header() {
  // Temporary state to preview the logged-in vs logged-out UI
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo Section - untouched */}
        <div className="flex items-center cursor-pointer pl-4">
          <div className="relative flex items-center justify-center w-8 h-8 mt-2 -mr-1">
             <span 
               className="absolute font-bold text-[1.15rem]" 
               style={{ color: '#000000', transform: 'rotate(-90deg)' }}
             >
               uni
             </span>
          </div>
          <h1 
            className="font-bold text-4xl m-0" 
            style={{ color: '#000000', letterSpacing: '-0.05em', lineHeight: '1' }}
          >
            tracker
          </h1>
        </div>

        {/* DEV ONLY: Temporary toggle button (Delete this when connecting to Java backend) */}
        <button 
          onClick={() => setIsLoggedIn(!isLoggedIn)} 
          className="hidden md:block text-xs font-mono bg-purple-100 text-purple-700 px-3 py-1 rounded-full border border-purple-200 hover:bg-purple-200 transition-colors"
        >
          Toggle Auth UI
        </button>

        {/* Auth / Action Section */}
        <div className="flex items-center space-x-5">
          {isLoggedIn ? (
            // LOGGED IN STATE
            <div className="flex items-center space-x-5">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-bold text-sm shadow-sm">
                  U
                </div>
                <span className="font-semibold text-sm text-gray-800">Hi, Upkar</span>
              </div>
              <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <button className="text-gray-400 hover:text-black transition-colors" title="Settings">
                  <Settings className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => setIsLoggedIn(false)}
                  className="text-gray-400 hover:text-red-500 transition-colors" 
                  title="Log out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          ) : (
            // LOGGED OUT STATE
            <>
              <button 
                onClick={() => setIsLoggedIn(true)}
                className="text-sm font-semibold text-gray-600 hover:text-black transition-colors"
              >
                Log in
              </button>
              <button 
                onClick={() => setIsLoggedIn(true)}
                className="bg-black hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2 rounded transition-all shadow-sm"
              >
                Sign up
              </button>
            </>
          )}
        </div>
        
      </div>
    </header>
  );
}
