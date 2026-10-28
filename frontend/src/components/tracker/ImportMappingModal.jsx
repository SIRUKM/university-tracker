import { useState, useEffect, useMemo } from 'react';
import {
  X,
  FileSpreadsheet,
  Check,
  AlertCircle,
  ArrowRight,
  Sparkles,
  HelpCircle,
  Table,
} from 'lucide-react';

const UNITRACKER_FIELDS = [
  {
    key: 'universityName',
    label: 'University Name',
    required: true,
    description: 'Name of the German university or institution',
    keywords: [
      'university',
      'uni',
      'college',
      'institution',
      'institute',
      'school',
      'hochschule',
      'universität',
      'target',
      'name',
    ],
  },
  {
    key: 'course',
    label: 'Course / Program',
    required: false,
    description: 'Degree program or major name (e.g., M.Sc. Data Science)',
    keywords: [
      'course',
      'program',
      'programme',
      'degree',
      'major',
      'msc',
      'm.sc',
      'field',
      'branch',
      'specialization',
      'study',
    ],
  },
  {
    key: 'intake',
    label: 'Semester / Intake',
    required: false,
    description: 'Winter or Summer semester',
    keywords: ['semester', 'intake', 'term', 'session', 'season', 'wise', 'sose'],
  },
  {
    key: 'status',
    label: 'Application Status',
    required: false,
    description: 'Drafting, Submitted, VPD Pending, Admitted, Rejected',
    keywords: ['status', 'stage', 'state', 'applied', 'admission', 'result'],
  },
  {
    key: 'priority',
    label: 'Priority (1, 2, or 3)',
    required: false,
    description: 'Priority rank: 1 (High), 2 (Medium), 3 (Low)',
    keywords: ['priority', 'prio', 'rank', 'tier', 'importance', 'preference'],
  },
  {
    key: 'deadline',
    label: 'Deadline Date',
    required: false,
    description: 'Application deadline (YYYY-MM-DD or DD/MM/YYYY)',
    keywords: ['deadline', 'closing', 'due', 'last date', 'end date', 'due date'],
  },
  {
    key: 'openingDate',
    label: 'Opening Date',
    required: false,
    description: 'Date application portal opens',
    keywords: ['opening', 'portal opens', 'start date', 'beginning', 'open date'],
  },
  {
    key: 'dateApplied',
    label: 'Date Applied',
    required: false,
    description: 'Date you submitted the application',
    keywords: ['date applied', 'applied date', 'submission date', 'submitted on'],
  },
  {
    key: 'portal',
    label: 'Portal (Direct / Uni-Assist)',
    required: false,
    description: 'Application platform (Direct Portal or Uni-Assist)',
    keywords: ['portal', 'platform', 'mode', 'via', 'method', 'uni-assist', 'assist'],
  },
  {
    key: 'applicationFee',
    label: 'Application Fee',
    required: false,
    description: 'Fee amount in EUR (e.g., 75 EUR)',
    keywords: ['fee', 'application fee', 'cost', 'amount', 'price', 'charges'],
  },
  {
    key: 'feeStatus',
    label: 'Fee Payment Status',
    required: false,
    description: 'Pending, Paid, or Waived',
    keywords: ['fee status', 'payment', 'fee paid', 'paid'],
  },
  {
    key: 'vpdRequired',
    label: 'VPD Required (Yes / No)',
    required: false,
    description: 'Whether Uni-Assist VPD is required',
    keywords: ['vpd', 'vpd required', 'vorprüfungsdokumentation'],
  },
  {
    key: 'greRequired',
    label: 'GRE Requirement',
    required: false,
    description: 'GRE test requirement (Yes, No, or Recommended)',
    keywords: ['gre', 'gre required', 'exam', 'test'],
  },
  {
    key: 'courseLink',
    label: 'Course Link / Website',
    required: false,
    description: 'Official university or program website URL',
    keywords: ['link', 'website', 'url', 'web', 'course link', 'portal link'],
  },
  {
    key: 'remarks',
    label: 'Remarks & Notes',
    required: false,
    description: 'Personal notes, requirements, or professors',
    keywords: ['remark', 'remarks', 'notes', 'comments', 'comment', 'info', 'details'],
  },
];

