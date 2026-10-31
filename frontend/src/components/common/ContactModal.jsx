import { useState } from 'react';
import {
  X,
  Mail,
  Copy,
  Check,
  Send,
  MessageSquare,
  HelpCircle,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export default function ContactModal({ isOpen, onClose }) {
  const [copied, setCopied] = useState(false);
  const [inquiryType, setInquiryType] = useState('general');

  if (!isOpen) return null;

  const emailAddress = 'contact@unitracker.live';

  const topics = [
    {
      id: 'general',
      label: 'General Inquiry',
      subject: '[UniTracker] General Question',
    },
    {
      id: 'admission',
      label: 'German Admissions / VPD Help',
      subject: '[UniTracker] Question regarding German University Application',
    },
    {
      id: 'feature',
      label: 'Suggest Feature / University',
      subject: '[UniTracker] Feature or University Request',
    },
    {
      id: 'partnership',
      label: 'Partnership & Collaboration',
      subject: '[UniTracker] Partnership Inquiry',
    },
    {
      id: 'bug',
      label: 'Report an Issue',
      subject: '[UniTracker] Issue Report',
    },
  ];

  const currentTopic = topics.find((t) => t.id === inquiryType) || topics[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(
    currentTopic.subject
  )}&body=${encodeURIComponent(
    `Hi UniTracker Team,\n\n[Please write your message here]\n\nBest regards,\n`
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-gray-100 relative space-y-5"
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

        {/* Modal Header */}
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
            <Mail className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Support & Inquiries
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
              Get in Touch with UniTracker
            </h3>
            <p className="text-xs text-gray-500">
              Have questions, feedback, or need guidance? We're here to help.
            </p>
          </div>
        </div>

        {/* Email Address Highlight Card */}
        <div className="p-4 bg-gray-50 border border-gray-200/80 rounded-2xl space-y-2.5">
          <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
            Official Email Address
          </div>

          <div className="flex items-center justify-between gap-2 bg-white border border-gray-200 p-2.5 rounded-xl">
            <div className="flex items-center space-x-2 text-sm font-bold text-gray-900 truncate">
              <Mail className="h-4 w-4 text-emerald-600 shrink-0" />
              <span className="select-all font-mono text-xs sm:text-sm">
                {emailAddress}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-700 border-gray-200"
              title="Copy email address"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-gray-500" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Topic Selector */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700">
            What are you contacting us about?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {topics.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setInquiryType(t.id)}
                className={`text-left px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                  inquiryType === t.id
                    ? 'bg-black text-white border-black shadow-2xs font-semibold'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <a
            href={mailtoUrl}
            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all shadow-sm cursor-pointer"
          >
            <Send className="h-4 w-4 text-emerald-400" />
            <span>Open in Mail App (Compose Email)</span>
            <ExternalLink className="h-3.5 w-3.5 opacity-60 ml-0.5" />
          </a>

          <p className="text-[11px] text-gray-400 text-center flex items-center justify-center space-x-1 pt-1">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600 inline" />
            <span>Expected response time: Usually within 24 hours.</span>
          </p>
        </div>
      </div>
    </div>
  );
}
