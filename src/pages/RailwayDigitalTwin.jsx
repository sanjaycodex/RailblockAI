import React, { useState, useEffect } from 'react';
import {
  Layers, Activity, Radio, TrainTrack, Sparkles, Filter,
  ShieldCheck, Clock, RefreshCw, AlertTriangle, CheckCircle2,
  Calendar, Zap, TrendingUp, ChevronRight, Map, Search, Eye
} from 'lucide-react';
import MetricCard from '../components/common/MetricCard';
import StatusBadge from '../components/common/StatusBadge';
import RailwayMap from '../components/common/RailwayMap';
import { PageLoadingSpinner } from '../components/common/LoadingSpinner';
import { useSimulation } from '../context/SimulationContext';
import { api } from '../services/api';

export default function RailwayDigitalTwin() {
  const { corridorTwinState, loadingTwin, refreshTwinState, activeSimulation } = useSimulation();
  const [selectedSectionId, setSelectedSectionId] = useState('SEC-MEJ-CVP');
  const [activeLayer, setActiveLayer] = useState('ALL');
  const [showMap, setShowMap] = useState(true);

  // Train Movement Tracking State
  const [trains, setTrains] = useState([]);
  const [trainStats, setTrainStats] = useState(null);
  const [trainTypeFilter, setTrainTypeFilter] = useState('ALL');
  const [trainSearchQuery, setTrainSearchQuery] = useState('');
  const [trainSectionFilter, setTrainSectionFilter] = useState('ALL');

  useEffect(() => {
    loadTrainData();
  }, []);

  const loadTrainData = async () => {
    try {
      const [trainList, stats] = await Promise.all([
        api.getTrainMovements(),
        api.getCorridorTrainStats()
      ]);
      setTrains(trainList);
      setTrainStats(stats);
    } catch (err) {
      console.error('Error loading train movements:', err);
    }
  };

  const sectionsData = corridorTwinState?.sections || [];
  const stationsData = corridorTwinState?.stations || [];

  // Find currently selected section
  const currentSectionItem = sectionsData.find(
    (s) => s.section.id === selectedSectionId
  ) || sectionsData[0] || {
    section: { id: 'SEC-MEJ-CVP', section_name: 'Vanchi Maniyachchi - Kovilpatti (MEJ-CVP)', distance: 36.1, asset_health_score: 87.5, traffic_level: 'High' },
    color_state: 'BLUE',
    open_tasks: 2,
    critical_tasks: 1,
    high_risk_assets: 1,
    scheduled_blocks: 1,
    active_blocks: 0,
    available_windows: 1,
    trains_active: 4,
    tasks: [],
    blocks: [],
    windows: []
  };

  const currentSec = currentSectionItem.section;

  // Determine visual color badge for node
  const getColorStyle = (colorState, isSimAffected) => {
    if (isSimAffected) {
      return {
        border: 'border-red-500 ring-2 ring-red-400 bg-red-50/70',
        badge: 'bg-red-600 text-white',
        text: 'text-red-700',
        label: 'SIMULATED CONFLICT'
      };
    }
    switch (colorState) {
      case 'RED':
        return {
          border: 'border-red-500 bg-red-50/50',
          badge: 'bg-red-600 text-white',
          text: 'text-red-700',
          label: 'Block Active / Conflict'
        };
      case 'BLUE':
        return {
          border: 'border-[#002869] bg-blue-50/50',
          badge: 'bg-[#002869] text-white',
          text: 'text-[#002869]',
          label: 'Block Scheduled'
        };
      case 'ORANGE':
        return {
          border: 'border-amber-500 bg-amber-50/50',
          badge: 'bg-amber-500 text-white',
          text: 'text-amber-700',
          label: 'High Risk'
        };
      case 'YELLOW':
        return {
          border: 'border-yellow-400 bg-yellow-50/40',
          badge: 'bg-yellow-500 text-slate-900',
          text: 'text-yellow-800',
          label: 'Maintenance Req'
        };
      case 'GREEN':
      default:
        return {
          border: 'border-emerald-300 bg-emerald-50/30',
          badge: 'bg-emerald-600 text-white',
          text: 'text-emerald-700',
          label: 'Healthy'
        };
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {loadingTwin ? (
        <PageLoadingSpinner message="Loading railway corridor digital twin..." />
      ) : (
        <>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#dae2ff] text-[#001947]">
              SPATIAL TELEMETRY & DIGITAL TWIN
            </span>
            <span className="text-xs font-mono text-slate-500">• Tirunelveli - Madurai Mainline (TEN-MDU)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#002869] tracking-tight">
            Railway Corridor Digital Twin (2D Topological Spatial Map)
          </h1>
          <p className="text-xs text-[#434652] mt-1 max-w-2xl">
            Live telemetry, section health, scheduled blocks, active trains, and conflict overlay across 157.1 KM of Southern Railway mainline.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeSimulation && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-red-100 text-red-800 border border-red-300 animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
              Active Disruption Simulation Overlay
            </span>
          )}
          <button
            onClick={refreshTwinState}
            disabled={loadingTwin}
            className="px-4 py-2 bg-[#f4f3fb] hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-mono font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingTwin ? 'animate-spin' : ''}`} />
            Sync Telemetry
          </button>
        </div>
      </div>

      {/* KPI Overview Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Monitored Corridor"
          value="157.1 KM"
          unit="Double Track"
          delta="6 Sections • 7 Stations"
          subtitle="Tirunelveli ➔ Madurai"
          icon="train"
          iconBg="bg-indigo-50 text-[#002869]"
        />
        <MetricCard
          title="Track Assets Telemetry"
          value={`${corridorTwinState?.total_tasks || 12} Tasks`}
          unit="Active Logged"
          delta="Live Supabase Sync"
          subtitle="Civil • S&T • Electrical TRD"
          icon="activity"
          iconBg="bg-emerald-50 text-emerald-600"
        />
        <MetricCard
          title="Active Trains Tracked"
          value={`${trainStats?.total_trains || trains.length || 27} Rakes`}
          unit="In Transit"
          delta="VB 20666/20627 • Pearl City"
          subtitle="All 27 TEN-MDU Corridor Trains"
          icon="radio"
          iconBg="bg-blue-50 text-[#005db7]"
        />
        <MetricCard
          title="Scheduled Possessions"
          value={`${corridorTwinState?.total_blocks || 3} Blocks`}
          unit="Approved AI Plans"
          delta="Zero Headway Clashes"
          subtitle="OR-Tools Optimized Windows"
          icon="shield_check"
          iconBg="bg-amber-50 text-amber-700"
        />
      </div>

      {/* Layer Filter & Color State Legend */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs text-xs font-mono">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <span className="font-bold text-[#747783] whitespace-nowrap">Telemetry Layers:</span>
          {['ALL', 'Civil Track & Welds', '25kV OHE Catenary', 'Electronic Interlocking S&T', 'Train Movements'].map((layer) => (
            <button
              key={layer}
              onClick={() => setActiveLayer(layer)}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                activeLayer === layer
                  ? 'bg-[#002869] text-white shadow-xs'
                  : 'bg-[#f4f3fb] text-slate-700 hover:bg-slate-100'
              }`}
            >
              {layer}
            </button>
          ))}
        </div>

        {/* State Color Legend */}
        <div className="flex items-center gap-3 text-[11px] font-mono text-slate-600 flex-wrap">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Healthy</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-yellow-400" /> Maint. Req</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> High Risk</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-[#002869]" /> Block Sched.</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-600" /> Conflict/Active</span>
        </div>
      </div>

      {/* Corridor Topological Node Map */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-[#002869] flex items-center gap-2">
            <TrainTrack className="w-5 h-5 text-[#005db7]" />
            Tirunelveli (TEN) ➔ Madurai (MDU) Railway Corridor Digital Twin
          </h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowMap(!showMap)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                showMap 
                  ? 'bg-[#002869] text-white shadow-xs' 
                  : 'bg-[#f4f3fb] text-slate-700 hover:bg-slate-200'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              {showMap ? 'Hide Map' : 'Show Map'}
            </button>
            <span className="text-xs font-mono text-slate-500">Click section for live telemetry dossier</span>
          </div>
        </div>

        {/* Interactive Geographical Map */}
        {showMap && (
          <div className="h-[500px] rounded-xl overflow-hidden border border-slate-200 shadow-sm">
            <RailwayMap
              sections={sectionsData}
              tasks={corridorTwinState?.sections?.flatMap(s => s.tasks || []) || []}
              trains={trains}
              selectedSection={sectionsData.find(s => s.section?.id === selectedSectionId)?.section}
              onSectionClick={(section) => setSelectedSectionId(section.id)}
            />
          </div>
        )}

        {/* Station Sequence Route Ribbon */}
        <div className="relative bg-[#f8fafc] border border-slate-200 rounded-2xl p-4 overflow-x-auto">
          <div className="flex items-center justify-between min-w-[760px] relative">
            {/* Track Line Background */}
            <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1.5 bg-slate-300 rounded-full z-0" />

            {/* Station Nodes */}
            {stationsData.map((stn, idx) => (
              <div key={stn.id || idx} className="relative z-10 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-[#002869] flex items-center justify-center font-mono font-bold text-[10px] text-[#002869] shadow-xs">
                  {stn.station_code || stn.name.substring(0, 3)}
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-800 mt-1.5 text-center leading-tight max-w-[85px]">
                  {stn.name.replace(' Junction', ' Jn')}
                </span>
                <span className="text-[9px] font-mono text-slate-500">KM {stn.distance_from_origin || (idx * 26).toFixed(0)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Linear Track Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {sectionsData.map((secItem) => {
            const sec = secItem.section;
            const isSelected = selectedSectionId === sec.id;
            const isSimAffected = activeSimulation?.section_id === sec.id;
            const style = getColorStyle(secItem.color_state, isSimAffected);

            return (
              <div
                key={sec.id}
                onClick={() => setSelectedSectionId(sec.id)}
                className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between min-h-[145px] ${
                  isSelected
                    ? `${style.border} shadow-level-2 scale-[1.03]`
                    : `border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs`
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono font-bold text-xs text-[#002869]">
                      {sec.id.replace('SEC-', '')}
                    </span>
                    <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${style.badge}`}>
                      {isSimAffected ? 'CONFLICT' : style.label}
                    </span>
                  </div>
                  <h5 className="font-bold text-xs text-slate-900 leading-tight">
                    {sec.section_name || sec.id}
                  </h5>
                </div>

                <div className="space-y-1 mt-2 pt-2 border-t border-slate-100 text-[10px] font-mono">
                  <div className="flex justify-between text-slate-600">
                    <span>Health:</span>
                    <span className="font-bold text-slate-900">{sec.asset_health_score || 90}%</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Open Tasks:</span>
                    <span className="font-bold text-[#005db7]">{secItem.open_tasks}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Blocks:</span>
                    <span className="font-bold text-emerald-700">{secItem.scheduled_blocks} scheduled</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Section Telemetry & Digital Dossier */}
        <div className="p-6 bg-[#f4f3fb] border border-slate-200 rounded-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
            <div>
              <span className="text-[10px] font-mono font-bold uppercase text-[#005db7] block">
                SECTION DIGITAL TWIN DOSSIER
              </span>
              <h4 className="text-lg font-extrabold text-[#002869]">
                {currentSec.section_name || currentSec.id}
              </h4>
              <p className="text-xs font-mono text-slate-500">
                Corridor: Tirunelveli - Madurai (TEN-MDU) • Distance: {currentSec.distance || 28.8} KM • Double Line 25kV Electrified
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white border border-slate-200 font-mono font-bold text-xs text-[#002869] rounded-xl shadow-xs">
                Asset Health: {currentSec.asset_health_score || 90}%
              </span>
              <span className="px-3 py-1 bg-[#002869] font-mono font-bold text-xs text-white rounded-xl shadow-xs">
                Traffic: {currentSec.traffic_level || 'High'}
              </span>
            </div>
          </div>

          {/* Key Section Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] font-mono text-[#747783] block uppercase">Open Tasks</span>
              <span className="font-mono font-bold text-base text-[#002869]">{currentSectionItem.open_tasks} Tasks</span>
              <span className="text-[10px] font-mono text-amber-700 block mt-0.5">
                {currentSectionItem.critical_tasks} Critical Safety
              </span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] font-mono text-[#747783] block uppercase">High-Risk Assets</span>
              <span className="font-mono font-bold text-base text-red-600">{currentSectionItem.high_risk_assets} Assets</span>
              <span className="text-[10px] font-mono text-slate-500 block mt-0.5">Failure Risk &gt; 80%</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] font-mono text-[#747783] block uppercase">Scheduled Blocks</span>
              <span className="font-mono font-bold text-base text-emerald-700">{currentSectionItem.scheduled_blocks} Blocks</span>
              <span className="text-[10px] font-mono text-emerald-600 block mt-0.5">Approved Night Slots</span>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-200">
              <span className="text-[10px] font-mono text-[#747783] block uppercase">Available Windows</span>
              <span className="font-mono font-bold text-base text-[#005db7]">{currentSectionItem.available_windows || 1} Windows</span>
              <span className="text-[10px] font-mono text-slate-500 block mt-0.5">Headway Gaps Available</span>
            </div>
          </div>

          {/* Active Tasks & Optimization Recommendations for Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <h5 className="text-xs font-bold text-[#002869] uppercase font-mono mb-2 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Active Maintenance Tasks on Section
              </h5>
              {currentSectionItem.tasks?.length > 0 ? (
                <div className="space-y-2">
                  {currentSectionItem.tasks.map((t) => (
                    <div key={t.id} className="p-2.5 bg-[#faf8ff] rounded-lg border border-slate-100 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-[11px] text-[#002869]">{t.id}</span>
                        <StatusBadge status={t.severity || 'Medium'} size="sm" />
                      </div>
                      <p className="font-medium text-slate-900 mt-1 leading-snug">{t.task_title}</p>
                      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 mt-1">
                        <span>Dept: {t.department}</span>
                        <span>Est: {t.estimated_duration || 120} min</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs font-mono text-slate-400 py-3 text-center">No open maintenance tasks on this section</p>
              )}
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <h5 className="text-xs font-bold text-[#002869] uppercase font-mono mb-2 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                AI Optimization Recommendation
              </h5>
              {currentSectionItem.tasks && currentSectionItem.tasks.length > 0 ? (
                <div className="p-3.5 bg-purple-50/60 border border-purple-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between text-purple-900 font-bold">
                    <span>OR-Tools Shadow Slot Recommendation</span>
                    <span className="text-[10px] font-mono bg-purple-200 px-2 py-0.5 rounded">
                      {Math.min(95, 70 + (currentSectionItem.tasks.length * 8))}% Fitness
                    </span>
                  </div>
                  <p className="text-purple-800 leading-relaxed">
                    {currentSectionItem.tasks.length >= 3 ? (
                      <>Recommend bundling {currentSectionItem.tasks.slice(0, 2).map(t => t.department).filter((v, i, a) => a.indexOf(v) === i).join(' & ')} tasks during night shadow window (01:30 - 04:30 AM) on {currentSec.section_name || currentSec.id}. Estimated {currentSectionItem.tasks.slice(0, 3).reduce((sum, t) => sum + (t.estimated_duration || 120), 0)} min total duration. Protects express train passages.</>
                    ) : currentSectionItem.tasks.length === 2 ? (
                      <>Recommend coordinating {currentSectionItem.tasks[0].department} and {currentSectionItem.tasks[1].department} maintenance during next available window on {currentSec.section_name || currentSec.id}. Combined duration {currentSectionItem.tasks.reduce((sum, t) => sum + (t.estimated_duration || 120), 0)} min fits within single block.</>
                    ) : (
                      <>Single {currentSectionItem.tasks[0].department} task ({currentSectionItem.tasks[0].estimated_duration || 120} min) on {currentSec.section_name || currentSec.id}. OR-Tools identifies optimal night window (02:00-04:00 AM) with zero train conflicts. Recommend immediate scheduling.</>
                    )}
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-purple-700">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Next available window: {currentSectionItem.available_windows > 0 ? 'Tomorrow 01:30 AM' : 'Pending traffic clearance'}</span>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 bg-green-50/60 border border-green-200 rounded-xl text-xs">
                  <div className="flex items-center gap-2 text-green-900 font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <span>Section Health: Optimal</span>
                  </div>
                  <p className="text-green-800 leading-relaxed">
                    No active maintenance tasks on {currentSec.section_name || currentSec.id}. Section asset health at {currentSec.asset_health_score || 90}%. OR-Tools scheduler recommends routine inspection during next planned maintenance cycle.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: TIRUNELVELI - MADURAI CORRIDOR TRAIN MOVEMENTS & FLEET ROSTER */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#005db7] animate-ping"></span>
              <h3 className="text-lg font-black text-[#002869] flex items-center gap-2">
                <TrainTrack className="w-6 h-6 text-[#005db7]" />
                Tirunelveli ↔ Madurai Corridor Train Operations Roster ({trains.length} Services)
              </h3>
            </div>
            <p className="text-xs font-mono text-slate-500 mt-1">
              Live timetable, headway clearance, and speed profiling across Madurai Division's 157.1 KM electrified double line
            </p>
          </div>

          {/* KPI Chips */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 bg-purple-100 text-purple-900 border border-purple-200 rounded-xl font-bold flex items-center gap-1.5">
              🚄 4 Vande Bharat (130 km/h)
            </span>
            <span className="px-3 py-1.5 bg-blue-100 text-blue-900 border border-blue-200 rounded-xl font-bold flex items-center gap-1.5">
              🚂 14 Superfast & Express
            </span>
            <span className="px-3 py-1.5 bg-amber-100 text-amber-900 border border-amber-200 rounded-xl font-bold flex items-center gap-1.5">
              🚆 5 Local & MEMU
            </span>
            <span className="px-3 py-1.5 bg-emerald-100 text-emerald-900 border border-emerald-200 rounded-xl font-bold flex items-center gap-1.5">
              📦 3 Port Freight Rakes
            </span>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between font-mono text-xs">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={trainSearchQuery}
              onChange={(e) => setTrainSearchQuery(e.target.value)}
              placeholder="Search train name, number (e.g. 20666, Pandian)..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-xs"
            />
          </div>

          {/* Train Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {[
              { id: 'ALL', label: `All (${trains.length})` },
              { id: 'Vande Bharat', label: 'Vande Bharat' },
              { id: 'Superfast Express', label: 'Superfast' },
              { id: 'Express', label: 'Express' },
              { id: 'Passenger', label: 'Passenger' },
              { id: 'MEMU Local', label: 'MEMU' },
              { id: 'Freight / Goods', label: 'Freight' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setTrainTypeFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl font-bold cursor-pointer transition-all whitespace-nowrap ${
                  trainTypeFilter === cat.id
                    ? 'bg-[#002869] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Section Filter */}
          <select
            value={trainSectionFilter}
            onChange={(e) => setTrainSectionFilter(e.target.value)}
            className="p-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-700 outline-none w-full md:w-auto"
          >
            <option value="ALL">All Corridor Sections</option>
            {sectionsData.map(s => (
              <option key={s.section.id} value={s.section.id}>
                {s.section.id.replace('SEC-', '')} ({s.section.section_name?.split('(')[0]})
              </option>
            ))}
          </select>
        </div>

        {/* Train Movement Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trains
            .filter(t => {
              if (trainTypeFilter !== 'ALL' && t.train_type !== trainTypeFilter) return false;
              if (trainSectionFilter !== 'ALL' && t.section_id !== trainSectionFilter) return false;
              if (trainSearchQuery) {
                const q = trainSearchQuery.toLowerCase();
                const matchNum = t.train_number?.toLowerCase().includes(q);
                const matchName = t.train_name?.toLowerCase().includes(q);
                const matchRoute = t.route?.toLowerCase().includes(q);
                const matchTraction = t.traction?.toLowerCase().includes(q);
                if (!matchNum && !matchName && !matchRoute && !matchTraction) return false;
              }
              return true;
            })
            .map(train => {
              const isVB = train.train_type === 'Vande Bharat';
              const isAmrit = train.train_type === 'Amrit Bharat';
              const isFreight = train.train_type === 'Freight / Goods';
              const isSF = train.train_type === 'Superfast Express';

              return (
                <div
                  key={train.id}
                  className={`p-4 rounded-2xl border transition-all hover:shadow-md ${
                    isVB ? 'bg-purple-50/40 border-purple-200' :
                    isAmrit ? 'bg-orange-50/40 border-orange-200' :
                    isFreight ? 'bg-emerald-50/40 border-emerald-200' :
                    isSF ? 'bg-blue-50/30 border-blue-200' :
                    'bg-slate-50/60 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-black text-sm text-[#002869]">
                        {train.train_number}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                        isVB ? 'bg-purple-200 text-purple-900' :
                        isAmrit ? 'bg-orange-200 text-orange-900' :
                        isFreight ? 'bg-emerald-200 text-emerald-900' :
                        isSF ? 'bg-blue-200 text-blue-900' :
                        'bg-slate-200 text-slate-800'
                      }`}>
                        {train.train_type}
                      </span>
                    </div>

                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                      train.live_status === 'On Time' ? 'bg-green-100 text-green-800 border border-green-300' :
                      train.live_status === 'Running' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      ● {train.live_status || 'Scheduled'}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs leading-snug mb-1">
                    {train.train_name}
                  </h4>

                  <p className="text-[11px] font-mono font-bold text-[#005db7] mb-2.5">
                    {train.route}
                  </p>

                  <div className="p-2.5 bg-white/90 rounded-xl border border-slate-200/80 space-y-1 text-[10px] font-mono text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Corridor Section:</span>
                      <button
                        onClick={() => setSelectedSectionId(train.section_id)}
                        className="font-bold text-[#002869] hover:underline cursor-pointer"
                        title="Click to focus section on twin"
                      >
                        {train.section_id} 🔍
                      </button>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Scheduled Time:</span>
                      <span className="font-bold text-slate-800">
                        {new Date(train.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(train.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Speed / Traction:</span>
                      <span className="font-bold text-slate-900">{train.speed_kmh} km/h • {train.traction?.split(' ')[0]}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Frequency:</span>
                      <span className="text-slate-700">{train.frequency}</span>
                    </div>
                  </div>

                  {train.stoppages && train.stoppages.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-200/70">
                      <span className="text-[9px] font-mono uppercase text-slate-400 block mb-1">Key Corridor Stoppages:</span>
                      <div className="flex flex-wrap gap-1">
                        {train.stoppages.slice(0, 6).map((stn, i) => (
                          <span key={i} className="px-1.5 py-0.5 bg-white text-[9px] font-mono font-bold text-slate-700 rounded border border-slate-200">
                            {stn}
                          </span>
                        ))}
                        {train.stoppages.length > 6 && (
                          <span className="text-[9px] font-mono text-slate-400 self-center">
                            +{train.stoppages.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>
      </>
      )}
    </div>
  );
}
