import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Download, FileText, CheckCircle2, FileSpreadsheet } from 'lucide-react';
import Modal from './Modal';
import { CORRIDORS } from '../../data/railwayData';

export default function ExportReportModal({ isOpen, onClose }) {
  const [reportType, setReportType] = useState('monthly-audit');
  const [format, setFormat] = useState('pdf');
  const [corridor, setCorridor] = useState(CORRIDORS[0].id);
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);

  if (!isOpen) return null;

  const handleExport = async (e) => {
    e.preventDefault();
    setIsExporting(true);
    
    const loadingToast = toast.loading(`Generating ${format.toUpperCase()} report...`);

    try {
      // Generate report content based on selection
      const reportContent = generateReportContent(reportType, corridor, format);
      
      // Create and download the file
      if (format === 'pdf') {
        downloadPDFReport(reportContent, reportType);
      } else if (format === 'xlsx') {
        downloadExcelReport(reportContent, reportType);
      }
      
      toast.success(`✅ ${format.toUpperCase()} report downloaded successfully!`, {
        id: loadingToast,
        duration: 3000,
      });
      
      setExported(true);
      setTimeout(() => {
        setExported(false);
        onClose();
      }, 1200);
    } catch (error) {
      toast.error(`❌ Export failed: ${error.message}`, {
        id: loadingToast,
      });
    } finally {
      setIsExporting(false);
    }
  };

  const generateReportContent = (type, corridorId, format) => {
    const date = new Date().toLocaleDateString('en-IN');
    const corridorName = CORRIDORS.find(c => c.id === corridorId)?.name || 'All Network Corridors';
    
    const reportTypes = {
      'monthly-audit': 'Executive Monthly Maintenance & Punctuality Audit',
      'bundling-efficiency': 'Smart Block Bundling & Line Capacity Savings',
      'defect-tqi': 'Track Quality Index (TQI) & USFD Defect Log',
      'machine-output': 'Plasser Track Machine Output & Crew Utilization'
    };
    
    return {
      title: reportTypes[type],
      corridor: corridorName,
      generatedDate: date,
      generatedBy: 'RailBlockAI System',
      data: getSampleReportData(type)
    };
  };

  const getSampleReportData = (type) => {
    // Generate sample data based on report type
    switch (type) {
      case 'monthly-audit':
        return {
          totalTasks: 47,
          completedTasks: 42,
          criticalTasks: 5,
          avgPunctuality: '98.2%',
          downtimeSaved: '14.5 hours',
          costSavings: '₹12.4 Lakhs'
        };
      case 'bundling-efficiency':
        return {
          bundlesCreated: 8,
          tasksCoordinated: 24,
          downtimeSaved: '5.6 hours',
          costSavings: '₹8.4 Lakhs',
          compatibility: '96.5%'
        };
      case 'defect-tqi':
        return {
          tqiScore: 92.4,
          usfdDefects: 12,
          criticalDefects: 3,
          repairsCompleted: 9
        };
      case 'machine-output':
        return {
          machineHours: 156,
          crewUtilization: '87%',
          tasksCompleted: 18,
          efficiency: '92%'
        };
      default:
        return {};
    }
  };

  const downloadPDFReport = (content, type) => {
    // Create HTML content for PDF
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${content.title}</title>
  <style>
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      margin: 40px;
      color: #002869;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #002869;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #002869;
      margin-bottom: 10px;
    }
    h1 {
      color: #002869;
      font-size: 22px;
      margin: 10px 0;
    }
    .meta {
      font-size: 12px;
      color: #666;
      margin-top: 10px;
    }
    .section {
      margin: 25px 0;
      padding: 20px;
      background: #f4f3fb;
      border-left: 4px solid #002869;
    }
    .section h2 {
      color: #002869;
      font-size: 18px;
      margin-bottom: 15px;
    }
    .data-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
      margin-top: 15px;
    }
    .data-item {
      padding: 12px;
      background: white;
      border: 1px solid #ddd;
      border-radius: 6px;
    }
    .data-label {
      font-size: 11px;
      color: #666;
      text-transform: uppercase;
      font-weight: bold;
      margin-bottom: 5px;
    }
    .data-value {
      font-size: 20px;
      font-weight: bold;
      color: #002869;
    }
    .footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 2px solid #ddd;
      text-align: center;
      font-size: 11px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">🚂 RailBlockAI - Railway Maintenance Intelligence</div>
    <h1>${content.title}</h1>
    <div class="meta">
      <div><strong>Corridor:</strong> ${content.corridor}</div>
      <div><strong>Generated:</strong> ${content.generatedDate}</div>
      <div><strong>System:</strong> ${content.generatedBy}</div>
    </div>
  </div>

  <div class="section">
    <h2>Report Summary</h2>
    <div class="data-grid">
      ${Object.entries(content.data).map(([key, value]) => `
        <div class="data-item">
          <div class="data-label">${key.replace(/([A-Z])/g, ' $1').trim()}</div>
          <div class="data-value">${value}</div>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="section">
    <h2>AI-Powered Insights</h2>
    <p>This report was generated using RailBlockAI's hybrid intelligence system combining:</p>
    <ul>
      <li><strong>Machine Learning:</strong> Random Forest failure risk prediction</li>
      <li><strong>OR-Tools Optimization:</strong> Google constraint programming solver</li>
      <li><strong>Smart Bundling:</strong> Cross-department coordination algorithms</li>
      <li><strong>Real-time Data:</strong> Live telemetry from Tirunelveli-Madurai corridor</li>
    </ul>
  </div>

  <div class="footer">
    <p><strong>Southern Railway - Madurai Division</strong></p>
    <p>Smart India Hackathon 2026 | Railway Maintenance Intelligence System</p>
    <p>Generated by RailBlockAI on ${content.generatedDate}</p>
  </div>
</body>
</html>
    `;

    // Create blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const fileName = `RailBlockAI_${type}_${new Date().getTime()}.html`;
    
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const downloadExcelReport = (content, type) => {
    // Create CSV content for Excel
    const csvContent = [
      ['Railway Maintenance Intelligence Report'],
      [''],
      ['Report Type', content.title],
      ['Corridor', content.corridor],
      ['Generated Date', content.generatedDate],
      ['Generated By', content.generatedBy],
      [''],
      ['Metric', 'Value'],
      ...Object.entries(content.data).map(([key, value]) => [
        key.replace(/([A-Z])/g, ' $1').trim(),
        value
      ])
    ].map(row => row.join(',')).join('\n');

    // Add BOM for proper UTF-8 encoding in Excel
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const fileName = `RailBlockAI_${type}_${new Date().getTime()}.csv`;
    
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Export Railway Maintenance & Punctuality Report"
      subtitle="Generate official division audit logs & AI optimization summaries"
      maxWidth="max-w-md"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleExport}
            disabled={isExporting || exported}
            className="px-4 py-2 text-xs font-mono font-semibold text-white bg-[#002869] hover:bg-[#0b3d91] rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {exported ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                Report Downloaded!
              </>
            ) : isExporting ? (
              'Compiling Report...'
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download {format.toUpperCase()}
              </>
            )}
          </button>
        </>
      }
    >
      <form onSubmit={handleExport} className="space-y-4 text-xs">
        <div>
          <label className="block font-bold text-[#002869] mb-1 font-mono uppercase">
            Report Type
          </label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full px-3 py-2 bg-[#f4f3fb] border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
          >
            <option value="monthly-audit">Executive Monthly Maintenance & Punctuality Audit</option>
            <option value="bundling-efficiency">Smart Block Bundling & Line Capacity Savings</option>
            <option value="defect-tqi">Track Quality Index (TQI) & USFD Defect Log</option>
            <option value="machine-output">Plasser Track Machine Output & Crew Utilization</option>
          </select>
        </div>

        <div>
          <label className="block font-bold text-[#002869] mb-1 font-mono uppercase">
            Corridor Selection
          </label>
          <select
            value={corridor}
            onChange={(e) => setCorridor(e.target.value)}
            className="w-full px-3 py-2 bg-[#f4f3fb] border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
          >
            <option value="ALL">All Network Corridors</option>
            {CORRIDORS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block font-bold text-[#002869] mb-1.5 font-mono uppercase">
            File Format
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setFormat('pdf')}
              className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                format === 'pdf'
                  ? 'border-[#002869] bg-[#e9edff] text-[#002869] font-bold shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700'
              }`}
            >
              <FileText className="w-5 h-5 text-red-600" />
              <div className="text-left">
                <span className="block font-mono text-xs">PDF Document</span>
                <span className="text-[10px] text-slate-500 font-normal">Formatted executive report</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setFormat('xlsx')}
              className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                format === 'xlsx'
                  ? 'border-[#002869] bg-[#e9edff] text-[#002869] font-bold shadow-xs'
                  : 'border-slate-200 bg-white text-slate-700'
              }`}
            >
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
              <div className="text-left">
                <span className="block font-mono text-xs">Excel Data</span>
                <span className="text-[10px] text-slate-500 font-normal">Raw telemetry & metrics</span>
              </div>
            </button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
