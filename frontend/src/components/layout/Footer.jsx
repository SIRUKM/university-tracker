import { GraduationCap, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-gray-100">
          
          {/* Brand & Tagline */}
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <div className="bg-black text-white p-1.5 rounded-lg">
                <GraduationCap className="h-4 w-4" />
              </div>
              <span className="font-bold text-gray-900 tracking-tight text-base">
                UniTracker
              </span>
            </div>
            <p className="text-xs text-gray-500 max-w-sm">
              Streamlined application management and deadline tracking for German university admissions.
            </p>
          </div>

          {/* Useful Official Portals */}
          <div className="flex flex-wrap items-center gap-6 text-xs font-medium text-gray-600">
            <a
              href="https://www.daad.de/en/studying-in-germany/universities/all-degree-programmes/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition-colors flex items-center space-x-1"
            >
              <span>DAAD Programs</span>
              <ExternalLink className="h-3 w-3 text-gray-400" />
            </a>
            <a
              href="https://my.uni-assist.de/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition-colors flex items-center space-x-1"
            >
              <span>Uni-Assist Portal</span>
              <ExternalLink className="h-3 w-3 text-gray-400" />
            </a>
            <a
              href="https://anabin.kmk.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-black transition-colors flex items-center space-x-1"
            >
              <span>Anabin Database</span>
              <ExternalLink className="h-3 w-3 text-gray-400" />
            </a>
          </div>
        </div>

        {/* Affiliate Disclosure */}
        <div className="py-4 border-b border-gray-100 text-[11px] text-gray-400 leading-relaxed">
          <p>
            <strong className="text-gray-500 font-semibold">Affiliate Disclosure:</strong> UniTracker partners with trusted student service providers (such as blocked account operators, money transfer platforms, airlines, and accommodation networks). When you click through our partner links and open an account or book a service, we may earn an affiliate commission at zero additional cost to you. We only recommend services vetted for German university admissions.
          </p>
        </div>

        {/* Bottom Bar: Copyright & Status */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} UniTracker (unitracker.live). All rights reserved.</p>
          
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1.5 text-gray-500">
              <ShieldCheck className="h-3.5 w-3.5 text-green-600" />
              <span>Cloud Sync Active</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
