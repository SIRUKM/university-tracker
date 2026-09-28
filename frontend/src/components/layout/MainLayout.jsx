import Header from './Header';
import Footer from './Footer';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-gray-800">
      <Header />
      <main className="flex-1 w-full px-4 sm:px-6 lg:px-12 py-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
