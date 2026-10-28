import { Smartphone, Download, Share, PlusSquare, X, Check, Laptop, Monitor, Sparkles } from 'lucide-react';

export default function InstallAppModal({
  isOpen,
  onClose,
  deferredPrompt,
  onTriggerPrompt,
}) {
  if (!isOpen) return null;

  const isIOS =
    typeof navigator !== 'undefined' &&
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !window.MSStream;

  const isMacSafari =
    typeof navigator !== 'undefined' &&
    /Macintosh/.test(navigator.userAgent) &&
    /Safari/.test(navigator.userAgent) &&
    !/Chrome|Chromium|Edg/.test(navigator.userAgent);

  const isAndroid =
    typeof navigator !== 'undefined' && /Android/.test(navigator.userAgent);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-black p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          title="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
            <Smartphone className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
              Install UniTracker App
            </h3>
            <p className="text-xs text-gray-500">
              Works as a fast, standalone app on your phone and laptop
            </p>
          </div>
        </div>

        {/* If programmatic native install prompt is ready (Chrome / Android / Edge) */}
        {deferredPrompt && onTriggerPrompt ? (
          <div className="space-y-3 bg-emerald-50/70 border border-emerald-200/80 p-4 rounded-2xl text-xs text-emerald-950">
            <div className="flex items-center space-x-2 font-bold text-emerald-900">
              <Sparkles className="h-4 w-4 text-emerald-600" />
              <span>One-Click Native Install Available</span>
            </div>
            <p className="text-emerald-800 leading-relaxed">
              Your browser supports direct installation. Click below to add UniTracker directly to your Home Screen or Applications folder.
            </p>
            <button
              type="button"
              onClick={onTriggerPrompt}
              className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-sm cursor-pointer"
            >
              <Download className="h-4 w-4 text-emerald-400" />
              <span>Install to Device Now</span>
            </button>
          </div>
        ) : null}

        {/* Platform-Specific Manual Instructions */}
        {isIOS ? (
          /* iPhone / iPad Safari */
          <div className="space-y-3.5 bg-gray-50 p-4 rounded-2xl border border-gray-200/80 text-xs text-gray-700">
            <p className="font-bold text-gray-900 flex items-center space-x-1.5">
              <Smartphone className="h-3.5 w-3.5 text-blue-600" />
              <span>2 Easy Steps on iPhone / iPad (Safari):</span>
            </p>
            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                1
              </div>
              <div className="flex-1 leading-snug">
                <span>Tap the </span>
                <span className="inline-flex items-center font-bold text-black bg-white px-1.5 py-0.5 rounded border border-gray-300">
                  <Share className="h-3 w-3 mr-1 inline text-blue-600" /> Share
                </span>
                <span> button in the bottom Safari toolbar.</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5">
                2
              </div>
              <div className="flex-1 leading-snug">
                <span>Scroll down and select </span>
                <span className="inline-flex items-center font-bold text-black bg-white px-1.5 py-0.5 rounded border border-gray-300">
                  <PlusSquare className="h-3 w-3 mr-1 inline text-emerald-600" /> Add to Home Screen
                </span>
                <span>.</span>
              </div>
            </div>
          </div>
        ) : isMacSafari ? (
          /* Mac Safari */
          <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-200/80 text-xs text-gray-700">
            <p className="font-bold text-gray-900 flex items-center space-x-1.5">
              <Laptop className="h-3.5 w-3.5 text-gray-800" />
              <span>On macOS Safari:</span>
            </p>
            <p className="leading-relaxed">
              In your Mac's top menu bar, click <strong>File</strong> → select{' '}
              <strong className="text-black bg-white px-1.5 py-0.5 rounded border border-gray-300">
                Add to Dock...
              </strong>
            </p>
          </div>
        ) : (
          /* Laptop Chrome / Edge or Android */
          <div className="space-y-3 bg-gray-50 p-4 rounded-2xl border border-gray-200/80 text-xs text-gray-700">
            <p className="font-bold text-gray-900 flex items-center space-x-1.5">
              {isAndroid ? (
                <Smartphone className="h-3.5 w-3.5 text-emerald-600" />
              ) : (
                <Monitor className="h-3.5 w-3.5 text-gray-800" />
              )}
              <span>{isAndroid ? 'On Android (Chrome):' : 'On Laptop / Desktop (Chrome, Edge):'}</span>
            </p>
            <p className="leading-relaxed">
              {isAndroid ? (
                <>
                  Tap the browser menu (<strong>⋮</strong> in the top-right corner) and tap{' '}
                  <strong className="text-black bg-white px-1.5 py-0.5 rounded border border-gray-300">
                    Install App
                  </strong>{' '}
                  or <strong>Add to Home screen</strong>.
                </>
              ) : (
                <>
                  Click the install icon (
                  <strong className="text-black font-mono">⊕</strong> or{' '}
                  <Download className="h-3 w-3 inline text-blue-600" />) on the right side of your
                  browser's address bar, then click <strong>Install</strong>.
                </>
              )}
            </p>
          </div>
        )}

        {/* Perks of Installing */}
        <div className="space-y-2 pt-1 text-xs text-gray-600">
          <div className="flex items-center space-x-2">
            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Opens like a native app (zero browser address bar or clutter)</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Direct icon on your Phone Home Screen & Laptop Dock</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Loads instantly with offline caching capabilities</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
}
