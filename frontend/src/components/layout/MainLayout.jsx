import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import ContactModal from '../common/ContactModal';

export default function MainLayout({ children, currentView = 'dashboard', onNavigate }) {
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-gray-800 w-full overflow-x-hidden">
      <Header
        currentView={currentView}
        onNavigate={onNavigate}
        onOpenContact={() => setShowContactModal(true)}
      />
      <main className="flex-1 w-full max-w-full px-4 sm:px-6 lg:px-12 py-8 overflow-x-hidden">
        {children}
      </main>
      <Footer onOpenContact={() => setShowContactModal(true)} />

      {/* Official Business Email Contact & Feedback Modal */}
      <ContactModal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
      />
    </div>
  );
}
