export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="w-full px-4 sm:px-6 lg:px-12 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
        <p className="font-medium">© {new Date().getFullYear()} UniTracker.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <button className="hover:text-blue-600 font-medium transition-colors">Documentation</button>
          <button className="hover:text-blue-600 font-medium transition-colors">Support</button>
        </div>
      </div>
    </footer>
  );
}
