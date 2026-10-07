import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, ShieldCheck, Sliders, Bell, Database, CheckCircle2 } from 'lucide-react';
import StatusBadge from '../components/common/StatusBadge';

export default function Settings() {
  const [minConfidence, setMinConfidence] = useState('85');
  const [autoApproveShadow, setAutoApproveShadow] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [telemetryFrequency, setTelemetryFrequency] = useState('5');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#dae2ff] text-[#001947]">
              SYSTEM CONFIGURATION
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#002869] tracking-tight">
            RailBlockAI Control & Optimization Settings
          </h1>
          <p className="text-xs text-[#434652] mt-1">
            Configure algorithmic safety thresholds, division network parameters, and automated block dispatch rules.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2.5 bg-[#002869] hover:bg-[#0b3d91] text-white text-xs font-mono font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              Settings Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Configuration
            </>
          )}
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* AI Solver Parameters */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-[#002869] text-base flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#005db7]" />
            AI Algorithm & Constraint Thresholds
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#002869] mb-1 font-mono uppercase">
                Minimum AI Confidence Threshold for Auto-Suggestion
              </label>
              <select
                value={minConfidence}
                onChange={(e) => setMinConfidence(e.target.value)}
                className="w-full px-3 py-2 bg-[#f4f3fb] border border-slate-200 rounded-xl font-mono text-xs focus:bg-white outline-none"
              >
                <option value="80">80% Confidence (Aggressive Optimization)</option>
                <option value="85">85% Confidence (Standard Recommended)</option>
                <option value="90">90% Confidence (Strict High Reliability)</option>
                <option value="95">95% Confidence (Zero-Tolerance Critical)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#002869] mb-1 font-mono uppercase">
                Sensor Telemetry Polling Rate
              </label>
              <select
                value={telemetryFrequency}
                onChange={(e) => setTelemetryFrequency(e.target.value)}
                className="w-full px-3 py-2 bg-[#f4f3fb] border border-slate-200 rounded-xl font-mono text-xs focus:bg-white outline-none"
              >
                <option value="1">Every 1 Second (Ultra Low Latency)</option>
                <option value="5">Every 5 Seconds (Standard Real-time)</option>
                <option value="30">Every 30 Seconds (Bandwidth Conservative)</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={autoApproveShadow}
                onChange={(e) => setAutoApproveShadow(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#002869] focus:ring-[#005db7]"
              />
              <span className="text-xs text-slate-800 font-medium">
                Auto-lock zero-conflict shadow blocks under 120 minutes during night hours (01:00 - 04:30)
              </span>
            </label>
          </div>
        </div>

        {/* Notifications & Alerts */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-[#002869] text-base flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#005db7]" />
            Dispatch & Incident Notifications
          </h3>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#002869] focus:ring-[#005db7]"
              />
              <span className="text-slate-800 font-medium">
                Instant Email Dispatch for Critical IMR (Immediate Removal) track defect alerts
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#002869] focus:ring-[#005db7]"
              />
              <span className="text-slate-800 font-medium">
                SMS Urgent Caution Order dispatch to Section Engineer on Duty
              </span>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
