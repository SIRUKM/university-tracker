import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import MainLayout from './components/layout/MainLayout';
import SearchBar from './components/tracker/SearchBar';
import ApplicationCard from './components/tracker/ApplicationCard';
import { FolderPlus, ArrowUpDown, Download } from 'lucide-react';
// 1. Add this import at the top of App.jsx alongside SearchBar & ApplicationCard:
import AnalyticsDashboard from './components/tracker/AnalyticsDashboard';


const API_BASE_URL = 'https://uni-tracker-api.onrender.com/api/applications';
const GUEST_STORAGE_KEY = 'unitracker_guest_data';

const normalizePayload = (data) => ({
  ...data,
  openingDate: data.openingDate || null,
  dateApplied: data.dateApplied || null,
  deadline: data.deadline || null,
});

export default function App() {
  const { isSignedIn, getToken } = useAuth();
  
  const [applications, setApplications] = useState([]);
  const [draftApp, setDraftApp] = useState(null);
  const [sortBy, setSortBy] = useState('priority');
  const [statusFilter, setStatusFilter] = useState('All');

  // Background wake-up ping for Render free-tier container on initial page load
  useEffect(() => {
    axios.get(API_BASE_URL).catch(() => {});
  }, []);

  // Load data & auto-migrate guest applications upon login
  useEffect(() => {
    if (!isSignedIn) {
      const localData = localStorage.getItem(GUEST_STORAGE_KEY);
      if (localData) {
        setApplications(JSON.parse(localData));
      } else {
        setApplications([]);
      }
    } else {
      const syncAndFetchData = async () => {
        try {
          const token = await getToken();
          const headers = { Authorization: `Bearer ${token}` };

          // Check if user created applications in Guest Mode before signing in
          const guestRaw = localStorage.getItem(GUEST_STORAGE_KEY);
          if (guestRaw) {
            const guestApps = JSON.parse(guestRaw);
            if (Array.isArray(guestApps) && guestApps.length > 0) {
              await Promise.all(
                guestApps.map((gApp) =>
                  axios.post(API_BASE_URL, normalizePayload(gApp), { headers }).catch(() => {})
                )
              );
            }
            localStorage.removeItem(GUEST_STORAGE_KEY);
          }

          const response = await axios.get(API_BASE_URL, { headers });
          setApplications(response.data);
        } catch (err) {
          console.error("Error fetching data:", err);
        }
      };
      syncAndFetchData();
    }
  }, [isSignedIn, getToken]);

  const handleSelectUniversity = (uniName) => {
    setDraftApp({
      id: crypto.randomUUID(),
      universityName: uniName,
      priority: '1',
      course: '',
      status: 'Drafting',
      openingDate: '',
      deadline: '',
      dateApplied: '',
      portal: 'Direct Portal',
      vpdRequired: 'No',
      vpdStatus: 'Pending',
      greRequired: 'No',
      applicationFee: '',
      feeStatus: 'Pending',
      courseLink: '',
      remarks: '',
    });
  };

  const saveDraft = async (savedData) => {
    const payload = normalizePayload(savedData);

    if (!isSignedIn) {
      const newApps = [payload, ...applications];
      setApplications(newApps);
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(newApps));
      setDraftApp(null);
    } else {
      try {
        const token = await getToken();
        const response = await axios.post(API_BASE_URL, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApplications((prev) => [response.data, ...prev]);
        setDraftApp(null);
      } catch (err) {
        console.error("Error saving to DB:", err);
        alert("Could not save application. Please ensure the backend server is awake and try again.");
        throw err;
      }
    }
  };

  const cancelDraft = () => {
    setDraftApp(null);
  };

  const updateExistingApplication = async (updatedData) => {
    const payload = normalizePayload(updatedData);

    if (!isSignedIn) {
      const updatedApps = applications.map((app) => (app.id === payload.id ? payload : app));
      setApplications(updatedApps);
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updatedApps));
    } else {
      try {
        const token = await getToken();
        const response = await axios.put(`${API_BASE_URL}/${payload.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApplications((prev) =>
          prev.map((app) => (app.id === payload.id ? response.data : app))
        );
      } catch (err) {
        console.error("Error updating DB:", err);
        alert("Could not update application. Please try again.");
        throw err;
      }
    }
  };

  const removeApplication = async (id) => {
    if (!isSignedIn) {
      const filteredApps = applications.filter((app) => app.id !== id);
      setApplications(filteredApps);
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(filteredApps));
    } else {
      try {
        const token = await getToken();
        await axios.delete(`${API_BASE_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setApplications((prev) => prev.filter((app) => app.id !== id));
      } catch (err) {
        console.error("Error deleting from DB:", err);
      }
    }
  };

  const exportToCSV = () => {
    if (applications.length === 0) return;

    const headers = [
      'University Name', 'Course', 'Status', 'Priority', 'Opening Date', 
      'Deadline', 'Date Applied', 'Fee Status', 'Application Fee', 
      'Portal', 'VPD Required', 'VPD Status', 'GRE Requirement', 'Course Link', 'Remarks'
    ];

    const rows = applications.map(app => [
      `"${app.universityName || ''}"`,
      `"${app.course || ''}"`,
      `"${app.status || 'Drafting'}"`,
      `"${app.priority || '1'}"`,
      `"${app.openingDate || ''}"`,
      `"${app.deadline || ''}"`,
      `"${app.dateApplied || ''}"`,
      `"${app.feeStatus || 'Pending'}"`,
      `"${app.applicationFee || ''}"`,
      `"${app.portal || 'Direct Portal'}"`,
      `"${app.vpdRequired || 'No'}"`,
      `"${app.vpdStatus || 'Pending'}"`,
      `"${app.greRequired || 'No'}"`,
      `"${app.courseLink || ''}"`,
      `"${app.remarks || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + 
      [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "university_applications_tracker.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredAndSortedApplications = useMemo(() => {
    const filtered = applications.filter((app) => {
      if (statusFilter === 'All') return true;
      if (statusFilter === 'VPD Pending') {
        return app.vpdRequired === 'Yes' && app.vpdStatus !== 'Received';
      }
      return (app.status || 'Drafting') === statusFilter;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'priority') {
        return (a.priority || '1').localeCompare(b.priority || '1');
      } else if (sortBy === 'deadline') {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      } else if (sortBy === 'openingDate') {
        if (!a.openingDate) return 1;
        if (!b.openingDate) return -1;
        return new Date(a.openingDate) - new Date(b.openingDate);
      }
      return 0;
    });
  }, [applications, sortBy, statusFilter]);

  const filterTabs = ['All', 'Drafting', 'Submitted', 'VPD Pending', 'Admitted', 'Rejected'];

  return (
    <MainLayout>
      <div className="space-y-8">
        
        {/* Title & Counter Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Application Dashboard</h2>
            <p className="text-gray-500 text-sm mt-1">
              Search German universities, fill details, and track your admissions progress.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="bg-white border border-gray-200 px-4 py-2 rounded-xl shadow-sm text-xs font-semibold text-gray-700 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span>{applications.length} Tracked</span>
            </div>

            {applications.length > 0 && (
              <button
                onClick={exportToCSV}
                className="flex items-center space-x-2 bg-black hover:bg-gray-800 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
              >
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </button>
            )}
          </div>
        </div>

        
        {/* Analytics Summary Dashboard */}
        <AnalyticsDashboard applications={applications} />

        {/* Search Bar */}
        <SearchBar onAddUniversity={handleSelectUniversity} />

        {/* Filter Pills & Sorting Toolbar */}
        {applications.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-gray-200 px-4 py-3 rounded-xl shadow-sm">
            {/* Status Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    statusFilter === tab
                      ? 'bg-black text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 shrink-0">
              <ArrowUpDown className="h-4 w-4 text-gray-500" />
              <span className="text-xs font-semibold text-gray-600">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="priority">Priority Level (High first)</option>
                <option value="deadline">Deadline (Soonest first)</option>
                <option value="openingDate">Opening Date (Soonest first)</option>
              </select>
            </div>
          </div>
        )}

        {/* Active Draft Form */}
        {draftApp && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider">Fill Application Details</h3>
              <span className="text-xs text-gray-500">Review and click Add to save to your tracker</span>
            </div>
            <ApplicationCard
              key={draftApp.id}
              app={draftApp}
              isDraft={true}
              onSave={saveDraft}
              onCancelDraft={cancelDraft}
            />
          </div>
        )}

        {/* Applications List */}
        <div className="space-y-4">
          {filteredAndSortedApplications.length === 0 && !draftApp ? (
            <div className="text-center py-16 bg-white border border-dashed border-gray-300 rounded-2xl p-8 space-y-3">
              <div className="w-12 h-12 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                <FolderPlus className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-800 text-base">
                {applications.length === 0
                  ? 'No applications tracked yet'
                  : `No applications matching "${statusFilter}"`}
              </h3>
              <p className="text-gray-500 text-sm max-w-md mx-auto">
                {applications.length === 0
                  ? 'Use the search bar above to look up any university in Germany and start adding your applications.'
                  : 'Switch the filter tab above to view your other tracked universities.'}
              </p>
            </div>
          ) : (
            filteredAndSortedApplications.map((app) => (
              <ApplicationCard
                key={app.id}
                app={app}
                onSave={updateExistingApplication}
                onRemove={removeApplication}
              />
            ))
          )}
        </div>

      </div>
    </MainLayout>
  );
}
