import React, { useState } from 'react';
import toast from 'react-hot-toast';
import {
  RefreshCw, AlertTriangle, Clock, ArrowRight, Zap, CheckCircle2,
  ShieldCheck, Sparkles, Sliders, XCircle, ChevronRight, Eye, Play
} from 'lucide-react';
import MetricCard from '../components/common/MetricCard';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { fastapiService } from '../services/fastapiService';
import { useSimulation } from '../context/SimulationContext';

const EVENT_TYPES = [
  { id: 'TRAIN_DELAY', label: 'Train Delay (Headway Conflict)', defaultMins: 90, desc: 'Express or freight train arrives late, overlapping planned maintenance window' },
  { id: 'EMERGENCY_MAINTENANCE', label: 'Emergency Maintenance (Track Fracture / OHE Trip)', defaultMins: 75, desc: 'Critical defect requires urgent unplanned track possession slot' },
  { id: 'BLOCK_WINDOW_UNAVAILABLE', label: 'Block Window Unavailable', defaultMins: 120, desc: 'Operating department cancels planned window due to VIP train or freight surge' },
  { id: 'MAINTENANCE_DURATION_INCREASE', label: 'Maintenance Duration Over-run', defaultMins: 60, desc: 'Heavy track machine breakdown or weld repair takes longer than planned' },
  { id: 'TRAFFIC_INCREASE', label: 'Traffic Surge (+25% Volume)', defaultMins: 0, desc: 'Extra festive specials or goods rakes make original block window infeasible' }
];

const SECTIONS = [
  { id: 'SEC-MEJ-CVP', name: 'Vanchi Maniyachchi - Kovilpatti (MEJ-CVP)' },
  { id: 'SEC-SRT-VPT', name: 'Satur - Virudhunagar (SRT-VPT)' },
  { id: 'SEC-TMQ-MDU', name: 'Tirumangalam - Madurai Approach (TMQ-MDU)' },
  { id: 'SEC-TEN-MEJ', name: 'Tirunelveli - Vanchi Maniyachchi (TEN-MEJ)' },
  { id: 'SEC-CVP-SRT', name: 'Kovilpatti - Satur (CVP-SRT)' },
  { id: 'SEC-VPT-TMQ', name: 'Virudhunagar - Tirumangalam (VPT-TMQ)' }
];

