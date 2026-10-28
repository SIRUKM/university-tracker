import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useAuth, useUser } from '@clerk/clerk-react';
import MainLayout from './components/layout/MainLayout';
import SearchBar from './components/tracker/SearchBar';
import ApplicationCard from './components/tracker/ApplicationCard';
import AnalyticsDashboard from './components/tracker/AnalyticsDashboard';
import { FolderPlus, ArrowUpDown, Download, Upload, Share2, Snowflake, Sun, FileSpreadsheet, FileText, ChevronDown } from 'lucide-react';
import * as XLSX from 'xlsx';
import GermanyRoadmap from "./components/tracker/GermanyRoadmap";
import JourneyDashboardWidget from "./components/tracker/JourneyDashboardWidget";
import SocialProofBadge from "./components/common/SocialProofBadge";
import BavarianCalculator from "./components/calculator/BavarianCalculator";
import ShareShortlistModal from "./components/tracker/ShareShortlistModal";
import StudentDeals from "./components/deals/StudentDeals";
import AdmittedCelebrationModal from "./components/common/AdmittedCelebrationModal";
import ImportMappingModal from "./components/tracker/ImportMappingModal";


const API_BASE_URL = 'https://uni-tracker-api.onrender.com/api/applications';
const HEALTH_URL = 'https://uni-tracker-api.onrender.com/api/health';
const GUEST_STORAGE_KEY = 'unitracker_guest_data';
const INTAKE_STORAGE_KEY = 'unitracker_intake_map';

const normalizePayload = (data, email) => {
  let resolvedIntake = null;
  if (data.intake) {
    const s = String(data.intake).toLowerCase();
    if (s.includes('summer')) resolvedIntake = 'Summer';
    else if (s.includes('winter')) resolvedIntake = 'Winter';
    else resolvedIntake = data.intake;
  }
  return {
    ...data,
    intake: resolvedIntake,
    userEmail: email || data.userEmail || null,
    openingDate: data.openingDate || null,
    dateApplied: data.dateApplied || null,
    deadline: data.deadline || null,
  };
};

