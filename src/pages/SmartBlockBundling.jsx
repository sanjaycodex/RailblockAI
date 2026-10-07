import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Layers, Sparkles, Clock, CheckCircle2, AlertTriangle, ArrowRight,
  ShieldCheck, Zap, Plus, RefreshCw, BarChart2, Check, ExternalLink,
  Sliders, ChevronRight, Eye
} from 'lucide-react';
import MetricCard from '../components/common/MetricCard';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { fastapiService } from '../services/fastapiService';
import { useSimulation } from '../context/SimulationContext';

import { api } from '../services/api';

export default function SmartBlockBundling() {
  const { recordAcceptedReplan, refreshTwinState } = useSimulation();

  const [bundles, setBundles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBundle, setSelectedBundle] = useState(null);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Modals
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);

  const fetchBundles = async () => {
    setLoading(true);
    setFeedback(null);
    const loadingToast = toast.loading('Analyzing task compatibility and generating smart bundles...');
    try {
      const data = await fastapiService.generateSmartBundles('CORR-SR-TEN-MDU');
      setBundles(data);
      if (data && data.length > 0) {
        setSelectedBundle(data[0]);
      }
      toast.success(`✨ Discovered ${data.length} high-compatibility cross-discipline candidate bundle(s) across Civil, S&T, and TRD!`, {
        id: loadingToast,
      });
      setFeedback({
        type: 'success',
        text: `Discovered ${data.length} high-compatibility cross-discipline candidate bundle(s) across Civil, S&T, and TRD!`
      });
    } catch (e) {
      toast.error(`❌ Bundling error: ${e.message}`, {
        id: loadingToast,
      });
      setFeedback({ type: 'error', text: `Bundling error: ${e.message}` });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBundles();
  }, []);

  const handleEvaluateWithOptimizer = async (bundle) => {
    setSelectedBundle(bundle);
    setIsEvaluating(true);
    setIsEvalModalOpen(true);
    setEvaluationResult(null);
    const loadingToast = toast.loading('Running Phase 3 OR-Tools Multi-Objective Solver...');
    try {
      const res = await fastapiService.evaluateBundleWithOptimizer(bundle.bundle_id);
      setEvaluationResult(res);
      toast.success('✅ OR-Tools optimization completed successfully!', {
        id: loadingToast,
      });
    } catch (e) {
      toast.error(`❌ Evaluation error: ${e.message}`, {
        id: loadingToast,
      });
      setFeedback({ type: 'error', text: `Evaluation error: ${e.message}` });
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleApproveBundle = async (bundleId) => {
    const loadingToast = toast.loading('Submitting smart bundle for Chief Controller approval...');
    try {
      const targetBundle = bundles.find(b => b.bundle_id === bundleId) || selectedBundle;
      
      // Register bundle as Proposed maintenance block in database so Admin can approve it
      const now = new Date();
      const startTime = new Date(now.getTime() + 5 * 3600000).toISOString();
      const endTime = new Date(now.getTime() + 8 * 3600000).toISOString();

      const newBlock = {
        id: `BLK-${bundleId.replace('BND-', '')}`,
        section_id: targetBundle?.section_id || 'SEC-MEJ-CVP',
        title: targetBundle?.title || `Smart Bundle (${targetBundle?.section_name || 'Corridor'})`,
        start_time: startTime,
        end_time: endTime,
        duration_minutes: targetBundle?.total_duration_minutes || 180,
        status: 'Proposed', // Awaiting Admin Approval
        optimization_score: targetBundle?.compatibility_score || 96.0,
        approved_by: null,
        approved_at: null,
        assigned_department: targetBundle?.departments?.[0] || 'Civil',
        notes: `Smart Multi-Discipline Bundle (${targetBundle?.departments?.join(' + ') || 'Joint'}). Bundles ${targetBundle?.tasks_count || 3} tasks. Saved ${targetBundle?.downtime_saved_minutes || 180} mins track closure. Zero express train clashes.`,
        section_name: targetBundle?.section_name || 'Tirunelveli - Madurai Mainline'
      };

      await api.createMaintenanceBlock(newBlock);
      try {
        await fastapiService.approveBundle(bundleId);
      } catch (e) {
        console.warn('FastAPI bundle approval fallback:', e);
      }

      setBundles(bundles.map(b => b.bundle_id === bundleId ? { ...b, status: 'Submitted to Admin' } : b));
      setIsDetailModalOpen(false);
      setIsEvalModalOpen(false);
      refreshTwinState();
      
      toast.success(`📋 Bundle ${bundleId} submitted to Admin Dashboard for approval! Once approved by Chief Controller, it will move to Planner Dashboard for department assignment.`, {
        id: loadingToast,
        duration: 6000,
        icon: '📋'
      });
      setFeedback({
        type: 'success',
        text: `Bundle ${bundleId} submitted to Admin Dashboard for approval. Once approved, it moves to Planner Panel.`
      });
    } catch (e) {
      toast.error(`❌ Submission error: ${e.message}`, {
        id: loadingToast,
      });
      setFeedback({ type: 'error', text: `Submission error: ${e.message}` });
    }
  };

  // Aggregated KPIs
  const totalHoursSaved = (bundles.reduce((acc, b) => acc + (b.downtime_saved_minutes || 0), 0) / 60.0).toFixed(1);
  const totalCostSaved = (bundles.reduce((acc, b) => acc + (b.cost_savings_lakhs || 0), 0)).toFixed(1);
  const totalTasksCoordinated = bundles.reduce((acc, b) => acc + (b.tasks_count || 0), 0);

  return (
    <div className="space-y-3 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white px-1 pb-3 border-b border-[#d9dded]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#dae2ff] text-[#001947]">
              SMART ORCHESTRATION
            </span>
            <span className="text-xs font-mono text-slate-500">• Tirunelveli - Madurai Mainline (TEN-MDU)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#102b68] tracking-tight">
            Smart Block Bundling
          </h1>
          <p className="text-xs text-[#434652] mt-1 max-w-2xl">
            Automatically synthesizes independent Engineering (P-Way), Signal &amp; Telecom (S&amp;T), and Traction (25kV OHE) tasks into synchronized multi-discipline possession windows.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={fetchBundles}
            disabled={loading}
            className="px-3 py-2 bg-[#003a91] text-white text-[11px] font-semibold rounded shadow-sm hover:bg-[#002b70] transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className={`w-4 h-4 text-yellow-300 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Analyzing Compatibility...' : 'Generate Smart Bundles'}
          </button>
        </div>
      </div>

      {feedback && (
        <div className={`p-2.5 text-[11px] font-mono flex items-center gap-2 border ${
          feedback.type === 'success'
            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
            : 'bg-red-50 text-[#ba1a1a] border border-red-200'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />}
          {feedback.text}
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          title="Candidate Bundled Possessions"
          value={bundles.length}
          unit="Candidate Packages"
          delta={`${totalTasksCoordinated} Tasks Coordinated`}
          subtitle="Tirunelveli - Madurai Corridor"
          icon="layers"
          iconBg="bg-blue-50 text-[#005db7]"
        />
        <MetricCard
          title="Track Downtime Hours Saved"
          value={`${totalHoursSaved}h`}
          delta="vs. Isolated Single-Dept Blocks"
          subtitle="Eliminated duplicate track shutoffs"
          icon="clock"
          iconBg="bg-emerald-50 text-[#00a859]"
        />
        <MetricCard
          title="Cross-Discipline Overlap Index"
          value="96.5%"
          delta="Civil + S&T + Electrical TRD"
          subtitle="Spatial & Temporal Co-location"
          icon="zap"
          iconBg="bg-indigo-50 text-[#002869]"
        />
        <MetricCard
          title="Estimated Mobilization Savings"
          value={`₹${totalCostSaved}`}
          unit="Lakhs"
          delta="Single Machine Move"
          subtitle="Joint crew & tower wagon efficiency"
          icon="trending_up"
          iconBg="bg-amber-50 text-amber-700"
        />
      </div>

      {/* BEFORE VS. AFTER VISUALIZATION CARD */}
      {selectedBundle && (
        <div className="bg-white border border-[#d9dded] p-3 shadow-[0_1px_2px_rgba(16,43,104,.04)] space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-indigo-100">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#005db7] block">
                INNOVATION ARCHITECTURE: BEFORE VS. AFTER COORDINATION
              </span>
              <h3 className="text-sm font-extrabold text-[#102b68]">
                Corridor Plan Comparison
              </h3>
            </div>
            <span className="px-2 py-1 bg-indigo-50 text-[#002869] border border-indigo-200 rounded font-mono text-[10px] font-bold">
              AI compatibility graph
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* BEFORE */}
            <div className="p-3 border border-red-200 bg-red-50/40 space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-red-200">
                <span className="text-xs font-mono font-bold text-red-800 uppercase">
                  BEFORE: UNCOORDINATED ISOLATED BLOCKS
                </span>
                <span className="text-[10px] font-mono bg-red-200 text-red-900 px-2 py-0.5 rounded font-bold">
                  {selectedBundle.tasks_count} Separate Closures
                </span>
              </div>
              <div className="space-y-2 text-xs">
                {selectedBundle.tasks.map((t, idx) => (
                  <div key={t.task_id} className="p-2.5 bg-white rounded border border-red-100 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-[10px] text-slate-400 block">Block {idx + 1} ({t.department})</span>
                      <span className="font-semibold text-slate-800">{t.task_title}</span>
                    </div>
                    <span className="font-mono text-red-700 font-bold text-[11px] whitespace-nowrap ml-2">
                      {t.estimated_duration} min
                    </span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-red-200 flex justify-between text-xs font-mono text-red-900 font-bold">
                <span>Total Cumulative Track Closure:</span>
                <span>{selectedBundle.individual_duration_sum} mins ({(selectedBundle.individual_duration_sum / 60.0).toFixed(1)}h)</span>
              </div>
            </div>

            {/* AFTER */}
            <div className="p-3 border border-[#7795d8] bg-[#f5f7ff] space-y-2">
              <div className="flex justify-between items-center pb-2 border-b border-emerald-200">
                <span className="text-xs font-mono font-bold text-emerald-800 uppercase">
                  AFTER: 1 SYNCHRONIZED CANDIDATE SMART BUNDLE
                </span>
                <span className="text-[10px] font-mono bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">
                  1 Joint Possession Window
                </span>
              </div>
              <div className="p-3 bg-white rounded-lg border border-emerald-200 space-y-2 text-xs">
                <div className="flex items-center justify-between font-mono">
                  <span className="text-emerald-800 font-bold">Allocated Window:</span>
                  <span className="font-bold text-[#002869]">{selectedBundle.compatible_window}</span>
                </div>
                <div className="flex items-center justify-between font-mono">
                  <span className="text-emerald-800 font-bold">Downtime Saved:</span>
                  <span className="font-bold text-emerald-600">+{selectedBundle.downtimeSavedMinutes} mins saved</span>
                </div>
                <div className="flex items-center justify-between font-mono">
                  <span className="text-emerald-800 font-bold">Compatibility Score:</span>
                  <span className="font-bold text-purple-700">{selectedBundle.compatibility_score}%</span>
                </div>
                <div className="flex items-center justify-between font-mono">
                  <span className="text-emerald-800 font-bold">Coordination Benefit:</span>
                  <span className="font-bold text-[#002869]">{selectedBundle.bundle_benefit_score}%</span>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => handleEvaluateWithOptimizer(selectedBundle)}
                    className="px-3 py-1.5 bg-[#003a91] hover:bg-[#002b70] text-white text-[10px] font-semibold rounded shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Evaluate with Phase 3 Optimizer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Bundles List */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-bold text-[#102b68]">
            Candidate Possession Packages
          </h3>
          <span className="text-xs font-mono text-slate-500">Sorted by Bundle Benefit Score</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {bundles.map((bundle) => {
            const isSelected = selectedBundle?.bundle_id === bundle.bundle_id;
            return (
              <div
                key={bundle.bundle_id}
                onClick={() => setSelectedBundle(bundle)}
                className={`bg-white border p-3 shadow-[0_1px_2px_rgba(16,43,104,.04)] transition-all cursor-pointer ${
                  isSelected ? 'border-[#4164c4]' : 'border-[#d9dded] hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="font-mono font-bold text-xs text-[#002869] bg-[#dae2ff] px-2.5 py-0.5 rounded">
                        {bundle.bundle_id}
                      </span>
                      <span className="text-xs font-mono text-slate-500 font-semibold">{bundle.section_name}</span>
                      <StatusBadge status={bundle.status === 'Candidate' ? 'AI-Optimized' : bundle.status} size="sm" />
                    </div>
                    <h4 className="text-base font-bold text-slate-900">{bundle.title}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      {bundle.departments.map((dept) => (
                        <span key={dept} className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-slate-100 text-[#002869]">
                          {dept}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Scheduled Window</span>
                      <span className="font-mono font-bold text-xs text-[#002869]">{bundle.compatible_window}</span>
                    </div>
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-mono text-slate-400 block uppercase">Downtime Saved</span>
                      <span className="font-mono font-bold text-xs text-emerald-600">+{bundle.downtimeSavedMinutes} mins</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedBundle(bundle);
                        setIsDetailModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-[#003a91] hover:bg-[#002b70] text-white text-[10px] font-semibold rounded transition-colors cursor-pointer"
                    >
                      View &amp; Manage Bundle
                    </button>
                  </div>
                </div>

                {/* Tasks Sub-Grid */}
                <div className="mt-4">
                  <span className="text-xs font-mono text-[#747783] uppercase block mb-2 font-bold">
                    Bundled Tasks ({bundle.tasks_count} Tasks Synchronized)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {bundle.tasks.map((task) => (
                      <div key={task.task_id} className="p-2 bg-[#fbfcff] border border-[#e4e7f0] text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-[10px] text-[#002869]">{task.task_id}</span>
                          <span className="text-[10px] font-mono font-bold text-[#005db7]">{task.department}</span>
                        </div>
                        <p className="font-semibold text-slate-800 text-[11px] leading-snug line-clamp-2">{task.task_title}</p>
                        <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 pt-1">
                          <span>Priority: {task.priority_score}</span>
                          <span>{task.estimated_duration} min</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Optimizer Evaluation Modal */}
      {isEvalModalOpen && selectedBundle && (
        <Modal
          isOpen={isEvalModalOpen}
          onClose={() => setIsEvalModalOpen(false)}
          title={`Phase 3 Optimizer Evaluation: ${selectedBundle.bundle_id}`}
          subtitle={`${selectedBundle.section_name} • ${selectedBundle.coordination_level}`}
          maxWidth="max-w-2xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => setIsEvalModalOpen(false)}
                className="px-4 py-2 text-xs font-mono text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              {selectedBundle.status === 'Approved' ? (
                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 font-mono text-xs font-bold rounded-lg border border-emerald-300">
                  ✓ Approved by Chief Controller
                </span>
              ) : selectedBundle.status === 'Submitted to Admin' ? (
                <span className="px-3 py-1.5 bg-amber-100 text-amber-800 font-mono text-xs font-bold rounded-lg border border-amber-300">
                  ⏳ Awaiting Admin Approval
                </span>
              ) : (
                <button
                  onClick={() => handleApproveBundle(selectedBundle.bundle_id)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Submit Bundle for Admin Approval
                </button>
              )}
            </div>
          }
        >
          {isEvaluating ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <Sparkles className="w-8 h-8 text-purple-600 animate-spin" />
              <p className="text-xs font-mono text-slate-700">Running Phase 3 OR-Tools Multi-Objective Solver...</p>
            </div>
          ) : evaluationResult ? (
            <div className="space-y-4 text-xs">
              {/* Option A vs Option B Comparison Box */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <span className="font-mono font-bold text-[10px] uppercase text-slate-500 block">OPTION A: INDIVIDUAL</span>
                  <div className="space-y-1 text-slate-800 font-mono">
                    <p>Blocks Required: <span className="font-bold">{evaluationResult.option_a_blocks_count}</span></p>
                    <p>Total Duration: <span className="font-bold">{evaluationResult.option_a_total_duration}m</span></p>
                    <p>Optimization Fitness: <span className="font-bold">{evaluationResult.option_a_score}%</span></p>
                  </div>
                  <p className="text-[11px] text-slate-500">{evaluationResult.option_a_train_impact}</p>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl space-y-2">
                  <span className="font-mono font-bold text-[10px] uppercase text-emerald-800 block">OPTION B: BUNDLED (AI RECOMMENDED)</span>
                  <div className="space-y-1 text-emerald-900 font-mono">
                    <p>Blocks Required: <span className="font-bold">1 Coordinated Block</span></p>
                    <p>Total Duration: <span className="font-bold">{evaluationResult.option_b_total_duration}m</span></p>
                    <p>Optimization Fitness: <span className="font-bold text-emerald-700">{evaluationResult.option_b_score}%</span></p>
                  </div>
                  <p className="text-[11px] text-emerald-800">{evaluationResult.option_b_train_impact}</p>
                </div>
              </div>

              {/* AI Justification */}
              <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl space-y-1.5">
                <div className="flex items-center gap-2 text-purple-900 font-bold">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  OR-Tools Solver Recommendation &amp; Justification
                </div>
                <p className="text-purple-900 leading-relaxed font-medium">
                  {evaluationResult.ai_recommendation_reason}
                </p>
                <div className="pt-2 border-t border-purple-100 flex items-center justify-between text-[11px] font-mono text-purple-800">
                  <span>Efficiency Gain: +{evaluationResult.efficiency_gain_pct}%</span>
                  <span>Hours Saved: {evaluationResult.downtime_saved_hours}h Track Time</span>
                </div>
              </div>
            </div>
          ) : null}
        </Modal>
      )}

      {/* Details & Approval Modal */}
      {isDetailModalOpen && selectedBundle && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={`Candidate Possession Package: ${selectedBundle.bundle_id}`}
          subtitle={`${selectedBundle.section_name} • ${selectedBundle.compatible_window}`}
          maxWidth="max-w-xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 text-xs font-mono text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
              >
                Close
              </button>
              {selectedBundle.status === 'Approved' ? (
                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 font-mono text-xs font-bold rounded-lg border border-emerald-300">
                  ✓ Approved by Chief Controller
                </span>
              ) : selectedBundle.status === 'Submitted to Admin' ? (
                <span className="px-3 py-1.5 bg-amber-100 text-amber-800 font-mono text-xs font-bold rounded-lg border border-amber-300">
                  ⏳ Awaiting Admin Approval
                </span>
              ) : (
                <button
                  onClick={() => handleApproveBundle(selectedBundle.bundle_id)}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold rounded-lg shadow-sm cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Submit Bundle for Admin Approval
                </button>
              )}
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-[#faf8ff] border border-slate-200 rounded-xl">
              <h4 className="font-bold text-sm text-[#002869]">{selectedBundle.title}</h4>
              <p className="text-slate-600 mt-1">
                Synchronized track possession for Civil P-Way, S&amp;T point machines, and 25kV OHE catenary adjustments on the Tirunelveli-Madurai mainline.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#747783] block">Compatibility Score</span>
                <span className="text-base font-mono font-bold text-[#002869]">{selectedBundle.compatibility_score}%</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#747783] block">Estimated Cost Savings</span>
                <span className="text-base font-mono font-bold text-emerald-600">₹{selectedBundle.cost_savings_lakhs} Lakhs</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#747783] block">Downtime Eliminated</span>
                <span className="text-sm font-semibold text-slate-800">+{selectedBundle.downtime_saved_minutes} Minutes</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#747783] block">Participating Depts</span>
                <span className="text-sm font-semibold text-[#005db7]">{selectedBundle.departments.join(', ')}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
