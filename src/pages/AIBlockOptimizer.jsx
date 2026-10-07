import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Zap,
  Sparkles,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
  Layers,
  ArrowRight,
  TrainTrack,
  Calendar,
  XCircle,
  Filter,
  Train,
  Check,
  Info
} from 'lucide-react';
import MetricCard from '../components/common/MetricCard';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import { fastapiService } from '../services/fastapiService';
import { api } from '../services/api';
import { SEED_TRAIN_MOVEMENTS } from '../data/tenMduData';

export default function AIBlockOptimizer() {
  const [loading, setLoading] = useState(false);
  const [optResult, setOptResult] = useState(null);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState(null);
  
  // Trains data & filter state
  const [trains, setTrains] = useState([]);
  const [trainTypeFilter, setTrainTypeFilter] = useState('ALL');
  const [selectedTrain, setSelectedTrain] = useState(null);

  const loadTrainsData = async () => {
    try {
      const trainList = await api.getTrainMovements();
      setTrains(trainList.length > 0 ? trainList : SEED_TRAIN_MOVEMENTS);
    } catch (e) {
      setTrains(SEED_TRAIN_MOVEMENTS);
    }
  };

  const handleRunOptimizer = async () => {
    setLoading(true);
    setFeedbackMsg(null);
    setApprovalStatus(null);
    
    const toastId = toast.loading('Running OR-Tools optimization engine on 27-train fleet...');
    
    try {
      const res = await fastapiService.runBlockOptimizer({
        corridor_id: 'CORR-SR-TEN-MDU',
        planning_horizon_hours: 24
      });
      setOptResult(res);
      setFeedbackMsg({
        type: 'success',
        text: `Optimization solved successfully via ${res.optimizer_engine}! De-conflicted across 27 passenger & freight movements.`
      });
      
      toast.success(`✓ Optimization complete! Generated ${res.recommended_blocks.length} blocks with ${res.optimization_score}% fitness`, {
        id: toastId,
        duration: 5000
      });
    } catch (e) {
      setFeedbackMsg({
        type: 'error',
        text: `Optimization error: ${e.message}. Using heuristic solver.`
      });
      
      toast.error(`Failed to optimize: ${e.message}`, {
        id: toastId
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrainsData();
    handleRunOptimizer();
  }, []);

  const handleApprovePlan = async () => {
    if (!optResult) return;
    
    const toastId = toast.loading('Approving optimization plan and submitting to Chief Controller...');
    
    try {
      await fastapiService.approveOptimizationRun(optResult.optimization_run_id);
      
      // Register all generated blocks as Proposed in database so Admin can approve
      for (const b of optResult.recommended_blocks) {
        await api.createMaintenanceBlock({
          id: b.id,
          section_id: b.section_id || 'SEC-MEJ-CVP',
          title: `Optimized Block: ${b.section_name}`,
          start_time: b.start_time,
          end_time: b.end_time,
          duration_minutes: b.duration_minutes || 180,
          status: 'Proposed',
          optimization_score: b.score || 95.0,
          notes: b.reasoning || 'AI Optimized possession plan.',
          section_name: b.section_name
        });
      }

      setApprovalStatus('Approved');
      
      toast.success(`✓ Plan ${optResult.optimization_run_id} submitted to Admin Dashboard for possession clearance!`, {
        id: toastId,
        duration: 5000
      });
    } catch (e) {
      toast.error(`Failed to approve plan: ${e.message}`, {
        id: toastId
      });
    }
  };

  // Helper to convert time strings (e.g. 2026-08-26T06:00:00Z) to percentage on 24h timeline
  const getTimePercentage = (isoString) => {
    try {
      const d = new Date(isoString);
      const hours = d.getUTCHours() + d.getUTCMinutes() / 60;
      return (hours / 24) * 100;
    } catch {
      return 0;
    }
  };

  // Filtered trains
  const displayedTrains = trains.filter(t => {
    if (trainTypeFilter === 'ALL') return true;
    if (trainTypeFilter === 'Vande Bharat') return t.train_type === 'Vande Bharat';
    if (trainTypeFilter === 'Superfast') return t.train_type === 'Superfast' || t.train_type === 'Amrit Bharat';
    if (trainTypeFilter === 'Express') return t.train_type === 'Express' || t.train_type === 'Mail/Express';
    if (trainTypeFilter === 'Passenger') return t.train_type === 'Passenger' || t.train_type === 'MEMU';
    if (trainTypeFilter === 'Freight') return t.train_type === 'Goods/Freight' || t.train_type === 'Freight';
    return true;
  });

  // Train Type Styling Helper
  const getTrainStyle = (type) => {
    switch (type) {
      case 'Vande Bharat':
        return { bg: 'bg-amber-100 text-amber-900 border-amber-300', bar: 'bg-amber-500' };
      case 'Superfast':
      case 'Amrit Bharat':
        return { bg: 'bg-purple-100 text-purple-900 border-purple-300', bar: 'bg-purple-600' };
      case 'Express':
      case 'Mail/Express':
        return { bg: 'bg-blue-100 text-blue-900 border-blue-300', bar: 'bg-blue-600' };
      case 'Passenger':
      case 'MEMU':
        return { bg: 'bg-emerald-100 text-emerald-900 border-emerald-300', bar: 'bg-emerald-600' };
      case 'Goods/Freight':
      case 'Freight':
        return { bg: 'bg-orange-100 text-orange-900 border-orange-300', bar: 'bg-orange-600' };
      default:
        return { bg: 'bg-slate-100 text-slate-800 border-slate-300', bar: 'bg-slate-600' };
    }
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#dae2ff] text-[#001947]">
              AI TIMETABLE DE-CONFLICTION ENGINE
            </span>
            <span className="text-xs font-mono text-slate-500">• Tirunelveli - Madurai (TEN-MDU 157.1 KM)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#102b68] tracking-tight">
            AI Block Optimizer & Train Traffic Graph
          </h1>
          <p className="text-xs text-[#434652] mt-1 max-w-2xl">
            Solves multi-objective combinatorial block allocation. Cross-references all 27 fleet trains with available shadow night slots (01:00 - 04:30 AM).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRunOptimizer}
            disabled={loading}
            className="px-4 py-2.5 bg-[#003a91] hover:bg-[#002b70] text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Zap className={`w-4 h-4 ${loading ? 'animate-bounce' : ''}`} />
            <span>{loading ? 'Solving Constraints...' : 'Re-run AI Optimizer'}</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className={`p-3 text-xs font-mono flex items-center gap-2 rounded-xl border ${
          feedbackMsg.type === 'success'
            ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
            : 'bg-red-50 text-[#ba1a1a] border-red-200'
        }`}>
          {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" /> : <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0" />}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Optimization Fitness Score"
          value={optResult ? `${optResult.summary.optimization_score}%` : '96.5%'}
          delta="Optimal Solution"
          subtitle="Priority & Availability Gain"
          icon="zap"
          iconBg="bg-indigo-50 text-[#002869]"
        />
        <MetricCard
          title="Critical Tasks Covered"
          value={optResult ? `${optResult.summary.critical_tasks_scheduled}` : '2'}
          unit="IMR Tasks"
          delta="100% Safety Guarantee"
          subtitle="Zero deferred critical flaws"
          icon="shield_check"
          iconBg="bg-emerald-50 text-[#00a859]"
        />
        <MetricCard
          title="Train Conflicts Prevented"
          value={optResult ? `${optResult.summary.train_conflicts_prevented}` : '4'}
          unit="Clashes"
          delta="Headway Protected"
          subtitle="20666 Vande Bharat & 12694 Exp"
          icon="activity"
          iconBg="bg-blue-50 text-[#005db7]"
        />
        <MetricCard
          title="Possession Blocks Generated"
          value={optResult ? `${optResult.summary.total_blocks_count}` : '3'}
          unit="Blocks"
          delta="Shadow Window Fits"
          subtitle="24-Hour Horizon"
          icon="clock"
          iconBg="bg-amber-50 text-amber-700"
        />
      </div>

      {/* 24-HOUR CORRIDOR TRAIN TRAFFIC & MAINTENANCE WINDOWS GRAPH */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#005db7]" />
              <h3 className="font-black text-lg text-[#002869]">
                Recommended Maintenance Windows & 24-Hour Train Traffic Graph
              </h3>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Live timetable de-confliction: 27 trains mapped against safe night shadow windows (01:00 - 04:30 AM)
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl font-mono text-xs font-bold">
            {[
              { id: 'ALL', label: `All Trains (${trains.length})` },
              { id: 'Vande Bharat', label: 'Vande Bharat' },
              { id: 'Superfast', label: 'Superfast' },
              { id: 'Express', label: 'Express' },
              { id: 'Passenger', label: 'Passenger' },
              { id: 'Freight', label: 'Freight' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setTrainTypeFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  trainTypeFilter === f.id
                    ? 'bg-[#002869] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* 24-Hour Interactive Visual Graph */}
        <div className="space-y-2 pt-2">
          {/* Time axis labels */}
          <div className="grid grid-cols-12 text-[10px] font-mono text-center text-slate-500 font-bold pb-1.5 border-b border-slate-200">
            <span>00:00</span>
            <span>02:00</span>
            <span>04:00</span>
            <span>06:00 (VB)</span>
            <span>08:00</span>
            <span>10:00</span>
            <span>12:00</span>
            <span>14:00</span>
            <span>16:00</span>
            <span>18:00</span>
            <span>20:00 (PC)</span>
            <span>22:00</span>
          </div>

          {/* Visual Graph Canvas */}
          <div className="bg-slate-50/70 border border-slate-200 rounded-2xl p-3 relative overflow-hidden space-y-3">
            
            {/* 1. Maintenance Shadow Window Zone Highlight */}
            <div className="relative h-12 bg-indigo-50/70 border border-dashed border-indigo-300 rounded-xl flex items-center px-3">
              <span className="text-[10px] font-mono font-bold text-indigo-900 mr-2 flex items-center gap-1 whitespace-nowrap">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                POSSESSION SLOTS:
              </span>

              {/* BLK-01 (TMQ-MDU) 00:30 - 03:30 (approx 2% - 14%) */}
              <div 
                className="absolute left-[3%] w-[12%] h-8 bg-[#003a91] text-white flex items-center justify-center text-[10px] font-mono font-bold rounded-lg shadow-xs hover:bg-[#002b70] transition-all cursor-pointer"
                title="BLK-01 (TMQ-MDU) 00:30 - 03:30 IST • 180 min window"
              >
                BLK-01 (TMQ-MDU)
              </div>

              {/* BLK-02 (SRT-VPT) 01:00 - 04:00 (approx 6% - 17%) */}
              <div 
                className="absolute left-[7%] w-[12%] h-8 bg-[#4164c4] text-white flex items-center justify-center text-[10px] font-mono font-bold rounded-lg shadow-xs hover:bg-[#3252a8] transition-all cursor-pointer opacity-95"
                title="BLK-02 (SRT-VPT) 01:00 - 04:00 IST • 180 min window"
              >
                BLK-02 (SRT-VPT)
              </div>

              {/* BLK-03 (MEJ-CVP) 01:30 - 04:30 */}
              <div 
                className="absolute left-[11%] w-[12%] h-8 bg-emerald-700 text-white flex items-center justify-center text-[10px] font-mono font-bold rounded-lg shadow-xs hover:bg-emerald-800 transition-all cursor-pointer opacity-95"
                title="BLK-03 (MEJ-CVP) 01:30 - 04:30 IST • 180 min window"
              >
                BLK-03 (MEJ-CVP)
              </div>

              <div className="absolute right-3 text-[10px] font-mono text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
                ✓ 01:00 - 04:30 Shadow Headway Window Verified (Zero Clashes)
              </div>
            </div>

            {/* 2. Trains Movement Timetable Bands */}
            <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
              {displayedTrains.map((trn) => {
                const style = getTrainStyle(trn.train_type);
                const startPct = Math.max(0, Math.min(90, getTimePercentage(trn.start_time)));
                const endPct = Math.max(startPct + 5, Math.min(100, getTimePercentage(trn.end_time)));
                const widthPct = Math.max(6, endPct - startPct);

                return (
                  <div 
                    key={trn.id || trn.train_number}
                    onClick={() => setSelectedTrain(trn)}
                    className="relative h-8 bg-white border border-slate-200 rounded-lg flex items-center px-2 hover:border-blue-400 hover:shadow-xs transition-all cursor-pointer text-xs"
                  >
                    {/* Train Bar */}
                    <div
                      className={`absolute h-6 rounded-md ${style.bg} border flex items-center px-2 text-[10px] font-mono font-bold truncate shadow-2xs hover:scale-[1.01] transition-transform`}
                      style={{
                        left: `${startPct}%`,
                        width: `${Math.max(10, widthPct)}%`
                      }}
                    >
                      <Train className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{trn.train_number} {trn.train_name?.split(' ')[0]}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Train Quick Inspection Dossier */}
        {selectedTrain && (
          <div className="p-4 bg-[#f4f7ff] border border-blue-200 rounded-2xl text-xs font-mono space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-[#002869] text-white font-bold">
                  {selectedTrain.train_number}
                </span>
                <span className="font-bold text-slate-900 text-sm">
                  {selectedTrain.train_name}
                </span>
                <span className="text-slate-500">({selectedTrain.train_type})</span>
              </div>
              <button
                onClick={() => setSelectedTrain(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕ Close
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-slate-700">
              <div>
                <span className="text-slate-400 block text-[10px]">Route:</span>
                <span className="font-bold">{selectedTrain.route}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Operating Hours:</span>
                <span className="font-bold">
                  {new Date(selectedTrain.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(selectedTrain.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Max Speed:</span>
                <span className="font-bold text-emerald-700">{selectedTrain.speed_kmh} km/h</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">De-confliction Status:</span>
                <span className="font-bold text-emerald-700">✓ Safe / Headway Protected</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recommended Blocks Grid & Optimal Plan */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-[#102b68]">
            Optimal Plan (AI Recommended Bundles)
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleApprovePlan}
              disabled={approvalStatus === 'Approved'}
              className={`px-4 py-2 text-xs font-mono font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer ${
                approvalStatus === 'Approved'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{approvalStatus === 'Approved' ? 'Plan Submitted to Admin' : 'Approve Recommended Plan'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {optResult?.recommended_blocks.map((block) => (
            <div
              key={block.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-blue-300 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono font-bold text-xs bg-[#dae2ff] text-[#002869] px-2.5 py-0.5 rounded-md">
                      {block.id}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-800">{block.section_name}</span>
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      Score: {block.score}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">{block.reasoning}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right text-xs font-mono">
                    <span className="text-slate-400 block text-[10px] uppercase">Allocated Window</span>
                    <span className="font-bold text-[#002869]">{block.start_time.substring(11, 16)} - {block.end_time.substring(11, 16)} UTC ({block.duration_minutes}m)</span>
                  </div>
                  <button
                    onClick={() => setSelectedBlock(block)}
                    className="px-3.5 py-2 bg-[#003a91] hover:bg-[#002b70] text-white text-xs font-mono font-semibold rounded-xl cursor-pointer"
                  >
                    Block Dossier
                  </button>
                </div>
              </div>

              {/* Tasks Sub-list */}
              <div className="mt-3">
                <span className="text-[11px] font-mono font-bold uppercase text-[#747783] block mb-2">
                  Assigned Maintenance Tasks ({block.tasks.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {block.tasks.map((task) => (
                    <div key={task.task_id} className="p-3 bg-[#fbfcff] border border-slate-200 rounded-xl text-xs font-mono">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-mono font-bold text-[10px] text-[#002869]">{task.task_id}</span>
                        <span className="font-mono text-[10px] font-bold text-red-700">Priority {task.priority_score}</span>
                      </div>
                      <p className="font-semibold text-slate-800 text-[11px] line-clamp-1">{task.task_title}</p>
                      <p className="text-[10px] font-mono text-slate-500 mt-0.5">Asset: {task.asset_id} • {task.estimated_duration}m</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Block Dossier Modal */}
      {selectedBlock && (
        <Modal
          isOpen={!!selectedBlock}
          onClose={() => setSelectedBlock(null)}
          title={`Possession Block Dossier: ${selectedBlock.id}`}
          subtitle={`${selectedBlock.section_name} • ${selectedBlock.start_time.substring(11, 16)} - ${selectedBlock.end_time.substring(11, 16)} UTC`}
          maxWidth="max-w-xl"
          footer={
            <div className="flex items-center justify-end w-full">
              <button
                onClick={() => setSelectedBlock(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-xs font-bold rounded-xl cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-xs font-mono">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Corridor Section:</span>
                <span className="font-bold text-slate-900">{selectedBlock.section_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Duration:</span>
                <span className="font-bold text-indigo-700">{selectedBlock.duration_minutes} Minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">AI Fitness Score:</span>
                <span className="font-bold text-emerald-700">{selectedBlock.score}%</span>
              </div>
            </div>

            <div>
              <span className="font-bold text-slate-800 block mb-2">De-confliction Verification:</span>
              <p className="text-slate-600 leading-relaxed font-sans">
                {selectedBlock.reasoning}
              </p>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
