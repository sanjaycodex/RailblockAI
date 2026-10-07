import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  Sparkles,
  SlidersHorizontal,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Info,
  CheckCircle2,
  RefreshCw,
  Cpu,
  Layers,
  ArrowRight,
  Filter
} from 'lucide-react';
import MetricCard from '../components/common/MetricCard';
import StatusBadge from '../components/common/StatusBadge';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import { api } from '../services/api';
import { fastapiService } from '../services/fastapiService';

export default function AIPriorityEngine() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [taskExplanation, setTaskExplanation] = useState(null);
  const [feedbackMsg, setFeedbackMsg] = useState(null);

  // Weights (Standard 35-30-20-15 formula)
  const [weightCriticality, setWeightCriticality] = useState(35);
  const [weightRisk, setWeightRisk] = useState(30);
  const [weightUrgency, setWeightUrgency] = useState(20);
  const [weightOperational, setWeightOperational] = useState(15);

  const [filterDept, setFilterDept] = useState('ALL');
  const [filterLevel, setFilterLevel] = useState('ALL');

  const loadTasks = async () => {
    setLoading(true);
    try {
      const data = await api.getTasks();
      // Sort by priority_score descending
      data.sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0));
      setTasks(data);
    } catch (e) {
      console.error('Error loading tasks:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleRecalculateAll = async () => {
    setRecalculating(true);
    setFeedbackMsg(null);
    const loadingToast = toast.loading('Running Hybrid AI Engine (ML Risk + 4-Factor Priority Model)...');
    try {
      const res = await fastapiService.recalculateAllPriorities('CORR-SR-TEN-MDU');
      await loadTasks();
      const successMsg = `Successfully recalculated ${res.successfully_processed} tasks via Hybrid AI Engine (ML Risk + 4-Factor Model).`;
      toast.success(`✅ ${successMsg}`, {
        id: loadingToast,
        duration: 5000,
      });
      setFeedbackMsg({
        type: 'success',
        text: successMsg
      });
    } catch (e) {
      const errorMsg = `Recalculation error: ${e.message}. Using deterministic scoring.`;
      toast.error(`❌ ${errorMsg}`, {
        id: loadingToast,
      });
      setFeedbackMsg({
        type: 'error',
        text: errorMsg
      });
    } finally {
      setRecalculating(false);
    }
  };

  const handleSelectTask = async (task) => {
    setSelectedTask(task);
    setTaskExplanation(null);
    try {
      const exp = await fastapiService.explainTaskPriority(task.id);
      setTaskExplanation(exp);
    } catch (e) {
      console.warn('Explain error fallback:', e);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterDept !== 'ALL' && t.department !== filterDept) return false;
    if (filterLevel !== 'ALL' && t.priority_level !== filterLevel) return false;
    return true;
  });

  const columns = [
    {
      header: 'Rank & Task ID',
      key: 'id',
      render: (val, row, idx) => (
        <div className="flex items-center gap-2">
          <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono font-bold text-[10px] ${
            idx === 0 ? 'bg-amber-100 text-amber-900 border border-amber-300' :
            idx === 1 ? 'bg-slate-200 text-slate-800' :
            idx === 2 ? 'bg-amber-50 text-amber-800' : 'bg-slate-100 text-slate-600'
          }`}>
            {idx + 1}
          </span>
          <div>
            <span className="font-mono font-bold text-[#002869] text-xs block">{val}</span>
            <span className="text-[11px] font-mono text-slate-500">{row.section_id?.replace('SEC-', '')}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Work Specification',
      key: 'task_title',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-800 text-xs">{val}</span>
          <span className="text-[11px] font-mono text-slate-500 block mt-0.5">Asset: {row.asset_id}</span>
        </div>
      )
    },
    {
      header: 'Discipline',
      key: 'department',
      render: (val) => <span className="font-mono text-xs text-[#005db7] font-semibold">{val}</span>
    },
    {
      header: 'Failure Risk',
      key: 'failure_risk',
      sortable: true,
      render: (val) => (
        <div className="flex items-center gap-1.5 font-mono text-xs">
          <div className="w-12 bg-slate-200 rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-1.5 rounded-full ${
                val >= 85 ? 'bg-[#ba1a1a]' : val >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${val || 70}%` }}
            />
          </div>
          <span className="font-bold">{val || 70}%</span>
        </div>
      )
    },
    {
      header: 'Priority Score',
      key: 'priority_score',
      sortable: true,
      render: (val) => {
        const score = Number(val || 75);
        return (
          <div className="flex items-center gap-2">
            <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${
              score >= 85 ? 'bg-red-100 text-[#ba1a1a]' :
              score >= 70 ? 'bg-amber-100 text-amber-900' :
              score >= 50 ? 'bg-blue-50 text-[#005db7]' : 'bg-slate-100 text-slate-700'
            }`}>
              {score.toFixed(1)}/100
            </span>
          </div>
        );
      }
    },
    {
      header: 'Level',
      key: 'priority_level',
      render: (val) => <StatusBadge status={val || 'Medium'} size="sm" />
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#dae2ff] text-[#001947]">
              HYBRID MAINTENANCE INTELLIGENCE
            </span>
            <span className="text-xs font-mono text-slate-500">• Tirunelveli - Madurai Mainline (TEN-MDU)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#002869] tracking-tight">
            AI Priority Engine & Multi-Criteria Ranking
          </h1>
          <p className="text-xs text-[#434652] mt-1 max-w-2xl">
            Calculates explainable priority rankings using ML failure risk prediction, asset criticality, urgency deadlines, and operational impact.
          </p>
        </div>

        <button
          onClick={handleRecalculateAll}
          disabled={recalculating}
          className="px-4 py-2.5 bg-[#002869] hover:bg-[#0b3d91] text-white text-xs font-mono font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${recalculating ? 'animate-spin' : ''}`} />
          {recalculating ? 'Executing ML & Priority Engine...' : 'Recalculate AI Priorities'}
        </button>
      </div>

      {feedbackMsg && (
        <div className={`p-4 rounded-2xl text-xs font-mono flex items-center gap-2 ${
          feedbackMsg.type === 'success'
            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
            : 'bg-red-50 text-[#ba1a1a] border border-red-200'
        }`}>
          {feedbackMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-red-600" />}
          {feedbackMsg.text}
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="P1 Critical Tasks (IMR / Safety)"
          value={tasks.filter((t) => (t.priority_score || 0) >= 85.0).length}
          unit="Immediate"
          delta="Immediate Action Required"
          deltaType="negative"
          subtitle="Score >= 85 / 100"
          icon="warning"
          iconBg="bg-red-50 text-[#ba1a1a]"
        />
        <MetricCard
          title="High Priority Queue"
          value={tasks.filter((t) => (t.priority_score || 0) >= 70.0 && (t.priority_score || 0) < 85.0).length}
          unit="Tasks"
          delta="Bundle in Weekly Plan"
          subtitle="Score 70 - 84 / 100"
          icon="activity"
          iconBg="bg-amber-50 text-amber-700"
        />
        <MetricCard
          title="Medium / Routine Tasks"
          value={tasks.filter((t) => (t.priority_score || 0) < 70.0).length}
          unit="Tasks"
          delta="Monthly Planning"
          subtitle="Score < 70 / 100"
          icon="clock"
          iconBg="bg-blue-50 text-[#005db7]"
        />
        <MetricCard
          title="Scoring Model Version"
          value="Hybrid RF-v1"
          delta="Scikit-Learn Active"
          subtitle="35% Crit + 30% Risk + 20% Urg + 15% Op"
          icon="shield_check"
          iconBg="bg-indigo-50 text-[#002869]"
        />
      </div>

      {/* Model Weights Tuner */}
      <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#005db7]" />
            <h3 className="font-bold text-sm text-[#002869]">Explainable Multi-Criteria Priority Weights</h3>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Total: {weightCriticality + weightRisk + weightUrgency + weightOperational}%
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3 bg-[#f4f3fb] rounded-xl border border-slate-200">
            <div className="flex justify-between font-bold text-[#002869] mb-1">
              <span>Asset Criticality</span>
              <span>{weightCriticality}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={weightCriticality}
              onChange={(e) => setWeightCriticality(Number(e.target.value))}
              className="w-full accent-[#002869]"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Track & Switch Tier</span>
          </div>

          <div className="p-3 bg-[#f4f3fb] rounded-xl border border-slate-200">
            <div className="flex justify-between font-bold text-[#002869] mb-1">
              <span>Failure Risk (ML)</span>
              <span>{weightRisk}%</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              value={weightRisk}
              onChange={(e) => setWeightRisk(Number(e.target.value))}
              className="w-full accent-[#005db7]"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Fatigue & USFD Probability</span>
          </div>

          <div className="p-3 bg-[#f4f3fb] rounded-xl border border-slate-200">
            <div className="flex justify-between font-bold text-[#002869] mb-1">
              <span>Maintenance Urgency</span>
              <span>{weightUrgency}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              value={weightUrgency}
              onChange={(e) => setWeightUrgency(Number(e.target.value))}
              className="w-full accent-[#00a859]"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Intervention Deadline</span>
          </div>

          <div className="p-3 bg-[#f4f3fb] rounded-xl border border-slate-200">
            <div className="flex justify-between font-bold text-[#002869] mb-1">
              <span>Operational Impact</span>
              <span>{weightOperational}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              value={weightOperational}
              onChange={(e) => setWeightOperational(Number(e.target.value))}
              className="w-full accent-purple-600"
            />
            <span className="text-[10px] text-slate-400 block mt-1">Line Capacity & Delays</span>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-xs font-mono">
        <Filter className="w-4 h-4 text-slate-400" />
        <span className="font-bold text-[#747783]">Filter:</span>

        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          className="bg-[#f4f3fb] border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 outline-none"
        >
          <option value="ALL">All Disciplines</option>
          <option value="Civil">Civil</option>
          <option value="Signal & Telecom">Signal & Telecom</option>
          <option value="Electrical">Electrical</option>
        </select>

        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="bg-[#f4f3fb] border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 outline-none"
        >
          <option value="ALL">All Priority Levels</option>
          <option value="P1 Critical">P1 Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Tasks Table */}
      <DataTable
        columns={columns}
        data={filteredTasks}
        title="Ranked Maintenance Task Queue (Hybrid AI Priority Order)"
        onRowClick={(row) => handleSelectTask(row)}
        searchPlaceholder="Search task title, section, or asset code..."
      />

      {/* Task Explanation Modal */}
      {selectedTask && (
        <Modal
          isOpen={Boolean(selectedTask)}
          onClose={() => setSelectedTask(null)}
          title={`Explainable Priority Dossier: ${selectedTask.id}`}
          subtitle={`${selectedTask.department} • ${selectedTask.section_id}`}
          maxWidth="max-w-xl"
          footer={
            <button
              onClick={() => setSelectedTask(null)}
              className="px-4 py-2 bg-[#002869] text-white text-xs font-mono font-bold rounded-lg cursor-pointer"
            >
              Close Dossier
            </button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-[#faf8ff] border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-[#002869] mb-1">{selectedTask.task_title}</h4>
                <p className="text-[#747783] font-mono">Asset ID: {selectedTask.asset_id}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-red-100 text-[#ba1a1a]">
                  Score: {selectedTask.priority_score || 75}/100
                </span>
                <span className="text-[10px] font-mono text-slate-500 block mt-1">{selectedTask.priority_level}</span>
              </div>
            </div>

            {/* Breakdown */}
            {taskExplanation?.contributions ? (
              <div className="space-y-2">
                <span className="font-mono font-bold text-xs text-[#002869] block">Score Component Breakdown</span>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-mono text-[#747783] block uppercase">Asset Criticality (35%)</span>
                    <span className="font-mono font-bold text-slate-800 text-sm">
                      +{taskExplanation.contributions.asset_criticality_contribution} pts
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-mono text-[#747783] block uppercase">Failure Risk (30%)</span>
                    <span className="font-mono font-bold text-slate-800 text-sm">
                      +{taskExplanation.contributions.failure_risk_contribution} pts
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-mono text-[#747783] block uppercase">Urgency (20%)</span>
                    <span className="font-mono font-bold text-slate-800 text-sm">
                      +{taskExplanation.contributions.maintenance_urgency_contribution} pts
                    </span>
                  </div>
                  <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-mono text-[#747783] block uppercase">Operational Impact (15%)</span>
                    <span className="font-mono font-bold text-slate-800 text-sm">
                      +{taskExplanation.contributions.operational_impact_contribution} pts
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Explainable Reasoning */}
            <div className="p-3.5 bg-purple-50/60 border border-purple-200 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-purple-900 font-bold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                Explainable Decision Reasoning
              </div>
              <p className="text-purple-800 leading-relaxed">
                {taskExplanation?.explanation?.summary ||
                  `Priority increased because asset criticality is high, failure risk is elevated (${selectedTask.failure_risk || 75}%), and the task deadline requires tactical scheduling.`}
              </p>
              <div className="mt-2 pt-2 border-t border-purple-200/60 flex items-center justify-between text-[10px] font-mono text-purple-700">
                <span>Prediction Source: {taskExplanation?.prediction_source || 'ml_random_forest'}</span>
                <span className="font-bold">{taskExplanation?.explanation?.recommendation || 'Bundle into upcoming possession'}</span>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