export default function App() {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || null;
  
  const [applications, setApplications] = useState([]);
  const [draftApp, setDraftApp] = useState(null);
  const [sortBy, setSortBy] = useState('priority');
  const [statusFilter, setStatusFilter] = useState('All');
  const [intakeFilter, setIntakeFilter] = useState('All');
  const [showShareModal, setShowShareModal] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [pendingImportData, setPendingImportData] = useState(null);
  const [celebrationApp, setCelebrationApp] = useState(null);
  const [targetJourneyPhase, setTargetJourneyPhase] = useState("p1");
  const [currentView, setCurrentView] = useState(() => {
    if (window.location.pathname.includes('journey') || window.location.pathname.includes('roadmap')) return 'journey';
    if (window.location.pathname.includes('calculator')) return 'calculator';
    if (window.location.pathname.includes('student-deals') || window.location.pathname.includes('deals')) return 'deals';
    return 'dashboard';
  });

  const handleNavigate = (view, phaseId = null) => {
    if (phaseId) setTargetJourneyPhase(phaseId);
    setCurrentView(view);
    let targetUrl = '/';
    if (view === 'journey') {
      targetUrl = phaseId ? `/my-journey?phase=${phaseId}` : '/my-journey';
    } else if (view === 'calculator') {
      targetUrl = '/grade-calculator';
    } else if (view === 'deals') {
      targetUrl = '/student-deals';
    }
    window.history.pushState({}, '', targetUrl);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenJourney = (phaseId) => {
    handleNavigate('journey', phaseId);
  };

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.pathname.includes('journey') || window.location.pathname.includes('roadmap')) {
        setCurrentView('journey');
      } else if (window.location.pathname.includes('calculator')) {
        setCurrentView('calculator');
      } else if (window.location.pathname.includes('student-deals') || window.location.pathname.includes('deals')) {
        setCurrentView('deals');
      } else {
        setCurrentView('dashboard');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Background wake-up ping for Render free-tier container on initial page load
  useEffect(() => {
    axios.get(HEALTH_URL).catch(() => {});
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
          const rawIntake = localStorage.getItem(INTAKE_STORAGE_KEY);
          const intakeMap = rawIntake ? JSON.parse(rawIntake) : {};
          const enhancedApps = (response.data || []).map((app) => {
            const savedIntake = intakeMap[app.id] || intakeMap[`${(app.universityName || "").trim().toLowerCase()}__${(app.course || "").trim().toLowerCase()}`];
            const rawVal = app.intake || savedIntake || "";
            let resolved = "";
            if (rawVal) {
              resolved = rawVal.toLowerCase().includes("summer")
                ? "Summer"
                : rawVal.toLowerCase().includes("winter")
                ? "Winter"
                : rawVal;
            }
            return {
              ...app,
              intake: resolved,
            };
          });
          setApplications(enhancedApps);
        } catch (err) {
          console.error("Error fetching data:", err);
        }
      };
      syncAndFetchData();
    }
  }, [isSignedIn, getToken, userEmail]);

  const handleSelectUniversity = (uniName, websiteUrl = '') => {
    setDraftApp({
      id: crypto.randomUUID(),
      universityName: uniName,
      priority: '1',
      course: '',
      intake: '',
      status: 'Drafting',
      openingDate: '',
      deadline: '',
      dateApplied: '',
      portal: '',
      vpdRequired: 'No',
      vpdStatus: 'Pending',
      greRequired: 'No',
      applicationFee: '',
      feeStatus: 'Pending',
      courseLink: websiteUrl || '',
      remarks: '',
      userEmail: userEmail,
      reminderType: 'NONE',
      reminderSent: false,
    });
  };

  const saveDraft = async (savedData) => {
    const payload = normalizePayload(savedData, userEmail);
    let chosenIntake = '';
    if (payload.intake) {
      chosenIntake = payload.intake.toLowerCase().includes('summer')
        ? 'Summer'
        : payload.intake.toLowerCase().includes('winter')
        ? 'Winter'
        : payload.intake;
    }

    try {
      const raw = localStorage.getItem(INTAKE_STORAGE_KEY);
      const map = raw ? JSON.parse(raw) : {};
      const keyComposite = `${(payload.universityName || "").trim().toLowerCase()}__${(payload.course || "").trim().toLowerCase()}`;
      if (chosenIntake) {
        map[payload.id] = chosenIntake;
        map[keyComposite] = chosenIntake;
      } else {
        delete map[payload.id];
        delete map[keyComposite];
      }
      localStorage.setItem(INTAKE_STORAGE_KEY, JSON.stringify(map));
    } catch {}

    if (payload.status === 'Admitted') {
      setCelebrationApp({ ...payload, intake: chosenIntake });
    }

    if (!isSignedIn) {
      const newApps = [{ ...payload, intake: chosenIntake }, ...applications];
      setApplications(newApps);
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(newApps));
      setDraftApp(null);
    } else {
      try {
        const token = await getToken();
        const response = await axios.post(API_BASE_URL, { ...payload, intake: chosenIntake || null }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const merged = {
          ...payload,
          ...response.data,
          intake: chosenIntake,
        };
        setApplications((prev) => [merged, ...prev]);
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
    let updatedIntake = '';
    if (payload.intake) {
      updatedIntake = payload.intake.toLowerCase().includes('summer')
        ? 'Summer'
        : payload.intake.toLowerCase().includes('winter')
        ? 'Winter'
        : payload.intake;
    }

    try {
      const raw = localStorage.getItem(INTAKE_STORAGE_KEY);
      const map = raw ? JSON.parse(raw) : {};
      const keyComposite = `${(payload.universityName || "").trim().toLowerCase()}__${(payload.course || "").trim().toLowerCase()}`;
      if (updatedIntake) {
        map[payload.id] = updatedIntake;
        map[keyComposite] = updatedIntake;
      } else {
        delete map[payload.id];
        delete map[keyComposite];
      }
      localStorage.setItem(INTAKE_STORAGE_KEY, JSON.stringify(map));
    } catch {}

    const prevApp = applications.find((a) => a.id === payload.id);
    if (payload.status === 'Admitted' && (!prevApp || prevApp.status !== 'Admitted')) {
      setCelebrationApp({ ...payload, intake: updatedIntake });
    }

    if (!isSignedIn) {
      const updatedApps = applications.map((app) => (app.id === payload.id ? { ...payload, intake: updatedIntake } : app));
      setApplications(updatedApps);
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(updatedApps));
    } else {
      try {
        const token = await getToken();
        const response = await axios.put(`${API_BASE_URL}/${payload.id}`, { ...payload, intake: updatedIntake || null }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const merged = {
          ...payload,
          ...response.data,
          intake: updatedIntake,
        };
        setApplications((prev) =>
          prev.map((app) => (app.id === payload.id ? merged : app))
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

  const exportData = (format = 'xlsx') => {
    if (applications.length === 0) {
      alert("No applications to export yet. Add some applications first!");
      return;
    }

    const headers = [
      'University Name', 'Course', 'Semester', 'Status', 'Priority', 'Opening Date', 
      'Deadline', 'Date Applied', 'Fee Status', 'Application Fee', 
      'Portal', 'VPD Required', 'VPD Status', 'GRE Requirement', 'Course Link', 'Remarks'
    ];

    const rows = applications.map(app => [
      app.universityName || '',
      app.course || '',
      app.intake ? (app.intake.toLowerCase().includes('summer') ? 'Summer' : 'Winter') : '',
      app.status || 'Drafting',
      app.priority || '1',
      app.openingDate || '',
      app.deadline || '',
      app.dateApplied || '',
      app.feeStatus || '',
      app.applicationFee || '',
      app.portal || '',
      app.vpdRequired || 'No',
      app.vpdStatus || 'Pending',
      app.greRequired || 'No',
      app.courseLink || '',
      app.remarks || ''
    ]);

    const worksheetData = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(worksheetData);

    // Set professional column widths for Excel
    ws['!cols'] = [
      { wch: 32 }, // University Name
      { wch: 30 }, // Course
      { wch: 12 }, // Semester
      { wch: 14 }, // Status
      { wch: 10 }, // Priority
      { wch: 14 }, // Opening Date
      { wch: 14 }, // Deadline
      { wch: 14 }, // Date Applied
      { wch: 14 }, // Fee Status
      { wch: 16 }, // Application Fee
      { wch: 18 }, // Portal
      { wch: 14 }, // VPD Required
      { wch: 14 }, // VPD Status
      { wch: 16 }, // GRE Requirement
      { wch: 36 }, // Course Link
      { wch: 40 }, // Remarks
    ];

    // Set auto-filter for sorting inside Excel
    ws['!autofilter'] = { ref: `A1:P${rows.length + 1}` };

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "My Shortlist");

    if (format === 'csv') {
      XLSX.writeFile(wb, "UniTracker_Germany_Shortlist.csv", { bookType: "csv" });
    } else {
      XLSX.writeFile(wb, "UniTracker_Germany_Shortlist.xlsx", { bookType: "xlsx" });
    }
    setShowExportMenu(false);
  };

  // Universal Import Handler accepting both .xlsx / .xls and .csv
  // Opens interactive column mapping modal so users with ANY header names can import
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      // SheetJS parses binary .xlsx, .xls, and text .csv into a unified workbook
      const workbook = XLSX.read(data, { type: 'array', cellDates: true });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rawLines = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

      const nonEmptyRows = (rawLines || []).filter(
        (row) => Array.isArray(row) && row.some((cell) => String(cell ?? '').trim() !== '')
      );

      if (nonEmptyRows.length < 2) {
        alert("The selected file appears to be empty or does not have enough rows.");
        return;
      }

      // Fuzzy scan top 10 rows to detect the true header row
      const candidateKeywords = [
        'university', 'uni', 'college', 'hochschule', 'institution', 'school',
        'course', 'program', 'degree', 'major', 'msc', 'study',
        'deadline', 'status', 'intake', 'semester', 'portal', 'fee',
        'vpd', 'gre', 'link', 'remark', 'notes', 'priority'
      ];

      let headerIndex = -1;
      let maxKeywordMatches = 0;

      for (let i = 0; i < Math.min(nonEmptyRows.length, 10); i++) {
        const row = nonEmptyRows[i];
        let matches = 0;
        row.forEach((cell) => {
          const text = String(cell || '').toLowerCase().trim();
          if (candidateKeywords.some((kw) => text.includes(kw))) {
            matches++;
          }
        });
        if (matches > maxKeywordMatches) {
          maxKeywordMatches = matches;
          headerIndex = i;
        }
      }

      // If no candidate keywords match (custom names), default safely to the first row (0)
      if (headerIndex === -1 || maxKeywordMatches === 0) {
        headerIndex = 0;
      }

      const headers = nonEmptyRows[headerIndex].map((cell, idx) => {
        const str = String(cell ?? '').trim();
        return str || `Column ${idx + 1}`;
      });

      const rawRows = nonEmptyRows.slice(headerIndex + 1).filter(
        (row) => Array.isArray(row) && row.some((cell) => String(cell ?? '').trim() !== '')
      );

      if (rawRows.length === 0) {
        alert("No data rows found below the header row in this file.");
        return;
      }

      // Open interactive column matcher modal
      setPendingImportData({
        fileName: file.name,
        headers,
        rawRows,
      });
    } catch (err) {
      console.error("Error reading spreadsheet:", err);
      alert("Failed to parse file. Please verify it is a valid .xlsx, .xls, or .csv document.");
    } finally {
      e.target.value = '';
    }
  };

  // Execute import after user confirms column mapping in the modal
  const executeImportWithMapping = async (columnMapping) => {
    if (!pendingImportData) return;
    const { rawRows } = pendingImportData;

    const parseDateToISO = (val) => {
      if (!val) return null;
      if (val instanceof Date && !isNaN(val.getTime())) {
        const yyyy = val.getFullYear();
        const mm = String(val.getMonth() + 1).padStart(2, "0");
        const dd = String(val.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
      }
      const clean = String(val).trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean;

      const slashMatch = clean.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
      if (slashMatch) {
        const [, p1, p2, yyyy] = slashMatch;
        return `${yyyy}-${String(p2).padStart(2, "0")}-${String(p1).padStart(2, "0")}`;
      }

      try {
        const parsed = new Date(clean);
        if (!isNaN(parsed.getTime())) {
          const yyyy = parsed.getFullYear();
          const mm = String(parsed.getMonth() + 1).padStart(2, "0");
          const dd = String(parsed.getDate()).padStart(2, "0");
          if (yyyy > 2000 && yyyy < 2100) return `${yyyy}-${mm}-${dd}`;
        }
      } catch {}
      return null;
    };

    const cleanFee = (feeStr) => {
      if (!feeStr) return "";
      const cleaned = String(feeStr).replace(/[^0-9.]/g, "");
      const val = parseFloat(cleaned);
      if (isNaN(val) || val === 0) return "";
      return `${Math.round(val)} EUR`;
    };

    const getColVal = (row, fieldKey) => {
      const colIdx = columnMapping[fieldKey];
      if (colIdx === undefined || colIdx === -1 || colIdx >= row.length) return "";
      const v = row[colIdx];
      return v !== undefined && v !== null ? String(v).trim() : "";
    };

    const getColRaw = (row, fieldKey) => {
      const colIdx = columnMapping[fieldKey];
      if (colIdx === undefined || colIdx === -1 || colIdx >= row.length) return null;
      return row[colIdx];
    };

    const importedMap = new Map();

    for (const row of rawRows) {
      if (!Array.isArray(row)) continue;
      const uniName = getColVal(row, "universityName");
      if (!uniName || uniName.toLowerCase() === "university name") continue;

      const courseName = getColVal(row, "course") || "M.Sc. Program";
      const rawSemester = getColVal(row, "intake");
      let resolvedIntake = "";
      if (rawSemester) {
        const s = rawSemester.toLowerCase();
        if (s.includes("summer")) resolvedIntake = "Summer";
        else if (s.includes("winter")) resolvedIntake = "Winter";
        else resolvedIntake = rawSemester;
      }

      const rawStatus = getColVal(row, "status");
      let derivedStatus = "Drafting";
      if (["Submitted", "Admitted", "Rejected", "Drafting"].includes(rawStatus)) {
        derivedStatus = rawStatus;
      } else if (rawStatus.toLowerCase().includes("admit") || rawStatus.toLowerCase().includes("accept")) {
        derivedStatus = "Admitted";
      } else if (rawStatus.toLowerCase().includes("reject")) {
        derivedStatus = "Rejected";
      } else if (rawStatus.toLowerCase().includes("submit") || rawStatus.toLowerCase().includes("applied")) {
        derivedStatus = "Submitted";
      }

      const rawPriority = getColVal(row, "priority").replace(/[^0-9]/g, "");
      const priority = ["1", "2", "3"].includes(rawPriority) ? rawPriority : "1";

      const deadlineVal = parseDateToISO(getColRaw(row, "deadline"));
      const openingVal = parseDateToISO(getColRaw(row, "openingDate"));
      const dateAppliedVal = parseDateToISO(getColRaw(row, "dateApplied"));

      if (dateAppliedVal && derivedStatus === "Drafting") {
        derivedStatus = "Submitted";
      }

      const rawPortal = getColVal(row, "portal");
      let portal = "";
      if (rawPortal) {
        if (rawPortal.toLowerCase().includes("assist")) {
          portal = "Uni-Assist";
        } else if (rawPortal.toLowerCase().includes("direct")) {
          portal = "Direct Portal";
        } else {
          portal = rawPortal;
        }
      }

      const rawFee = cleanFee(getColVal(row, "applicationFee"));
      const rawFeeStatus = getColVal(row, "feeStatus");
      let feeStatus = "Pending";
      if (rawFeeStatus.toLowerCase().includes("paid")) feeStatus = "Paid";
      else if (rawFeeStatus.toLowerCase().includes("waiv")) feeStatus = "Waived";

      const rawVpd = getColVal(row, "vpdRequired");
      const vpdRequired = rawVpd.toLowerCase().includes("yes") || rawVpd.toLowerCase().includes("true") ? "Yes" : "No";

      const rawGre = getColVal(row, "greRequired");
      const greRequired = rawGre || "No";

      const courseLink = getColVal(row, "courseLink");
      const remarks = getColVal(row, "remarks");

      const uniqueKey = `${uniName.toLowerCase()}__${courseName.toLowerCase()}`;

      importedMap.set(uniqueKey, {
        universityName: uniName,
        course: courseName,
        intake: resolvedIntake,
        status: derivedStatus,
        priority,
        openingDate: openingVal,
        deadline: deadlineVal,
        dateApplied: dateAppliedVal,
        portal,
        applicationFee: rawFee,
        feeStatus,
        vpdRequired,
        vpdStatus: "Pending",
        greRequired,
        courseLink,
        remarks,
      });
    }

    const mergedMap = new Map();
    for (const existingApp of applications) {
      const key = `${(existingApp.universityName || "").trim().toLowerCase()}__${(existingApp.course || "").trim().toLowerCase()}`;
      mergedMap.set(key, existingApp);
    }

    let addedCount = 0;
    let updatedCount = 0;
    const toCreate = [];
    const toUpdate = [];

    for (const [key, item] of importedMap.entries()) {
      if (mergedMap.has(key)) {
        const existing = mergedMap.get(key);
        const updatedObj = {
          ...existing,
          ...item,
          id: existing.id,
        };
        mergedMap.set(key, updatedObj);
        toUpdate.push(updatedObj);
        updatedCount++;
      } else {
        const newObj = {
          ...item,
          id: crypto.randomUUID(),
          reminderType: "NONE",
          reminderSent: false,
        };
        mergedMap.set(key, newObj);
        toCreate.push(newObj);
        addedCount++;
      }
    }

    const finalAppsList = Array.from(mergedMap.values());
    setApplications(finalAppsList);

    if (!isSignedIn) {
      localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(finalAppsList));
    }

    setPendingImportData(null);
    alert(`Import Successful!\n• ${addedCount} new application(s) added\n• ${updatedCount} existing application(s) updated`);

    // Non-blocking background sync with backend if signed in
    if (isSignedIn) {
      (async () => {
        try {
          const token = await getToken();
          const headersAuth = { Authorization: `Bearer ${token}` };
          await Promise.all([
            ...toCreate.map((item) =>
              axios.post(API_BASE_URL, normalizePayload(item, userEmail), { headers: headersAuth }).catch(() => {})
            ),
            ...toUpdate.map((item) =>
              axios.put(`${API_BASE_URL}/${item.id}`, normalizePayload(item, userEmail), { headers: headersAuth }).catch(() => {})
            ),
          ]);
        } catch (syncErr) {
          console.error("Background sync error after import:", syncErr);
        }
      })();
    }
  };





  const filteredAndSortedApplications = useMemo(() => {
    const filtered = applications.filter((app) => {
      // Intake Filter (Winter vs Summer)
      if (intakeFilter !== 'All') {
        const s = (app.intake || '').toLowerCase();
        const isSummer = s.includes('summer');
        const isWinter = s.includes('winter');
        if (intakeFilter === 'Summer' && !isSummer) {
          return false;
        }
        if (intakeFilter === 'Winter' && !isWinter) {
          return false;
        }
      }

      // Status Filter
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
  }, [applications, sortBy, statusFilter, intakeFilter]);

  const filterTabs = ['All', 'Drafting', 'Submitted', 'VPD Pending', 'Admitted', 'Rejected'];

  return (
    <MainLayout currentView={currentView} onNavigate={handleNavigate}>
      {currentView === 'calculator' ? (
        <BavarianCalculator onNavigateToDashboard={() => handleNavigate('dashboard')} />
      ) : currentView === 'deals' ? (
        <StudentDeals onNavigateToDashboard={() => handleNavigate('dashboard')} />
      ) : currentView === 'journey' ? (
        <GermanyRoadmap
          isStandalonePage={true}
          initialPhaseId={targetJourneyPhase}
          onNavigateToDashboard={() => handleNavigate('dashboard')}
          onNavigateToDeals={() => handleNavigate('deals')}
        />
      ) : (
        <div className="space-y-8">
        
        {/* Social Proof Pill Badge */}
        <div className="flex justify-center w-full">
          <SocialProofBadge count="2,500+" label="German university applicants" />
        </div>

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

            {/* Hidden Excel & CSV File Input */}
            <input
              type="file"
              id="fileUploadInput"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => document.getElementById('fileUploadInput').click()}
              className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-800 border border-gray-200 text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
              title="Import applications from an Excel (.xlsx, .xls) or CSV file"
            >
              <Upload className="h-4 w-4 text-emerald-600" />
              <span>Import Excel / CSV</span>
            </button>

            {applications.length > 0 && (
              <button
                type="button"
                onClick={() => setShowShareModal(true)}
                className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
                title="Share your shortlist to WhatsApp, Telegram, or export as PDF"
              >
                <Share2 className="h-4 w-4" />
                <span>Share Shortlist</span>
              </button>
            )}

            {applications.length > 0 && (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowExportMenu((prev) => !prev)}
                  className="flex items-center space-x-1.5 bg-black hover:bg-gray-800 text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
                  title="Export shortlist to Excel (.xlsx) or CSV"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
                  <ChevronDown className="h-3 w-3 opacity-70" />
                </button>

                {showExportMenu && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-2xl shadow-xl p-1.5 z-30 space-y-1 animate-fadeIn"
                    onClick={() => setShowExportMenu(false)}
                  >
                    <button
                      type="button"
                      onClick={() => exportData('xlsx')}
                      className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-800 hover:bg-gray-100 flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span className="flex items-center space-x-2">
                        <FileSpreadsheet className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span>Excel Workbook (.xlsx)</span>
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        Best
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => exportData('csv')}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-gray-600 hover:bg-gray-100 flex items-center space-x-2 transition-colors cursor-pointer"
                    >
                      <FileText className="h-4 w-4 text-gray-400 shrink-0" />
                      <span>CSV Document (.csv)</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Germany Journey Progress Hero Widget */}
        <JourneyDashboardWidget onOpenJourney={handleOpenJourney} />

        {/* Analytics Summary Dashboard */}
        <AnalyticsDashboard applications={applications} />

        {/* Search Bar */}
        <SearchBar onAddUniversity={handleSelectUniversity} />

        {/* Filter Pills & Sorting Toolbar */}
        {applications.length > 0 && (
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white border border-gray-200 p-3 sm:px-4 sm:py-3 rounded-xl shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              {/* Semester Quick Filter Pills */}
              <div className="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
                <button
                  type="button"
                  onClick={() => setIntakeFilter('All')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    intakeFilter === 'All' ? 'bg-white text-black shadow-2xs' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  All Semesters
                </button>
                <button
                  type="button"
                  onClick={() => setIntakeFilter('Winter')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center space-x-1 cursor-pointer ${
                    intakeFilter === 'Winter' ? 'bg-white text-sky-700 shadow-2xs font-bold' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  <Snowflake className="h-3 w-3 text-sky-500" />
                  <span>Winter</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIntakeFilter('Summer')}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all flex items-center space-x-1 cursor-pointer ${
                    intakeFilter === 'Summer' ? 'bg-white text-amber-700 shadow-2xs font-bold' : 'text-gray-600 hover:text-black'
                  }`}
                >
                  <Sun className="h-3 w-3 text-amber-500" />
                  <span>Summer</span>
                </button>
              </div>

              {/* Status Filter Pills */}
              <div className="flex flex-wrap items-center gap-1">
                {filterTabs.map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setStatusFilter(tab)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      statusFilter === tab
                        ? 'bg-black text-white'
                        : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2 shrink-0 self-end lg:self-center">
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
      )}

      {/* Share Shortlist Modal */}
      <ShareShortlistModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        applications={applications}
      />

      {/* Admitted Celebration Modal */}
      <AdmittedCelebrationModal
        isOpen={Boolean(celebrationApp)}
        onClose={() => setCelebrationApp(null)}
        app={celebrationApp}
      />

      {/* Interactive Column Mapping & Import Preview Modal */}
      <ImportMappingModal
        isOpen={Boolean(pendingImportData)}
        onClose={() => setPendingImportData(null)}
        fileData={pendingImportData}
        onConfirmImport={executeImportWithMapping}
      />
    </MainLayout>
  );
}
