import React, { useState } from 'react';
import { Sparkles, Zap, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import Modal from '../common/Modal';

export default function NewOptimizationModal({ isOpen, onClose }) {
  const [corridor, setCorridor] = useState('CORR-SR-TEN-MDU');
  const [timeHorizon, setTimeHorizon] = useState('24h');
  const [strategy, setStrategy] = useState('balanced');
  const [optimizing, setOptimizing] = useState(false);

  const handleRunOptimization = () => {
    setOptimizing(true);
    setTimeout(() => {
      setOptimizing(false);
      onClose();
      alert('Optimization solver finished! Generated 3 bundled possession proposals for the Tirunelveli-Madurai corridor.');
    }, 1200);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Run RailBlock AI Optimization Solver"
      subtitle="Multi-objective AI optimization for possession windows and headway de-conflicting"
      maxWidth="max-w-lg"
      footer={
        <>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleRunOptimization}
            disabled={optimizing}
            className="px-4 py-2 bg-[#002869] hover:bg-[#0b3d91] text-white text-xs font-mono font-bold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Zap className="w-3.5 h-3.5" />
            {optimizing ? 'Running Solver...' : 'Execute Optimizer'}
          </button>
        </>
      }
    >
      <div className="space-y-4 text-xs">
        <div>
          <label className="block font-bold text-[#002869] mb-1 font-mono uppercase">
            Target Railway Corridor
          </label>
          <select
            value={corridor}
            onChange={(e) => setCorridor(e.target.value)}
            className="w-full px-3 py-2 bg-[#f4f3fb] border border-slate-200 rounded-xl focus:bg-white outline-none"
          >
            <option value="CORR-SR-TEN-MDU">
              Tirunelveli Junction (TEN) – Madurai Junction (MDU) [157.1 KM]
            </option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-bold text-[#002869] mb-1 font-mono uppercase">
              Time Horizon
            </label>
            <select
              value={timeHorizon}
              onChange={(e) => setTimeHorizon(e.target.value)}
              className="w-full px-3 py-2 bg-[#f4f3fb] border border-slate-200 rounded-xl focus:bg-white outline-none"
            >
              <option value="24h">Next 24 Hours (Tactical)</option>
              <option value="7d">Next 7 Days (Weekly Plan)</option>
              <option value="30d">Next 30 Days (Master Plan)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-[#002869] mb-1 font-mono uppercase">
              Priority Objective
            </label>
            <select
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              className="w-full px-3 py-2 bg-[#f4f3fb] border border-slate-200 rounded-xl focus:bg-white outline-none"
            >
              <option value="balanced">Balanced (Safety + Punctuality)</option>
              <option value="safety">Zero Safety Risk (IMR First)</option>
              <option value="punctuality">Maximum Punctuality (Zero Headway Clashes)</option>
            </select>
          </div>
        </div>

        <div className="p-3 bg-[#e9edff]/40 border border-[#dae2ff] rounded-xl flex items-start gap-2 text-[11px] text-[#001947]">
          <Sparkles className="w-4 h-4 text-[#005db7] flex-shrink-0 mt-0.5" />
          <span>
            The engine will evaluate track geometry, TRD catenary power isolations, and passenger express timetables (including 20666 Vande Bharat) to build conflict-free joint possession bundles.
          </span>
        </div>
      </div>
    </Modal>
  );
}
