import { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  Share2, 
  Printer, 
  Send, 
  Sparkles, 
  Snowflake, 
  Sun, 
  Calendar,
  ExternalLink 
} from 'lucide-react';

export default function ShareShortlistModal({ isOpen, onClose, applications = [] }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('text'); // 'text' | 'preview'

  if (!isOpen) return null;

  const winterCount = applications.filter((a) => {
    const intake = (a.intake || 'Winter').toLowerCase();
    return !intake.includes('summer');
  }).length;

  const summerCount = applications.filter((a) => {
    const intake = (a.intake || '').toLowerCase();
    return intake.includes('summer') || intake.includes('sose');
  }).length;

  const p1Count = applications.filter((a) => (a.priority || '1') === '1').length;

  // Format rich text for WhatsApp, Telegram, Discord, and Mentors
  const generateFormattedText = () => {
    if (applications.length === 0) {
      return "No applications shortlisted yet on UniTracker (https://unitracker.live).";
    }

    let text = `🎓 *My German University Shortlist*\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `📊 *Summary:* ${applications.length} Universities | ❄️ ${winterCount} Winter | ☀️ ${summerCount} Summer | ⭐ ${p1Count} Priority 1\n`;
    text += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

    applications.forEach((app, idx) => {
      const isSummer = (app.intake || '').toLowerCase().includes('summer');
      const intakeIcon = isSummer ? '☀️' : '❄️';
      const intakeStr = isSummer ? 'Summer' : 'Winter';
      const pLabel = app.priority === '1' ? 'High (P1)' : app.priority === '2' ? 'Medium (P2)' : 'Low (P3)';
      const deadlineStr = app.deadline || 'TBA';
      const statusStr = app.status || 'Drafting';
      const portalStr = app.portal || 'Direct Portal';
      const vpdStr = app.vpdRequired === 'Yes' ? ' [VPD Required]' : '';

      text += `${idx + 1}. *${app.universityName}*\n`;
      text += `   📚 Course: ${app.course || 'Master Program'}\n`;
      text += `   ${intakeIcon} Semester: ${intakeStr} | 🎯 Priority: ${pLabel}\n`;
      text += `   ⏰ Deadline: ${deadlineStr} | 🌐 Portal: ${portalStr}${vpdStr}\n`;
      text += `   📌 Status: ${statusStr}\n`;
      if (app.courseLink) {
        text += `   🔗 Link: ${app.courseLink}\n`;
      }
      text += `\n`;
    });

    text += `━━━━━━━━━━━━━━━━━━━━━\n`;
    text += `✨ Tracked with UniTracker — https://unitracker.live`;
    return text;
  };

  const shareText = generateFormattedText();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleWhatsAppShare = () => {
    const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My German University Shortlist',
          text: shareText,
          url: 'https://unitracker.live',
        });
      } catch {
        // user cancelled
      }
    } else {
      handleCopy();
    }
  };

  const handlePrint = () => {
    let printFrame = document.getElementById('unitracker-print-frame');
    if (!printFrame) {
      printFrame = document.createElement('iframe');
      printFrame.id = 'unitracker-print-frame';
      printFrame.style.position = 'fixed';
      printFrame.style.right = '0';
      printFrame.style.bottom = '0';
      printFrame.style.width = '0';
      printFrame.style.height = '0';
      printFrame.style.border = 'none';
      document.body.appendChild(printFrame);
    }

    const rowsHtml = applications.map((app, idx) => {
      const isSummer = (app.intake || '').toLowerCase().includes('summer');
      const intakeBadge = isSummer ? '☀️ Summer' : '❄️ Winter';
      const pLabel = app.priority === '1' ? 'P1 (High)' : app.priority === '2' ? 'P2 (Med)' : 'P3 (Low)';
      const deadline = app.deadline || 'TBA';
      const status = app.status || 'Drafting';
      const portal = `${app.portal || 'Direct'}${app.vpdRequired === 'Yes' ? ' (VPD Required)' : ''}`;

      return `
        <tr>
          <td style="padding: 8px 10px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #111827;">
            ${idx + 1}. ${app.universityName}
            <div style="font-size: 11px; font-weight: normal; color: #6b7280; margin-top: 2px;">${app.course || 'Master Program'}</div>
          </td>
          <td style="padding: 8px 10px; border-bottom: 1px solid #e5e7eb; white-space: nowrap; font-size: 11px;">
            <span style="display: inline-block; padding: 2px 7px; border-radius: 9999px; font-size: 11px; font-weight: 600; background: ${isSummer ? '#fef3c7; color: #92400e;' : '#e0f2fe; color: #0369a1;'}">
              ${intakeBadge}
            </span>
          </td>
          <td style="padding: 8px 10px; border-bottom: 1px solid #e5e7eb; white-space: nowrap; font-size: 11px; font-weight: 600;">
            ${pLabel}
          </td>
          <td style="padding: 8px 10px; border-bottom: 1px solid #e5e7eb; white-space: nowrap; font-size: 11px; font-weight: 600;">
            ${deadline}
          </td>
          <td style="padding: 8px 10px; border-bottom: 1px solid #e5e7eb; font-size: 11px; color: #374151;">
            ${portal}
          </td>
          <td style="padding: 8px 10px; border-bottom: 1px solid #e5e7eb; font-size: 11px; font-weight: 500;">
            ${status}
          </td>
        </tr>
      `;
    }).join('');

    const docHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>UniTracker — German University Application Shortlist</title>
          <style>
            @page {
              size: A4 portrait;
              margin: 12mm 10mm;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              color: #111827;
              margin: 0;
              padding: 0;
              background: #ffffff;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .header {
              border-bottom: 2px solid #111827;
              padding-bottom: 10px;
              margin-bottom: 14px;
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
            }
            .logo {
              font-size: 22px;
              font-weight: 800;
              letter-spacing: -1px;
              color: #000000;
            }
            .meta {
              text-align: right;
              font-size: 11px;
              color: #6b7280;
            }
            .summary-box {
              display: flex;
              gap: 12px;
              margin-bottom: 14px;
              background: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 8px 14px;
            }
            .stat {
              flex: 1;
            }
            .stat-label {
              font-size: 9px;
              text-transform: uppercase;
              font-weight: 700;
              color: #6b7280;
              letter-spacing: 0.5px;
            }
            .stat-value {
              font-size: 14px;
              font-weight: 800;
              color: #111827;
              margin-top: 2px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 11px;
            }
            th {
              background: #f3f4f6;
              text-align: left;
              padding: 7px 10px;
              font-size: 10px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              color: #4b5563;
              border-bottom: 1px solid #d1d5db;
            }
            .footer {
              margin-top: 20px;
              padding-top: 8px;
              border-top: 1px solid #e5e7eb;
              font-size: 10px;
              color: #9ca3af;
              display: flex;
              justify-content: space-between;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <div class="logo">unitracker</div>
              <div style="font-size: 11px; color: #4b5563; margin-top: 2px;">Germany University Application Shortlist</div>
            </div>
            <div class="meta">
              <div>Export Date: <strong>${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</strong></div>
              <div style="margin-top: 2px;">unitracker.live</div>
            </div>
          </div>

          <div class="summary-box">
            <div class="stat">
              <div class="stat-label">Total Shortlisted</div>
              <div class="stat-value">${applications.length} Universities</div>
            </div>
            <div class="stat">
              <div class="stat-label">Winter Semester</div>
              <div class="stat-value">❄️ ${winterCount}</div>
            </div>
            <div class="stat">
              <div class="stat-label">Summer Semester</div>
              <div class="stat-value">☀️ ${summerCount}</div>
            </div>
            <div class="stat">
              <div class="stat-label">Priority 1 (Target)</div>
              <div class="stat-value">⭐ ${p1Count}</div>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>University & Course</th>
                <th>Semester</th>
                <th>Priority</th>
                <th>Deadline</th>
                <th>Portal & Requirements</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>

          <div class="footer">
            <span>Generated from UniTracker • Admissions Roadmap & Application Tracker</span>
            <span>https://unitracker.live</span>
          </div>
        </body>
      </html>
    `;

    const frameWindow = printFrame.contentWindow || printFrame.contentDocument.defaultView;
    const frameDoc = printFrame.contentDocument || printFrame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(docHtml);
    frameDoc.close();

    setTimeout(() => {
      frameWindow.focus();
      frameWindow.print();
    }, 250);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-gray-100 relative space-y-5 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-black p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          title="Close modal"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 pr-8">
          <div className="w-11 h-11 bg-black text-white rounded-xl flex items-center justify-center shrink-0 shadow-md">
            <Share2 className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900">Share University Shortlist</h3>
            <p className="text-xs text-gray-500">
              Share your target programs with friends, mentors, WhatsApp groups, or export as PDF.
            </p>
          </div>
        </div>

        {/* Shortlist Quick Stats */}
        <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200/80 text-center">
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Universities</span>
            <p className="text-base font-bold text-gray-900">{applications.length}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Winter / Summer</span>
            <p className="text-base font-bold text-gray-900">❄️ {winterCount} / ☀️ {summerCount}</p>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">P1 Target</span>
            <p className="text-base font-bold text-emerald-600">{p1Count}</p>
          </div>
        </div>

        {/* Tabs: Text vs Print/Table */}
        <div className="flex items-center space-x-2 border-b border-gray-200 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'text'
                ? 'bg-black text-white shadow-xs'
                : 'text-gray-600 hover:text-black hover:bg-gray-100'
            }`}
          >
            WhatsApp / Telegram Text
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-black text-white shadow-xs'
                : 'text-gray-600 hover:text-black hover:bg-gray-100'
            }`}
          >
            Table & PDF Printout
          </button>
        </div>

        {activeTab === 'text' ? (
          /* Formatted Text View */
          <div className="space-y-3">
            <div className="relative">
              <textarea
                readOnly
                value={shareText}
                rows={10}
                className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-800 leading-relaxed focus:outline-none resize-none select-all"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={handleCopy}
                className={`flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer shadow-xs ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-black hover:bg-gray-800 text-white'
                }`}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Formatted Text'}</span>
              </button>

              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="flex items-center space-x-1.5 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
                title="Open WhatsApp with your shortlist"
              >
                <Send className="h-3.5 w-3.5" />
                <span>WhatsApp</span>
              </button>

              {typeof navigator !== 'undefined' && navigator.share && (
                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="flex items-center space-x-1.5 py-2.5 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                  title="Share to apps"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Share</span>
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Table & PDF Preview */
          <div className="space-y-4">
            <div className="max-h-72 overflow-y-auto border border-gray-200 rounded-xl">
              <table className="w-full text-left text-xs text-gray-700 divide-y divide-gray-200">
                <thead className="bg-gray-50 sticky top-0 text-[11px] font-bold uppercase text-gray-500">
                  <tr>
                    <th className="px-3 py-2">University & Course</th>
                    <th className="px-3 py-2">Semester</th>
                    <th className="px-3 py-2">Priority</th>
                    <th className="px-3 py-2">Deadline</th>
                    <th className="px-3 py-2">Portal / VPD</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {applications.map((app) => (
                    <tr key={app.id} className="hover:bg-gray-50/70">
                      <td className="px-3 py-2 font-medium text-gray-900">
                        <div>{app.universityName}</div>
                        <div className="text-[11px] text-gray-500">{app.course || 'Master'}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="text-xs font-semibold">
                          {(app.intake || '').toLowerCase().includes('summer') ? '☀️ Summer' : '❄️ Winter'}
                        </span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        <span className="font-semibold text-gray-900">P{app.priority || '1'}</span>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap font-medium">
                        {app.deadline || 'TBA'}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-600">
                        {app.portal || 'Direct'}
                        {app.vpdRequired === 'Yes' && ' (VPD)'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-gray-500">
                Clicking print opens your browser dialog. Select <strong>Save as PDF</strong> to generate a document.
              </p>
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center space-x-1.5 bg-black hover:bg-gray-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              >
                <Printer className="h-4 w-4" />
                <span>Print / Save as PDF</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
