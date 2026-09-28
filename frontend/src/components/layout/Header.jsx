import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/clerk-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="w-full px-4 sm:px-6 lg:px-12 h-16 flex items-center justify-between">
        
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

        {/* Auth / Action Section */}
        <div className="flex items-center space-x-5">
          
          {/* LOGGED OUT STATE */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-sm font-semibold text-gray-600 hover:text-black transition-colors">
                Log in
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-black hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2 rounded transition-all shadow-sm">
                Sign up
              </button>
            </SignUpButton>
          </SignedOut>

          {/* LOGGED IN STATE */}
          <SignedIn>
            {/* Clerk's UserButton acts as the profile picture, settings menu, and logout button all in one */}
            <UserButton afterSignOutUrl="/" />
          </SignedIn>

        </div>
        
      </div>
    </header>
  );
}
