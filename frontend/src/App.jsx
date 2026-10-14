import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth, useUser } from '@clerk/clerk-react';
import MainLayout from './components/layout/MainLayout';
import SearchBar from './components/tracker/SearchBar';
import ApplicationCard from './components/tracker/ApplicationCard';
import AnalyticsDashboard from './components/tracker/AnalyticsDashboard';
import { FolderPlus, ArrowUpDown, Download, Upload } from 'lucide-react';

const API_BASE_URL = 'https://uni-tracker-api.onrender.com/api/applications';
const GUEST_STORAGE_KEY = 'unitracker_guest_data';

const normalizePayload = (data, email) => ({
  ...data,
  userEmail: email || data.userEmail || null,
  openingDate: data.openingDate || null,
  dateApplied: data.dateApplied || null,
  deadline: data.deadline || null,
});

export default function App() {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || null;
  
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
                  axios.post(API_BASE_URL, normalizePayload(gApp, userEmail), { headers }).catch(() => {})
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
  }, [isSignedIn, getToken, userEmail]);

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
      userEmail: userEmail,
      reminderType: 'NONE',
      reminderSent: false,
    });
  };

  const saveDraft = async (savedData) => {
    const payload = normalizePayload(savedData, userEmail);

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
    const payload = normalizePayload(updatedData, userEmail);

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


   // Universal CSV Import Handler with Duplicate Checking & Upsert (Update if exists)
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target.result;
        const lines = text.split("\n").map(l => l.trim()).filter((line) => line !== "");
        if (lines.length < 2) {
          alert("The CSV file appears to be empty.");
          return;
        }

        const parseRow = (rowStr) => {
          const res = [];
          let current = "";
          let inQuotes = false;
          for (let i = 0; i < rowStr.length; i++) {
            const char = rowStr[i];
            if (char === '"') {
              inQuotes = !inQuotes;
            } else if (char === "," && !inQuotes) {
              res.push(current.trim().replace(/^"|"$/g, ""));
              current = "";
            } else {
              current += char;
            }
          }
          res.push(current.trim().replace(/^"|"$/g, ""));
          return res;
        };

        const parseDateToISO = (dateStr) => {
          if (!dateStr || !dateStr.trim()) return null;
          const clean = dateStr.trim();
          if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean;

          const slashMatch = clean.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
          if (slashMatch) {
            const [, p1, p2, yyyy] = slashMatch;
            const day = parseInt(p1, 10) > 12 ? p1 : p1;
            const month = parseInt(p1, 10) > 12 ? p2 : p2;
            return `${yyyy}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          }

          try {
            const parsed = new Date(clean);
            if (!isNaN(parsed.getTime())) {
              const yyyy = parsed.getFullYear();
              const mm = String(parsed.getMonth() + 1).padStart(2, "0");
              const dd = String(parsed.getDate()).padStart(2, "0");
              if (yyyy > 2000 && yyyy < 2100) return `${yyyy}-${mm}-${dd}`;
            }
          } catch {
            // fallback
          }
          return null;
        };

        let headerIndex = -1;
        let headers = [];
        for (let i = 0; i < lines.length; i++) {
          const row = parseRow(lines[i]);
          if (row.some(cell => cell.toLowerCase().includes("university name"))) {
            headerIndex = i;
            headers = row.map(h => h.toLowerCase());
            break;
          }
        }

        if (headerIndex === -1) {
          alert("Could not find 'University Name' header in the CSV file.");
          return;
        }

        const findColIndex = (keywords) => {
          return headers.findIndex(h => keywords.some(k => h.includes(k)));
        };

        const idxUni = findColIndex(["university name", "university"]);
        const idxCourse = findColIndex(["course"]);
        const idxPriority = findColIndex(["priority"]);
        const idxAppliedYesNo = findColIndex(["applied"]);
        const idxOpening = findColIndex(["opening"]);
        const idxDeadline = findColIndex(["deadline"]);
        const idxAppliedDate = findColIndex(["date of application", "date applied"]);
        const idxPortal = findColIndex(["portal", "uni-assist"]);
        const idxFeeStatus = findColIndex(["fee paid", "fee status"]);
        const idxFeeAmount = findColIndex(["amount paid", "fee"]);
        const idxVpd = findColIndex(["vpd"]);
        const idxGre = findColIndex(["gre"]);
        const idxLink = findColIndex(["link"]);
        const idxRemark = findColIndex(["remark"]);

        if (idxUni === -1) {
          alert("Could not locate the University Name column.");
          return;
        }

        let updatedAppsList = [...applications];
        let addedCount = 0;
        let updatedCount = 0;

        for (let i = headerIndex + 1; i < lines.length; i++) {
          const data = parseRow(lines[i]);
          if (data.length <= idxUni) continue;

          const uniName = data[idxUni];
          if (!uniName || uniName.toLowerCase().includes("university name")) continue;

          const courseName = idxCourse !== -1 && data[idxCourse] ? data[idxCourse] : "M.Sc. Program";
          const appliedVal = idxAppliedYesNo !== -1 && data[idxAppliedYesNo] ? data[idxAppliedYesNo].toLowerCase() : "";
          const appliedDateParsed = idxAppliedDate !== -1 ? parseDateToISO(data[idxAppliedDate]) : null;

          let derivedStatus = "Drafting";
          if (appliedVal.includes("yes") || appliedDateParsed) {
            derivedStatus = "Submitted";
          }

          const csvOpeningDate = idxOpening !== -1 ? parseDateToISO(data[idxOpening]) : null;
          const csvDeadline = idxDeadline !== -1 ? parseDateToISO(data[idxDeadline]) : null;
          const csvPriority = idxPriority !== -1 && data[idxPriority] ? String(data[idxPriority]).replace(/[^0-9]/g, "") || "1" : "1";
          const csvFeeStatus = idxFeeStatus !== -1 && data[idxFeeStatus] ? data[idxFeeStatus] : "Pending";
          const csvFeeAmount = idxFeeAmount !== -1 && data[idxFeeAmount] ? data[idxFeeAmount] : "";
          const csvPortal = idxPortal !== -1 && data[idxPortal] && data[idxPortal].toLowerCase().includes("uni-assist") ? "Uni-Assist" : "Direct Portal";
          const csvVpd = idxVpd !== -1 && data[idxVpd] && data[idxVpd].toLowerCase().includes("yes") ? "Yes" : "No";
          const csvGre = idxGre !== -1 && data[idxGre] ? data[idxGre] : "No";
          const csvLink = idxLink !== -1 && data[idxLink] ? data[idxLink] : "";
          const csvRemark = idxRemark !== -1 && data[idxRemark] ? data[idxRemark] : "";

          // Check if university + course already exists in state
          const existingIndex = updatedAppsList.findIndex(
            (app) =>
              app.universityName.trim().toLowerCase() === uniName.trim().toLowerCase() &&
              (app.course || "").trim().toLowerCase() === courseName.trim().toLowerCase()
          );

          if (existingIndex !== -1) {
            // Update existing record
            updatedAppsList[existingIndex] = {
              ...updatedAppsList[existingIndex],
              status: derivedStatus,
              priority: csvPriority,
              openingDate: csvOpeningDate,
              deadline: csvDeadline,
              dateApplied: appliedDateParsed,
              feeStatus: csvFeeStatus,
              applicationFee: csvFeeAmount,
              portal: csvPortal,
              vpdRequired: csvVpd,
              greRequired: csvGre,
              courseLink: csvLink,
              remarks: csvRemark,
            };
            updatedCount++;

            // If logged in, update on backend database via PUT
            if (isSignedIn) {
              const token = await getToken();
              await axios.put(
                `${API_BASE_URL}/${updatedAppsList[existingIndex].id}`,
                normalizePayload(updatedAppsList[existingIndex], userEmail),
                { headers: { Authorization: `Bearer ${token}` } }
              ).catch(() => {});
            }
          } else {
            // Create new record
            const newObj = {
              id: crypto.randomUUID(),
              universityName: uniName,
              course: courseName,
              status: derivedStatus,
              priority: csvPriority,
              openingDate: csvOpeningDate,
              deadline: csvDeadline,
              dateApplied: appliedDateParsed,
              feeStatus: csvFeeStatus,
              applicationFee: csvFeeAmount,
              portal: csvPortal,
              vpdRequired: csvVpd,
              vpdStatus: "Pending",
              greRequired: csvGre,
              courseLink: csvLink,
              remarks: csvRemark,
              userEmail: userEmail,
              reminderType: "NONE",
              reminderSent: false,
            };
            updatedAppsList.push(newObj);
            addedCount++;

            // If logged in, save to backend via POST
            if (isSignedIn) {
              const token = await getToken();
              const response = await axios.post(
                API_BASE_URL,
                normalizePayload(newObj, userEmail),
                { headers: { Authorization: `Bearer ${token}` } }
              ).catch(() => null);
              if (response && response.data) {
                // replace local temporary ID with database ID
                newObj.id = response.data.id;
              }
            }
          }
        }

        if (!isSignedIn) {
          localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updatedAppsList));
        }

        setApplications([...updatedAppsList]);
        alert(`CSV Import Complete: ${addedCount} added, ${updatedCount} updated.`);
      } catch (err) {
        console.error("Error parsing CSV:", err);
        alert("Failed to import CSV file.");
      }
    };
    reader.readAsText(file);
    e.target.value = null;
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

            {/* Hidden CSV Input */}
            <input
              type="file"
              id="csvFileInput"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={() => document.getElementById('csvFileInput').click()}
              className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm"
              title="Import existing applications from an Excel or CSV file"
            >
              <Upload className="h-4 w-4" />
              <span>Import CSV</span>
            </button>

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
