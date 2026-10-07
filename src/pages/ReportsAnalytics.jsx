import React, { useState } from 'react';
import { BarChart3, Download, TrendingUp, Calendar, Filter, FileText, CheckCircle2 } from 'lucide-react';
import MetricCard from '../components/common/MetricCard';
import ExportReportModal from '../components/common/ExportReportModal';
import { SYSTEM_METRICS } from '../data/railwayData';

export default function ReportsAnalytics() {
  const [exportOpen, setExportOpen] = useState(false);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#dae2ff] text-[#001947]">
              EXECUTIVE AUDIT SUITE
            </span>
            <span className="text-xs font-mono text-slate-500">• Railway Board Reporting Format</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#002869] tracking-tight">
            Reports & Operational Analytics
          </h1>
          <p className="text-xs text-[#434652] mt-1 max-w-2xl">
            Historical maintenance performance, machine output yields, bundling efficiency ratios, and punctuality correlation graphs.
          </p>
        </div>

        <button
          onClick={() => setExportOpen(true)}
          className="px-4 py-2.5 bg-[#002869] hover:bg-[#0b3d91] text-white text-xs font-mono font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Export Report
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Maintenance Blocks Executed"
          value="142"
          delta="+18 vs Target"
          subtitle="100% Safety Compliance"
          icon="bar_chart"
          iconBg="bg-blue-50 text-[#005db7]"
        />
        <MetricCard
          title="Overall Line Capacity Preserved"
          value="96.4%"
          delta="+3.1%"
          subtitle="Punctuality benchmark"
          icon="trending_up"
          iconBg="bg-emerald-50 text-[#00a859]"
        />
        <MetricCard
          title="Bundled Mega Blocks Yield"
          value="38"
          delta="48.5% Efficiency"
          subtitle="Hours saved"
          icon="layers"
          iconBg="bg-purple-50 text-purple-700"
        />
        <MetricCard
          title="Net Carbon Offset"
          value="128.4 T"
          delta="+12.8 T"
          subtitle="Via reduced train idling"
          icon="eco"
          iconBg="bg-emerald-50 text-emerald-600"
        />
      </div>

      {/* Analytical Charts Preview Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Punctuality vs Block Grants */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-[#002869] text-base">
                Punctuality Index vs. Block Hours Granted
              </h3>
              <p className="text-xs text-[#747783]">Last 6 Months correlation trend</p>
            </div>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              +0.92 Positive Correlation
            </span>
          </div>

          <div className="h-48 bg-[#faf8ff] rounded-xl border border-slate-100 p-4 flex items-end justify-between gap-3">
            {[
              { month: 'Mar', punct: 91.2, blocks: 110 },
              { month: 'Apr', punct: 92.8, blocks: 118 },
              { month: 'May', punct: 94.1, blocks: 126 },
              { month: 'Jun', punct: 95.0, blocks: 132 },
              { month: 'Jul', punct: 95.8, blocks: 138 },
              { month: 'Aug', punct: 96.4, blocks: 142 }
            ].map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div className="w-full flex items-end justify-center gap-1 h-32">
                  <div
                    className="w-4 bg-[#002869] rounded-t-md transition-all hover:bg-[#005db7]"
                    style={{ height: `${(d.punct - 80) * 5}%` }}
                    title={`Punctuality: ${d.punct}%`}
                  />
                  <div
                    className="w-4 bg-[#00a859] rounded-t-md transition-all hover:bg-emerald-400"
                    style={{ height: `${(d.blocks / 160) * 100}%` }}
                    title={`Blocks: ${d.blocks}`}
                  />
                </div>
                <span className="font-mono text-[11px] text-slate-600 font-bold">{d.month}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-6 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#002869]" />
              <span className="text-slate-700">Passenger Punctuality %</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-[#00a859]" />
              <span className="text-slate-700">Block Hours Completed</span>
            </div>
          </div>
        </div>

        {/* Departmental Allocation Breakdown */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-[#002869] text-base">
                Departmental Possession Window Share
              </h3>
              <p className="text-xs text-[#747783]">Current Fiscal Quarter</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { dept: 'Civil Engineering (P-Way & Track Machines)', pct: 54, color: 'bg-[#002869]' },
              { dept: 'Electrical Traction & 25kV OHE (TRD)', pct: 26, color: 'bg-[#005db7]' },
              { dept: 'Signal & Telecommunication (S&T)', pct: 15, color: 'bg-[#00a859]' },
              { dept: 'Bridge & Structural Inspections', pct: 5, color: 'bg-amber-500' }
            ].map((item) => (
              <div key={item.dept} className="space-y-1">
                <div className="flex justify-between text-xs font-medium">
                  <span className="text-slate-800">{item.dept}</span>
                  <span className="font-mono font-bold text-[#002869]">{item.pct}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SMART BUNDLING ANALYTICS SECTION */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-[#005db7] block">
              CROSS-DEPARTMENT SMART BUNDLING AUDIT
            </span>
            <h3 className="text-lg font-bold text-[#002869]">
              Multi-Discipline Coordination &amp; Possession Yield Analysis
            </h3>
          </div>
          <span className="px-3 py-1 bg-purple-50 text-purple-700 border border-purple-200 rounded-xl font-mono text-xs font-bold">
            +38.5% Line Capacity Yield
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-[#f4f3fb] border border-slate-200 rounded-xl space-y-1">
            <span className="text-[10px] font-mono text-[#747783] block uppercase">Bundled Possession Share</span>
            <span className="text-xl font-extrabold text-[#002869] font-mono">68.2%</span>
            <p className="text-[11px] text-slate-500">of all track blocks are multi-department</p>
          </div>

          <div className="p-4 bg-[#f4f3fb] border border-slate-200 rounded-xl space-y-1">
            <span className="text-[10px] font-mono text-[#747783] block uppercase">Tasks Coordinated</span>
            <span className="text-xl font-extrabold text-emerald-700 font-mono">42 Tasks</span>
            <p className="text-[11px] text-slate-500">synchronized across Civil, S&amp;T, TRD</p>
          </div>

          <div className="p-4 bg-[#f4f3fb] border border-slate-200 rounded-xl space-y-1">
            <span className="text-[10px] font-mono text-[#747783] block uppercase">Separate Blocks Avoided</span>
            <span className="text-xl font-extrabold text-[#005db7] font-mono">28 Blocks</span>
            <p className="text-[11px] text-slate-500">eliminating duplicate track lockout</p>
          </div>

          <div className="p-4 bg-[#f4f3fb] border border-slate-200 rounded-xl space-y-1">
            <span className="text-[10px] font-mono text-[#747783] block uppercase">Bundle Acceptance Rate</span>
            <span className="text-xl font-extrabold text-purple-700 font-mono">94.0%</span>
            <p className="text-[11px] text-slate-500">by operating divisional control</p>
          </div>
        </div>
      </div>

      <ExportReportModal isOpen={exportOpen} onClose={() => setExportOpen(false)} />
    </div>
  );
}