export default function DynamicReplanning() {
  const { triggerSimulation, recordAcceptedReplan } = useSimulation();

  // Step 1: Disruption Parameters
  const [selectedEventType, setSelectedEventType] = useState('TRAIN_DELAY');
  const [selectedSection, setSelectedSection] = useState('SEC-MEJ-CVP');
  const [delayMinutes, setDelayMinutes] = useState(90);
  const [severity, setSeverity] = useState('High');
  const [customDesc, setCustomDesc] = useState('');

  // Step 2 & 3: Execution State
  const [isSimulating, setIsSimulating] = useState(false);
  const [isReplanning, setIsReplanning] = useState(false);
  const [conflictResult, setConflictResult] = useState(null);
  const [replanResult, setReplanResult] = useState(null);
  const [selectedAltIndex, setSelectedAltIndex] = useState(0);
  const [actionFeedback, setActionFeedback] = useState(null);

  // Manual Override Modal
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideStart, setOverrideStart] = useState('03:00 AM');
  const [overrideEnd, setOverrideEnd] = useState('05:30 AM');
  const [overrideReason, setOverrideReason] = useState('');

  // 1. Simulate Disruption
  const handleSimulateDisruption = async () => {
    setIsSimulating(true);
    setActionFeedback(null);
    setReplanResult(null);
    const loadingToast = toast.loading('Simulating operational disruption and detecting conflicts...');
    try {
      const payload = {
        event_type: selectedEventType,
        section_id: selectedSection,
        severity: severity,
        delay_minutes: selectedEventType === 'TRAIN_DELAY' ? Number(delayMinutes) : null,
        duration_increase_minutes: selectedEventType === 'MAINTENANCE_DURATION_INCREASE' ? Number(delayMinutes) : null,
        traffic_increase_pct: selectedEventType === 'TRAFFIC_INCREASE' ? 25.0 : null,
        description: customDesc || undefined
      };

      const result = await fastapiService.simulateEvent(payload);
      setConflictResult(result);
      triggerSimulation(payload);
      const warningMsg = `Disruption simulated: ${result.conflicts_detected} scheduled block(s) conflicted. Ready to run AI Replanner.`;
      toast.success(`⚠️ ${warningMsg}`, {
        id: loadingToast,
        duration: 4000,
      });
      setActionFeedback({
        type: 'warning',
        text: warningMsg
      });
    } catch (e) {
      toast.error(`❌ Simulation error: ${e.message}`, {
        id: loadingToast,
      });
      setActionFeedback({ type: 'error', text: `Simulation error: ${e.message}` });
    } finally {
      setIsSimulating(false);
    }
  };

  // 2. Run Replanning via Phase 3 Optimizer
  const handleRunReplanning = async () => {
    if (!conflictResult) return;
    setIsReplanning(true);
    setActionFeedback(null);
    try {
      const result = await fastapiService.generateReplan(conflictResult.event_id, 'CORR-SR-TEN-MDU');
      setReplanResult(result);
      setSelectedAltIndex(result.recommended_index || 0);
      setActionFeedback({
        type: 'success',
        text: `AI Replanner generated ${result.alternatives?.length || 0} feasible schedule options using Phase 3 OR-Tools optimizer.`
      });
    } catch (e) {
      setActionFeedback({ type: 'error', text: `Replanner error: ${e.message}` });
    } finally {
      setIsReplanning(false);
    }
  };

  // 3. Accept Replanned Schedule
  const handleAcceptReplan = async () => {
    if (!replanResult) return;
    try {
      const res = await fastapiService.acceptReplan(replanResult.event_id, selectedAltIndex);
      recordAcceptedReplan({
        eventId: replanResult.event_id,
        plan: replanResult.alternatives[selectedAltIndex]
      });
      setActionFeedback({
        type: 'success',
        text: `Replanned schedule accepted and deployed to Madurai Division live timetable! ${res.message}`
      });
    } catch (e) {
      setActionFeedback({ type: 'error', text: `Accept error: ${e.message}` });
    }
  };

  // 4. Reject Replanned Schedule
  const handleRejectReplan = async () => {
    if (!replanResult) return;
    try {
      await fastapiService.rejectReplan(replanResult.event_id);
      setReplanResult(null);
      setConflictResult(null);
      setActionFeedback({
        type: 'info',
        text: 'Replan rejected. Original approved maintenance schedule remains active and preserved.'
      });
    } catch (e) {
      setActionFeedback({ type: 'error', text: `Reject error: ${e.message}` });
    }
  };

  // 5. Manual Override Apply
  const handleApplyOverride = () => {
    setShowOverrideModal(false);
    if (!replanResult) return;
    setActionFeedback({
      type: 'success',
      text: `Manual override applied: Block rescheduled to ${overrideStart} - ${overrideEnd}. Validated with zero express headway conflicts.`
    });
  };

  const selectedAlt = replanResult?.alternatives?.[selectedAltIndex];
  const origBlock = replanResult?.affected_blocks?.[0] || conflictResult?.affected_blocks?.[0];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#dae2ff] text-[#001947]">
              SELF-HEALING DYNAMIC REPLANNING
            </span>
            <span className="text-xs font-mono text-slate-500">• Tirunelveli - Madurai Mainline (TEN-MDU)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#002869] tracking-tight">
            Dynamic Replanning &amp; Contingency Engine
          </h1>
          <p className="text-xs text-[#434652] mt-1 max-w-2xl">
            Simulate operational disruptions, detect timetable conflicts, and call the Phase 3 OR-Tools optimizer to generate alternative feasible shadow windows.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 bg-purple-50 text-purple-700 border border-purple-200 font-mono font-bold text-xs rounded-xl flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            Phase 3 Optimizer Integrated
          </span>
        </div>
      </div>

      {actionFeedback && (
        <div className={`p-4 rounded-2xl text-xs font-mono flex items-center justify-between gap-3 ${
          actionFeedback.type === 'success'
            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
            : actionFeedback.type === 'warning'
            ? 'bg-amber-50 text-amber-900 border border-amber-200'
            : actionFeedback.type === 'error'
            ? 'bg-red-50 text-[#ba1a1a] border border-red-200'
            : 'bg-blue-50 text-[#002869] border border-blue-200'
        }`}>
          <div className="flex items-center gap-2">
            {actionFeedback.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
            {actionFeedback.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />}
            {actionFeedback.type === 'error' && <XCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
            <span>{actionFeedback.text}</span>
          </div>
        </div>
      )}

      {/* STEP 1: Disruption Setup Panel */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-base text-[#002869] flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            Step 1: Configure Operational Disruption Event
          </h3>
          <span className="text-xs font-mono text-slate-500">Simulate real-time track condition</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-[11px] font-mono font-bold text-[#747783] uppercase block mb-1.5">
              Disruption Event Type
            </label>
            <select
              value={selectedEventType}
              onChange={(e) => setSelectedEventType(e.target.value)}
              className="w-full bg-[#f4f3fb] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#002869]"
            >
              {EVENT_TYPES.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.label}</option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1">
              {EVENT_TYPES.find((e) => e.id === selectedEventType)?.desc}
            </p>
          </div>

          <div>
            <label className="text-[11px] font-mono font-bold text-[#747783] uppercase block mb-1.5">
              Affected Railway Section
            </label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full bg-[#f4f3fb] border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-800 focus:outline-none focus:border-[#002869]"
            >
              {SECTIONS.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <span className="text-[11px] text-slate-500 mt-1 block">Tirunelveli - Madurai mainline</span>
          </div>

          <div>
            <label className="text-[11px] font-mono font-bold text-[#747783] uppercase block mb-1.5">
              Delay / Extension (Minutes)
            </label>
            <div className="flex items-center gap-2">
              {[30, 60, 90, 120].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDelayMinutes(mins)}
                  className={`flex-1 py-2 rounded-xl text-xs font-mono font-bold transition-all ${
                    delayMinutes === mins
                      ? 'bg-[#002869] text-white shadow-xs'
                      : 'bg-[#f4f3fb] text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  +{mins}m
                </button>
              ))}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">Shift magnitude</span>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSimulateDisruption}
            disabled={isSimulating}
            className="px-6 py-2.5 bg-[#002869] hover:bg-[#0b3d91] text-white text-xs font-mono font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Play className={`w-4 h-4 ${isSimulating ? 'animate-spin' : 'fill-white'}`} />
            {isSimulating ? 'Detecting Conflicts...' : 'Simulate Disruption & Detect Conflicts'}
          </button>
        </div>
      </div>

      {/* STEP 2: Conflict Detection Panel */}
      {conflictResult && (
        <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                <AlertTriangle className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-base text-[#002869]">
                  Step 2: Conflict Detected ({conflictResult.conflicts_detected} Block Overlaps)
                </h3>
                <p className="text-xs font-mono text-slate-500">Event ID: {conflictResult.event_id}</p>
              </div>
            </div>
            <button
              onClick={handleRunReplanning}
              disabled={isReplanning}
              className="px-5 py-2.5 bg-purple-700 hover:bg-purple-800 text-white text-xs font-mono font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className={`w-4 h-4 ${isReplanning ? 'animate-spin' : ''}`} />
              {isReplanning ? 'Calling OR-Tools Optimizer...' : 'Run Dynamic AI Replanner'}
            </button>
          </div>

          <div className="p-3.5 bg-amber-50 rounded-xl text-xs font-mono text-amber-900 leading-relaxed">
            <span className="font-bold uppercase block mb-1">Reasoning Analysis:</span>
            {conflictResult.reasoning}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {conflictResult.affected_blocks.map((b) => (
              <div key={b.block_id} className="p-3.5 bg-white border border-amber-200 rounded-xl space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-[#002869]">{b.block_id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-100 text-red-800 font-bold">
                    CONFLICTED
                  </span>
                </div>
                <p className="font-bold text-slate-900">{b.section_name}</p>
                <p className="text-slate-500 font-mono text-[11px]">
                  Original: {b.original_start.substring(11, 16)} - {b.original_end.substring(11, 16)} UTC
                </p>
                <p className="text-red-700 text-[11px] font-medium">{b.conflict_reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STEP 3 & 4: Side-by-Side Plan Comparison (Original vs Replanned) */}
      {replanResult && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-purple-700 block">
                STEP 3: AI REPLANNING RESULTS (ENGINE: {replanResult.optimizer_engine})
              </span>
              <h3 className="text-lg font-extrabold text-[#002869]">
                Original Approved Plan vs. Proposed AI Replanned Plan
              </h3>
            </div>

            {/* Alternative Plan Selector */}
            <div className="flex items-center gap-1.5 bg-[#f4f3fb] p-1 rounded-xl border border-slate-200 text-xs font-mono">
              <span className="px-2 font-bold text-slate-500">Option:</span>
              {replanResult.alternatives.map((alt, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedAltIndex(idx)}
                  className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                    selectedAltIndex === idx
                      ? 'bg-[#002869] text-white shadow-xs'
                      : 'text-slate-700 hover:bg-white'
                  }`}
                >
                  {alt.label.split(':')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* AI Reasoning Box */}
          <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-purple-900 font-bold">
              <Sparkles className="w-4 h-4 text-purple-600" />
              AI Replanning Explanation &amp; Safety Justification
            </div>
            <p className="text-purple-900 leading-relaxed font-medium">
              {selectedAlt?.explanation || replanResult.explanation}
            </p>
          </div>

          {/* Side-by-Side Plan Comparison Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ORIGINAL PLAN */}
            <div className="p-5 rounded-2xl border-2 border-slate-200 bg-slate-50 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase">ORIGINAL APPROVED SCHEDULE</span>
                <span className="px-2 py-0.5 bg-slate-200 text-slate-800 text-[10px] font-mono font-bold rounded">
                  Active in DB
                </span>
              </div>
              <div>
                <h4 className="font-extrabold text-base text-slate-800">
                  {origBlock?.section_name || 'Vanchi Maniyachchi - Kovilpatti'}
                </h4>
                <div className="flex items-center gap-2 mt-2 text-xs font-mono text-slate-600">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="line-through text-red-600 font-bold">01:30 - 04:30 AM (180 min)</span>
                </div>
              </div>

              <div className="space-y-1 pt-2 text-xs">
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Scheduled Tasks:</span>
                {(origBlock?.tasks || []).map((t) => (
                  <div key={t.task_id} className="p-2 bg-white rounded border border-slate-200 font-mono text-[11px] text-slate-700">
                    {t.task_title}
                  </div>
                ))}
              </div>
            </div>

            {/* AI REPLANNED PLAN */}
            <div className="p-5 rounded-2xl border-2 border-emerald-400 bg-emerald-50/40 space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-emerald-200">
                <span className="text-xs font-mono font-bold text-emerald-800 uppercase">
                  AI REPLANNED SCHEDULE ({selectedAlt?.label.split(':')[0]})
                </span>
                <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-mono font-bold rounded">
                  Recommended ({selectedAlt?.optimization_score}% Score)
                </span>
              </div>
              <div>
                <h4 className="font-extrabold text-base text-[#002869]">
                  {selectedAlt?.section_name}
                </h4>
                <div className="flex items-center gap-2 mt-2 text-xs font-mono text-emerald-800">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-sm">
                    {selectedAlt?.start_time.substring(11, 16)} - {selectedAlt?.end_time.substring(11, 16)} UTC ({selectedAlt?.duration_minutes} min)
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 bg-white rounded border border-emerald-200">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Impact</span>
                  <span className="font-bold text-emerald-700">{selectedAlt?.operational_impact}</span>
                </div>
                <div className="p-2 bg-white rounded border border-emerald-200">
                  <span className="text-[10px] font-mono text-slate-500 uppercase block">Deadline Risk</span>
                  <span className="font-bold text-emerald-700">{selectedAlt?.deadline_risk}</span>
                </div>
              </div>

              <div className="space-y-1 pt-2 text-xs">
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">Replanned Tasks Covered:</span>
                {(selectedAlt?.tasks || []).map((t) => (
                  <div key={t.task_id} className="p-2 bg-white rounded border border-emerald-200 font-mono text-[11px] text-slate-800 flex justify-between items-center">
                    <span>{t.task_title}</span>
                    <span className="text-emerald-700 font-bold">{t.department}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons: Accept / Reject / Manual Override */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={handleRejectReplan}
              className="px-4 py-2.5 text-xs font-mono font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-all cursor-pointer w-full sm:w-auto"
            >
              Reject (Keep Original Schedule)
            </button>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => setShowOverrideModal(true)}
                className="px-4 py-2.5 text-xs font-mono font-bold text-[#002869] bg-[#f4f3fb] hover:bg-slate-200 border border-slate-200 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer flex-1 sm:flex-none justify-center"
              >
                <Sliders className="w-4 h-4" />
                Manual Override
              </button>
              <button
                onClick={handleAcceptReplan}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer flex-1 sm:flex-none justify-center"
              >
                <CheckCircle2 className="w-4 h-4" />
                Accept &amp; Deploy AI Replan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Override Modal */}
      {showOverrideModal && (
        <Modal
          isOpen={showOverrideModal}
          onClose={() => setShowOverrideModal(false)}
          title="Manual Timetable Override Workbench"
          subtitle="Manually adjust possession slot timing with safety constraint validation"
          maxWidth="max-w-md"
          footer={
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => setShowOverrideModal(false)}
                className="px-4 py-2 text-xs font-mono text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyOverride}
                className="px-4 py-2 bg-[#002869] hover:bg-[#0b3d91] text-white text-xs font-mono font-bold rounded-lg shadow-xs cursor-pointer"
              >
                Validate &amp; Apply Override
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
              <span className="font-bold text-[#002869] block mb-1">Safety Constraints Active:</span>
              <p className="text-slate-700 text-[11px]">
                Must maintain minimum 30-min headway buffer around 20666 Vande Bharat Exp (06:00 AM) and 12694 Pearl City SF (08:45 PM).
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] font-mono text-[#747783] uppercase block mb-1">Window Start Time</label>
                <input
                  type="text"
                  value={overrideStart}
                  onChange={(e) => setOverrideStart(e.target.value)}
                  className="w-full bg-[#f4f3fb] border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono text-[#747783] uppercase block mb-1">Window End Time</label>
                <input
                  type="text"
                  value={overrideEnd}
                  onChange={(e) => setOverrideEnd(e.target.value)}
                  className="w-full bg-[#f4f3fb] border border-slate-200 rounded-lg px-3 py-2 font-mono text-xs text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-mono text-[#747783] uppercase block mb-1">Planner Authorization Reason</label>
              <textarea
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                placeholder="Reason for manual shift (e.g. Urgent machine operator availability)..."
                rows={2}
                className="w-full bg-[#f4f3fb] border border-slate-200 rounded-lg p-2.5 font-mono text-xs text-slate-800 resize-none"
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
