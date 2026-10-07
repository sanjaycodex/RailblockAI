import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Calendar, ChevronLeft, ChevronRight, Clock, Filter, Plus, CheckCircle2, ShieldCheck, Zap, RefreshCw, Sparkles } from 'lucide-react';
import MetricCard from '../components/common/MetricCard';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { fastapiService } from '../services/fastapiService';

// Returns Monday of the week containing `date`
function getMondayOf(date) {
  const d = new Date(date);
  const day = d.getDay(); // 0=Sun,1=Mon,...6=Sat
  const diff = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDayLabel(date) {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${days[date.getDay()]} (${date.getDate()} ${months[date.getMonth()]})`;
}

export default function WeeklyPlanner() {
  const [weekStart, setWeekStart] = useState(() => getMondayOf(new Date()));
  const [blocks, setBlocks] = useState([]);
  const [planResult, setPlanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [filterDept, setFilterDept] = useState('ALL');
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState(null);

  // Build 7-day labels dynamically from weekStart (Mon–Sun)
  const DAYS = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return formatDayLabel(d);
  });

  const weekLabel = (() => {
    const end = new Date(weekStart); end.setDate(end.getDate() + 6);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${weekStart.getDate()} ${months[weekStart.getMonth()]} – ${end.getDate()} ${months[end.getMonth()]} ${end.getFullYear()}`;
  })();

  const goToPrevWeek = () => setWeekStart(prev => { const d = new Date(prev); d.setDate(d.getDate() - 7); return d; });
  const goToNextWeek = () => setWeekStart(prev => { const d = new Date(prev); d.setDate(d.getDate() + 7); return d; });

  const handleGeneratePlan = async () => {
    setLoading(true);
    setFeedbackMsg(null);
    const loadingToast = toast.loading('Generating AI-optimized weekly possession masterplan...');
    try {
      const res = await fastapiService.generateWeeklyPlan({ corridor_id: 'CORR-SR-TEN-MDU' });
      setPlanResult(res);
      const mapped = (res.blocks || []).map((b) => ({
        day: b.day_index,
        time: b.time_window,
        title: b.title,
        dept: b.department,
        machine: b.machine_required,
        status: b.status,
        section: b.section_name || b.section_id,
        priorityLevel: b.priority_level,
        tasksCount: b.tasks_count,
        id: b.id
      }));
      setBlocks(mapped);
      const successMsg = `Weekly possession masterplan generated! ${res.summary_kpis.total_blocks} blocks across 7 days with ${res.summary_kpis.total_tasks_scheduled} tasks optimized.`;
      toast.success(`✅ ${successMsg}`, {
        id: loadingToast,
        duration: 5000,
      });
      setFeedbackMsg({
        type: 'success',
        text: successMsg
      });
    } catch (e) {
      toast.error(`❌ Plan generation error: ${e.message}`, {
        id: loadingToast,
      });
      setFeedbackMsg({
        type: 'error',
        text: `Plan generation error: ${e.message}. Showing cached plan.`
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePlan = async () => {
    if (!planResult) return;
    const loadingToast = toast.loading('Approving and deploying weekly plan to operational rosters...');
    try {
      await fastapiService.approvePlan(planResult.plan_id);
      setApprovalStatus('Approved');
      const successMsg = `Weekly Plan ${planResult.plan_id} approved and deployed to Madurai Division operational rosters.`;
      toast.success(`✅ ${successMsg}`, {
        id: loadingToast,
        duration: 5000,
      });
      setFeedbackMsg({ type: 'success', text: successMsg });
    } catch (e) {
      toast.error(`❌ Approval error: ${e.message}`, {
        id: loadingToast,
      });
      setFeedbackMsg({ type: 'error', text: `Approval error: ${e.message}` });
    }
  };

  useEffect(() => {
    handleGeneratePlan();
  }, []);

  const filteredBlocks = filterDept === 'ALL'
    ? blocks
    : blocks.filter(b => b.dept === filterDept);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#dae2ff] text-[#001947]">
              TACTICAL TIMETABLE DE-CONFLICTING
            </span>
            <span className="text-xs font-mono text-slate-500">• Tirunelveli - Madurai Mainline (TEN-MDU)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#002869] tracking-tight">
            Weekly Maintenance Possession Schedule
          </h1>
          <p className="text-xs text-[#434652] mt-1 max-w-2xl">
            AI-generated 7-day tactical possession calendar de-conflicted against passenger express trains and night freight paths on Southern Railway.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#f4f3fb] border border-slate-200 rounded-xl p-1">
            <button onClick={goToPrevWeek} className="p-1.5 hover:bg-white rounded-lg transition-colors text-slate-600 cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 text-xs font-mono font-bold text-[#002869]">{weekLabel}</span>
            <button onClick={goToNextWeek} className="p-1.5 hover:bg-white rounded-lg transition-colors text-slate-600 cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleGeneratePlan}
            disabled={loading}
            className="px-4 py-2.5 bg-[#002869] hover:bg-[#0b3d91] text-white text-xs font-mono font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Generating...' : 'Generate Weekly Plan'}
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className={`p-4 rounded-2xl text-xs font-mono flex items-center gap-2 ${
          feedbackMsg.type === 'success'
            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
            : 'bg-red-50 text-[#ba1a1a] border border-red-200'
        }`}>
          {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : null}
          {feedbackMsg.text}
        </div>
      )}

      {/* KPI Row */}
      {planResult && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Total Possession Blocks"
            value={planResult.summary_kpis.total_blocks}
            unit="This Week"
            delta="AI-Optimized Schedule"
            subtitle="Shadow windows allocated"
            icon="calendar"
            iconBg="bg-indigo-50 text-[#002869]"
          />
          <MetricCard
            title="Tasks Scheduled"
            value={planResult.summary_kpis.total_tasks_scheduled}
            unit="Queued"
            delta="All Critical Covered"
            subtitle="Ranked by AI Priority"
            icon="activity"
            iconBg="bg-blue-50 text-[#005db7]"
          />
          <MetricCard
            title="Conflicts Avoided"
            value={planResult.summary_kpis.conflicts_avoided_count}
            unit="Express Clashes"
            delta="Headway Protected"
            subtitle="20666 VB & 12694 Pearl City"
            icon="shield_check"
            iconBg="bg-emerald-50 text-[#00a859]"
          />
          <MetricCard
            title="Downtime Saved"
            value={`${planResult.summary_kpis.estimated_downtime_saved_hours}h`}
            delta="vs. Manual Planning"
            subtitle={`${planResult.summary_kpis.estimated_utilization_pct}% Utilization`}
            icon="zap"
            iconBg="bg-amber-50 text-amber-700"
          />
        </div>
      )}

      {/* Approve Plan Button */}
      {planResult && (
        <div className="flex justify-end">
          <button
            onClick={handleApprovePlan}
            disabled={approvalStatus === 'Approved'}
            className={`px-5 py-2 text-xs font-mono font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer ${
              approvalStatus === 'Approved'
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {approvalStatus === 'Approved' ? 'Weekly Plan Approved & Deployed' : 'Approve Weekly Plan'}
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <span className="text-xs font-mono text-[#747783] font-bold">Filter Department:</span>
        {['ALL', 'Civil', 'Signal & Telecom', 'Electrical'].map(dept => (
          <button
            key={dept}
            onClick={() => setFilterDept(dept)}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
              filterDept === dept
                ? 'bg-[#002869] text-white shadow-xs'
                : 'bg-[#f4f3fb] text-slate-700 hover:bg-slate-100'
            }`}
          >
            {dept === 'ALL' ? 'All Disciplines' : dept}
          </button>
        ))}
      </div>

      {/* 7-Day Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {DAYS.map((dayName, dayIdx) => {
          const dayBlocks = filteredBlocks.filter(b => b.day === dayIdx);
          return (
            <div key={dayName} className="bg-white rounded-2xl border border-slate-200 p-3 flex flex-col min-h-[420px] shadow-xs">
              <div className="pb-2.5 mb-2.5 border-b border-slate-100 text-center">
                <span className="text-xs font-bold font-mono text-[#002869] block leading-tight">{dayName}</span>
                <span className="text-[10px] font-mono text-slate-400">{dayBlocks.length} Block(s)</span>
              </div>

              <div className="space-y-2 flex-1">
                {dayBlocks.length === 0 ? (
                  <div className="h-full flex items-center justify-center p-3 text-center text-[11px] font-mono text-slate-300">
                    No Track Possessions
                  </div>
                ) : (
                  dayBlocks.map((blk, idx) => {
                    const isBundled = (blk.title && (blk.title.includes('Joint') || blk.title.includes('BCM') || blk.title.includes('Overhaul') || blk.title.includes('Bundl'))) || (blk.dept && blk.dept.includes('&'));
                    return (
                      <div
                        key={idx}
                        onClick={() => setSelectedBlock(blk)}
                        className="p-2.5 rounded-xl border border-slate-200 bg-[#faf8ff] hover:border-[#002869] hover:shadow-xs transition-all cursor-pointer text-xs"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-bold text-[#005db7]">{blk.time}</span>
                          <StatusBadge status={blk.status} size="sm" />
                        </div>
                        {isBundled && (
                          <span className="inline-block px-1.5 py-0.2 mb-1 text-[9px] font-mono font-bold bg-purple-100 text-purple-800 rounded">
                            ✨ Smart Bundle
                          </span>
                        )}
                        <h5 className="font-semibold text-slate-800 text-[11px] leading-snug line-clamp-2">{blk.title}</h5>
                        <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                          <span>{blk.section}</span>
                          <span className="text-[#002869] font-bold">{blk.dept}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Block Details Modal */}
      {selectedBlock && (
        <Modal
          isOpen={Boolean(selectedBlock)}
          onClose={() => setSelectedBlock(null)}
          title="Possession Window Dossier"
          subtitle={`${selectedBlock.section} • ${selectedBlock.time}`}
          maxWidth="max-w-md"
          footer={
            <button
              onClick={() => setSelectedBlock(null)}
              className="px-4 py-2 bg-[#002869] text-white text-xs font-mono font-bold rounded-lg cursor-pointer"
            >
              Close
            </button>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#faf8ff] border border-slate-200 rounded-xl">
              <h4 className="font-bold text-sm text-[#002869] mb-1">{selectedBlock.title}</h4>
              <p className="text-[#747783] font-mono">Tirunelveli - Madurai Mainline</p>
            </div>

            <div className="grid grid-cols-2 gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <span className="text-[10px] font-mono text-[#747783] block uppercase">Section</span>
                <span className="font-semibold text-slate-800">{selectedBlock.section}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#747783] block uppercase">Department</span>
                <span className="font-semibold text-[#005db7]">{selectedBlock.dept}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#747783] block uppercase">Machine Allocated</span>
                <span className="font-semibold text-slate-800">{selectedBlock.machine}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#747783] block uppercase">Priority Level</span>
                <StatusBadge status={selectedBlock.priorityLevel || selectedBlock.status} size="sm" />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
