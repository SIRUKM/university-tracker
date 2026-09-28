import { useState, useEffect, useMemo } from 'react';
import MainLayout from './components/layout/MainLayout';
import SearchBar from './components/tracker/SearchBar';
import ApplicationCard from './components/tracker/ApplicationCard';
import { FolderPlus, ArrowUpDown } from 'lucide-react';

export default function App() {
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('university-tracker');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [sortBy, setSortBy] = useState('priority'); // 'priority' or 'openingDate'

  // Save changes to localStorage automatically
  useEffect(() => {
    try {
      localStorage.setItem('university-tracker', JSON.stringify(applications));
    } catch (err) {
      console.error("Failed to save to localStorage:", err);
    }
  }, [applications]);

  const addUniversity = (uniName) => {
    const newApp = {
      id: crypto.randomUUID(),
      universityName: uniName,
      priority: '1',
      course: '',
      openingDate: '',
      deadline: '',
      dateApplied: '',
      feeStatus: 'Pending',
      portal: 'Direct Portal',
      vpdRequired: 'No',
      applicationFee: '',
      courseLink: '',
      remarks: '',
    };
    setApplications((prev) => [newApp, ...prev]);
  };

  const updateApplication = (id, field, value) => {
    setApplications((prev) =>
      prev.map((app) => (app.id === id ? { ...app, [field]: value } : app))
    );
  };

  const removeApplication = (id) => {
    setApplications((prev) => prev.filter((app) => app.id !== id));
  };

  // Sorted applications list based on user selection
  const sortedApplications = useMemo(() => {
    return [...applications].sort((a, b) => {
      if (sortBy === 'priority') {
        return (a.priority || '1').localeCompare(b.priority || '1');
      } else if (sortBy === 'openingDate') {
        if (!a.openingDate) return 1;
        if (!b.openingDate) return -1;
        return new Date(a.openingDate) - new Date(b.openingDate);
      }
      return 0;
    });
  }, [applications, sortBy]);

  return (
    <MainLayout>
      <div className="space-y-8">
        
        {/* Title & Counter Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Application Dashboard</h2>
            <p className="text-gray-500 text-sm mt-1">
              Search German universities, track deadlines, manage fees, and monitor portals.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm text-xs font-semibold text-gray-700 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span>{applications.length} Tracked</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <SearchBar onAddUniversity={addUniversity} />

        {/* Sorting Toolbar */}
        {applications.length > 0 && (
          <div className="flex items-center justify-between bg-white border border-gray-200 px-4 py-3 rounded-xl shadow-sm">
            <div className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <ArrowUpDown className="h-4 w-4 text-gray-500" />
              <span>Sort Applications By:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="priority">Priority Level (Critical first)</option>
              <option value="openingDate">Opening Date (Soonest first)</option>
            </select>
          </div>
        )}

        {/* Applications List */}
        <div className="space-y-4">
          {sortedApplications.length === 0 ? (
            <div className="text-center py-16 bg-white border border-dashed border-gray-300 rounded-2xl p-8 space-y-3">
              <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                <FolderPlus className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-800 text-base">No applications tracked yet</h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                Use the search bar above to look up any university in Germany and instantly add it to your personal tracker.
              </p>
            </div>
          ) : (
            sortedApplications.map((app) => (
              <ApplicationCard
                key={app.id}
                app={app}
                onUpdate={updateApplication}
                onRemove={removeApplication}
              />
            ))
          )}
        </div>

      </div>
    </MainLayout>
  );
}