export default function ImportMappingModal({
  isOpen,
  onClose,
  fileData,
  onConfirmImport,
}) {
  const [columnMapping, setColumnMapping] = useState({});
  const [previewTab, setPreviewTab] = useState('mapping'); // 'mapping' | 'preview'

  const headers = fileData?.headers || [];
  const rawRows = fileData?.rawRows || [];
  const fileName = fileData?.fileName || 'Spreadsheet';

  // Smart fuzzy auto-matcher when a new file is uploaded
  useEffect(() => {
    if (!headers || headers.length === 0) return;

    const initialMap = {};
    const usedHeaders = new Set();

    UNITRACKER_FIELDS.forEach((field) => {
      // Find best match in headers
      let bestIndex = -1;
      let bestScore = -1;

      headers.forEach((h, colIdx) => {
        if (!h) return;
        const normalizedH = String(h).toLowerCase().trim().replace(/[^a-z0-9]/g, '');

        field.keywords.forEach((keyword, kIdx) => {
          const normalizedK = keyword.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (normalizedH === normalizedK) {
            // Exact match
            if (100 > bestScore) {
              bestScore = 100;
              bestIndex = colIdx;
            }
          } else if (normalizedH.includes(normalizedK)) {
            const score = 50 - kIdx;
            if (score > bestScore && !usedHeaders.has(colIdx)) {
              bestScore = score;
              bestIndex = colIdx;
            }
          }
        });
      });

      if (bestIndex !== -1 && !usedHeaders.has(bestIndex)) {
        initialMap[field.key] = bestIndex;
        usedHeaders.add(bestIndex);
      } else {
        initialMap[field.key] = -1; // Unmapped
      }
    });

    setColumnMapping(initialMap);
  }, [headers]);

  if (!isOpen || !fileData) return null;

  const handleSelectColumn = (fieldKey, columnIndex) => {
    setColumnMapping((prev) => ({
      ...prev,
      [fieldKey]: parseInt(columnIndex, 10),
    }));
  };

  const isUniversityMapped =
    columnMapping.universityName !== undefined && columnMapping.universityName !== -1;

  // Generate sample parsed rows for live preview
  const sampleRows = rawRows.slice(0, 3);

  const handleConfirm = () => {
    if (!isUniversityMapped) {
      alert("Please map the 'University Name' column to proceed.");
      return;
    }
    onConfirmImport(columnMapping);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div
        className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative space-y-6 my-8 text-left max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-gray-100 shrink-0">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
                <FileSpreadsheet className="h-4 w-4" />
              </span>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Spreadsheet Column Matcher
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Match Your Columns to UniTracker
            </h2>
            <p className="text-xs text-gray-500">
              We found <strong className="text-black">{rawRows.length} data rows</strong> in{' '}
              <strong className="text-black">{fileName}</strong>. We automatically detected matching columns below — review or adjust them before importing.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-black p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            title="Cancel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center justify-between shrink-0">
          <div className="inline-flex p-1 bg-gray-100 rounded-xl border border-gray-200 text-xs">
            <button
              type="button"
              onClick={() => setPreviewTab('mapping')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                previewTab === 'mapping'
                  ? 'bg-white text-black shadow-2xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              Column Mapping ({Object.values(columnMapping).filter((v) => v !== -1).length} Mapped)
            </button>
            <button
              type="button"
              onClick={() => setPreviewTab('preview')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center space-x-1.5 ${
                previewTab === 'preview'
                  ? 'bg-white text-black shadow-2xs'
                  : 'text-gray-600 hover:text-black'
              }`}
            >
              <Table className="h-3.5 w-3.5" />
              <span>Preview Data ({sampleRows.length} sample rows)</span>
            </button>
          </div>

          <div className="text-[11px] text-gray-500 hidden sm:block">
            * <strong className="text-gray-700">University Name</strong> is mandatory
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 overflow-y-auto pr-1">
          {previewTab === 'mapping' ? (
            <div className="space-y-3">
              <div className="bg-sky-50/70 border border-sky-100 rounded-xl p-3 text-xs text-sky-900 flex items-start space-x-2">
                <Sparkles className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Want to keep fields empty?</strong> Any field you set to <em>"Leave Empty"</em> (or leave unselected) will import as blank on your application cards. You only need to provide the <strong>University Name</strong>.
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {UNITRACKER_FIELDS.map((field) => {
                  const mappedIdx = columnMapping[field.key] ?? -1;
                  const isMapped = mappedIdx !== -1;

                  return (
                    <div
                      key={field.key}
                      className={`p-3 sm:p-3.5 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        field.required && !isMapped
                          ? 'border-amber-300 bg-amber-50/30'
                          : isMapped
                          ? 'border-gray-200 bg-white hover:border-gray-300'
                          : 'border-dashed border-gray-200 bg-gray-50/50'
                      }`}
                    >
                      <div className="space-y-0.5 sm:max-w-xs">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-gray-900">
                            {field.label}
                          </span>
                          {field.required && (
                            <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded-full">
                              Required
                            </span>
                          )}
                          {isMapped ? (
                            <Check className="h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <span className="text-[10px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.2 rounded">
                              Empty
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 leading-tight">
                          {field.description}
                        </p>
                      </div>

                      {/* Dropdown Selector */}
                      <div className="flex items-center space-x-2 sm:w-72 shrink-0">
                        <select
                          value={mappedIdx}
                          onChange={(e) => handleSelectColumn(field.key, e.target.value)}
                          className={`w-full px-3 py-2 rounded-xl text-xs font-medium border transition-all focus:outline-none focus:ring-2 focus:ring-black cursor-pointer ${
                            isMapped
                              ? 'bg-emerald-50/50 border-emerald-300 text-gray-900 font-semibold'
                              : 'bg-white border-gray-300 text-gray-500'
                          }`}
                        >
                          <option value="-1">— Leave Empty (Don't import) —</option>
                          {headers.map((colName, colIdx) => (
                            <option key={colIdx} value={colIdx}>
                              Column {colIdx + 1}: "{colName || `Column ${colIdx + 1}`}"
                            </option>
                          ))}
                        </select>

                        {isMapped && !field.required && (
                          <button
                            type="button"
                            onClick={() => handleSelectColumn(field.key, -1)}
                            className="text-[11px] text-gray-400 hover:text-red-600 transition-colors cursor-pointer px-1.5 py-1 rounded hover:bg-gray-100 shrink-0"
                            title="Set this field to empty"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* PREVIEW TAB */
            <div className="space-y-3">
              <div className="text-xs text-gray-500">
                Sample preview showing how the first 3 rows of your file will be converted (empty fields will remain blank on your cards):
              </div>

              <div className="border border-gray-200 rounded-2xl overflow-hidden overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-700 font-bold text-[11px]">
                    <tr>
                      <th className="p-3">#</th>
                      <th className="p-3">University</th>
                      <th className="p-3">Course</th>
                      <th className="p-3">Semester</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Portal</th>
                      <th className="p-3">Date Applied</th>
                      <th className="p-3">Deadline</th>
                      <th className="p-3">Fee</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {sampleRows.map((row, rIdx) => {
                      const getVal = (fieldKey) => {
                        const idx = columnMapping[fieldKey];
                        if (idx === undefined || idx === -1 || !row[idx]) {
                          return <span className="text-gray-300 italic text-[11px]">(empty)</span>;
                        }
                        return String(row[idx]);
                      };

                      return (
                        <tr key={rIdx} className="hover:bg-gray-50/50">
                          <td className="p-3 text-gray-400 font-mono text-[10px]">{rIdx + 1}</td>
                          <td className="p-3 font-semibold text-gray-900">{getVal('universityName')}</td>
                          <td className="p-3 text-gray-700">{getVal('course')}</td>
                          <td className="p-3 text-gray-600">{getVal('intake')}</td>
                          <td className="p-3 text-gray-600">{getVal('status')}</td>
                          <td className="p-3 text-gray-600">{getVal('portal')}</td>
                          <td className="p-3 text-gray-600">{getVal('dateApplied')}</td>
                          <td className="p-3 text-gray-600">{getVal('deadline')}</td>
                          <td className="p-3 text-gray-600">{getVal('applicationFee')}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          {!isUniversityMapped ? (
            <div className="flex items-center space-x-1.5 text-xs text-amber-700 font-medium">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>Please select which column contains the University Name.</span>
            </div>
          ) : (
            <div className="text-xs text-gray-500">
              Ready to import <strong className="text-black">{rawRows.length} applications</strong>
            </div>
          )}

          <div className="flex items-center space-x-2.5 self-end sm:self-center">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold text-gray-600 hover:text-black rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              disabled={!isUniversityMapped}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer ${
                isUniversityMapped
                  ? 'bg-black hover:bg-gray-800 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span>Confirm & Import ({rawRows.length})</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
