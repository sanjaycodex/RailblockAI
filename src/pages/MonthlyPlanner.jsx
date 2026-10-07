import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Filter, Plus, ShieldCheck, Clock, Layers, CheckCircle2, Sparkles, RefreshCw } from 'lucide-react';
import MetricCard from '../components/common/MetricCard';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { fastapiService } from '../services/fastapiService';

const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];

export default function MonthlyPlanner() {
  // Default to the actual current month
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() }; // 0-indexed
  });
  const currentMonth = `${MONTH_NAMES[currentDate.month]} ${currentDate.year}`;

  const [planResult, setPlanResult] = useState(null);
  const [monthEvents, setMonthEvents] = useState({});
  const [loading, setLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const goToPrevMonth = () => setCurrentDate(prev => {
    const d = new Date(prev.year, prev.month - 1, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const goToNextMonth = () => setCurrentDate(prev => {
    const d = new Date(prev.year, prev.month + 1, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const handleGeneratePlan = async () => {
    setLoading(true);
    setFeedbackMsg(null);
    try {
      const res = await fastapiService.generateMonthlyPlan({ corridor_id: 'CORR-SR-TEN-MDU' });
      setPlanResult(res);

      // Map blocks to calendar day events
      const events = {};
      (res.blocks || []).forEach(b => {
        const day = b.day_index;
        const deptType = (b.department || 'Civil').toLowerCase().includes('signal') ? 'st'
          : (b.department || 'Civil').toLowerCase().includes('electrical') ? 'electrical'
          : 'civil';
        if (!events[day]) events[day] = [];
        events[day].push({
          title: b.title,
          type: deptType,
          status: b.status,
          section: b.section_name || b.section_id,
          department: b.department,
          machine: b.machine_required,
          priorityLevel: b.priority_level,
          timeWindow: b.time_window,
          id: b.id
        });
      });
      setMonthEvents(events);
      setFeedbackMsg({
        type: 'success',
        text: `Monthly masterplan generated! ${res.summary_kpis.total_blocks} strategic possession blocks across 30 days, ${res.summary_kpis.conflicts_avoided_count} train conflicts avoided.`
      });
    } catch (e) {
      setFeedbackMsg({ type: 'error', text: `Monthly plan error: ${e.message}` });
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePlan = async () => {
    if (!planResult) return;
    try {
      await fastapiService.approvePlan(planResult.plan_id);
      setApprovalStatus('Approved');
      setFeedbackMsg({ type: 'success', text: `Monthly Masterplan ${planResult.plan_id} approved and deployed to Madurai Division strategic operations.` });
    } catch (e) {
      setFeedbackMsg({ type: 'error', text: `Approval error: ${e.message}` });
    }
  };

  useEffect(() => {
    handleGeneratePlan();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#dae2ff] text-[#001947]">
              STRATEGIC CAPACITY MANAGEMENT
            </span>
            <span className="text-xs font-mono text-slate-500">• Tirunelveli - Madurai Mainline (TEN-MDU)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#002869] tracking-tight">
            Monthly Strategic Maintenance Masterplan
          </h1>
          <p className="text-xs text-[#434652] mt-1 max-w-2xl">
            AI-generated 30-day strategic possession plan for heavy track machines, BCM deep screening, and TRD annual catenary overhauls on Madurai Division.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#f4f3fb] border border-slate-200 rounded-xl p-1">
            <button onClick={goToPrevMonth} className="p-1.5 hover:bg-white rounded-lg transition-colors text-slate-600 cursor-pointer">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-4 text-xs font-mono font-bold text-[#002869]">{currentMonth}</span>
            <button onClick={goToNextMonth} className="p-1.5 hover:bg-white rounded-lg transition-colors text-slate-600 cursor-pointer">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleGeneratePlan}
            disabled={loading}
            className="px-4 py-2.5 bg-[#002869] hover:bg-[#0b3d91] text-white text-xs font-mono font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Generating...' : 'Generate Monthly Plan'}
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
            title="Strategic Possession Blocks"
            value={planResult.summary_kpis.total_blocks}
            unit="This Month"
            delta="AI-Optimized Masterplan"
            subtitle="30-Day Strategic Horizon"
            icon="calendar"
            iconBg="bg-indigo-50 text-[#002869]"
          />
          <MetricCard
            title="Critical Tasks Covered"
            value={planResult.summary_kpis.critical_tasks_covered}
            unit="High-Priority"
            delta="Zero Deferred Safety Items"
            subtitle="P1 & High Priority Included"
            icon="shield_check"
            iconBg="bg-emerald-50 text-[#00a859]"
          />
          <MetricCard
            title="Train Conflicts Avoided"
            value={planResult.summary_kpis.conflicts_avoided_count}
            unit="Clashes Prevented"
            delta="Headway & Express Protected"
            subtitle="Full Timetable De-conflicting"
            icon="activity"
            iconBg="bg-blue-50 text-[#005db7]"
          />
          <MetricCard
            title="Estimated Downtime Savings"
            value={`${planResult.summary_kpis.estimated_downtime_saved_hours}h`}
            delta="vs. Manual Paper-Based Planning"
            subtitle={`${planResult.summary_kpis.estimated_utilization_pct}% Utilization`}
            icon="zap"
            iconBg="bg-amber-50 text-amber-700"
          />
        </div>
      )}

      {/* Approve Plan */}
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
            {approvalStatus === 'Approved' ? 'Monthly Masterplan Approved & Deployed' : 'Approve Monthly Masterplan'}
          </button>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="grid grid-cols-7 gap-px bg-slate-200 rounded-xl overflow-hidden text-center text-xs font-mono">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="bg-[#f4f3fb] p-2.5 font-bold text-[#002869]">{d}</div>
          ))}
          {(() => {
            // Compute the day-of-week offset for the 1st of this month (0=Sun)
            const firstDow = new Date(currentDate.year, currentDate.month, 1).getDay();
            const daysInMonth = new Date(currentDate.year, currentDate.month + 1, 0).getDate();
            const totalCells = Math.ceil((firstDow + daysInMonth) / 7) * 7;
            return Array.from({ length: totalCells }, (_, idx) => {
              const dayNum = idx - firstDow + 1;
              const isValidDay = dayNum >= 1 && dayNum <= daysInMonth;
              const events = isValidDay ? monthEvents[dayNum] || [] : [];
              return (
                <div
                  key={idx}
                  className={`bg-white min-h-[105px] p-2 text-left transition-colors flex flex-col justify-between ${
                    !isValidDay ? 'bg-slate-50/50 opacity-40' : 'hover:bg-[#faf8ff]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className={`font-mono font-bold text-xs ${isValidDay ? 'text-slate-900' : 'text-slate-300'}`}>
                      {isValidDay ? dayNum : ''}
                    </span>
                    {events.length > 0 && <span className="w-1.5 h-1.5 rounded-full bg-[#005db7]" />}
                  </div>
                  <div className="space-y-1 mt-1">
                    {events.map((ev, evIdx) => (
                      <div
                        key={evIdx}
                        onClick={() => setSelectedEvent(ev)}
                        className={`p-1 rounded text-[10px] font-mono leading-tight truncate cursor-pointer ${
                          ev.type === 'civil'
                            ? 'bg-blue-50 text-[#002869] border border-blue-200 hover:bg-blue-100'
                            : ev.type === 'electrical'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100'
                        }`}
                      >
                        {ev.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* Event Modal */}
      {selectedEvent && (
        <Modal
          isOpen={Boolean(selectedEvent)}
          onClose={() => setSelectedEvent(null)}
          title="Monthly Possession Dossier"
          subtitle={`${selectedEvent.section} • ${selectedEvent.timeWindow || '01:00 - 04:30 AM'}`}
          maxWidth="max-w-md"
          footer={
            <button
              onClick={() => setSelectedEvent(null)}
              className="px-4 py-2 bg-[#002869] text-white text-xs font-mono font-bold rounded-lg cursor-pointer"
            >
              Close
            </button>
          }
        >
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-[#faf8ff] border border-slate-200 rounded-xl">
              <h4 className="font-bold text-sm text-[#002869] mb-1">{selectedEvent.title}</h4>
              <p className="text-[#747783] font-mono">Tirunelveli - Madurai Mainline</p>
            </div>
            <div className="grid grid-cols-2 gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <span className="text-[10px] font-mono text-[#747783] block uppercase">Section</span>
                <span className="font-semibold text-slate-800">{selectedEvent.section}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#747783] block uppercase">Department</span>
                <span className="font-semibold text-[#005db7]">{selectedEvent.department}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#747783] block uppercase">Machine</span>
                <span className="font-semibold text-slate-800">{selectedEvent.machine}</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-[#747783] block uppercase">Priority Level</span>
                <StatusBadge status={selectedEvent.priorityLevel || 'Medium'} size="sm" />
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
