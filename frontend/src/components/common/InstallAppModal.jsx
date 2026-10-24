import { useState, useEffect } from 'react';
import { Smartphone, Download, Share, PlusSquare, X, Check } from 'lucide-react';

export default function InstallAppModal({ isOpen, onClose }) {
  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div 
        className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          title="Close"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center shrink-0 shadow-md">
            <Smartphone className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900">Install UniTracker App</h3>
            <p className="text-xs text-gray-500">Access your applications anytime right from your home screen</p>
          </div>
        </div>

        {/* Instructions */}
        {isIOS ? (
          <div className="space-y-3.5 bg-gray-50 p-4 rounded-xl border border-gray-200/80 text-xs text-gray-700">
            <p className="font-semibold text-gray-900">Follow these 2 quick steps on iPhone / iPad Safari:</p>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                1
              </div>
              <div className="flex-1">
                <span>Tap the </span>
                <span className="inline-flex items-center font-bold text-black bg-white px-1.5 py-0.5 rounded border border-gray-300">
                  <Share className="h-3 w-3 mr-1 inline text-blue-600" /> Share
                </span>
                <span> button in the Safari bottom toolbar.</span>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                2
              </div>
              <div className="flex-1">
                <span>Scroll down and tap </span>
                <span className="inline-flex items-center font-bold text-black bg-white px-1.5 py-0.5 rounded border border-gray-300">
                  <PlusSquare className="h-3 w-3 mr-1 inline text-emerald-600" /> Add to Home Screen
                </span>
                <span>.</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-200/80 text-xs text-gray-700">
            <p className="font-semibold text-gray-900">On Android / Chrome / Edge:</p>
            <p>
              Tap the browser menu (<strong>⋮</strong> or <strong>⋯</strong> in the top-right corner) and select{' '}
              <strong className="text-black">"Install App"</strong> or <strong className="text-black">"Add to Home screen"</strong>.
            </p>
          </div>
        )}

        <div className="space-y-2 pt-1 text-[11px] text-gray-500">
          <div className="flex items-center space-x-2">
            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Opens instantly like a native app (no browser search bar)</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Works smoothly on low signal and offline</span>
          </div>
          <div className="flex items-center space-x-2">
            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
            <span>Free forever with zero app store downloads needed</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="w-full bg-black hover:bg-gray-800 text-white font-semibold py-2.5 rounded-xl text-xs transition-colors cursor-pointer"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
