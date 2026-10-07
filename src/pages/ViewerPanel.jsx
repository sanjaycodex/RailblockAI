import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, BarChart3, Map, Heart, FileText, Activity,
  TrendingUp, CheckCircle2, AlertTriangle, Clock,
  Sparkles, TrainTrack, MapPin, X, ShieldAlert, Radio,
  Send, ShieldCheck, Check, Award
} from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

export default function ViewerPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBlocks: 0,
    approvedBlocks: 0,
    assignedBlocks: 0,
    completedBlocks: 0,
    pendingApprovals: 0,
    completionRate: 0
  });
  const [sections, setSections] = useState([]);
  const [allPlans, setAllPlans] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [selectedPlan, setSelectedPlan] = useState(null);
  
  // Track Fit Modal State
  const [trackFitBlock, setTrackFitBlock] = useState(null);
  const [trackFitStatus, setTrackFitStatus] = useState('Fit for Normal Speed');
  const [trackFitSpeed, setTrackFitSpeed] = useState(110);
  const [trackFitRemarks, setTrackFitRemarks] = useState('All track welding, OHE adjustments, and signal point checks executed. Track cleared and safe for traffic.');
  const [trackFitSigner, setTrackFitSigner] = useState(user?.full_name || 'Er. A. Murugan (SSE/P-Way)');

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadViewerData();
  }, []);

  const loadViewerData = async () => {
    try {
      setLoading(true);

      const [summary, blocks, secList] = await Promise.all([
        api.getDashboardSummary(),
        api.getMaintenanceBlocks(),
        api.getSections()
      ]);

      const approvedCount = blocks.filter(b => b.status === 'Approved').length;
      const proposedCount = blocks.filter(b => b.status === 'Proposed').length;
      const assignedCount = blocks.filter(b => b.status === 'Assigned' || b.status === 'In Progress').length;
      const completedCount = blocks.filter(b => b.status === 'Completed').length;

      setStats({
        totalBlocks: blocks.length,
        approvedBlocks: approvedCount,
        assignedBlocks: assignedCount,
        completedBlocks: completedCount,
        pendingApprovals: proposedCount,
        completionRate: blocks.length ? Math.round((completedCount / blocks.length) * 100) : 100
      });

      setAllPlans(blocks);
      setSections(secList);

    } catch (error) {
      console.error('Error loading viewer data:', error);
      toast.error('Failed to load corridor data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTrackFitModal = (plan) => {
    setTrackFitBlock(plan);
    setTrackFitStatus('Fit for Normal Speed');
    setTrackFitSpeed(110);
    setTrackFitRemarks(`All maintenance tasks on ${plan.railway_sections?.section_name || plan.section_id} executed successfully. Track de-isolated and fit for commercial operations.`);
    setTrackFitSigner(user?.full_name || 'Er. A. Murugan (SSE/P-Way)');
  };

  const handleConfirmTrackFit = async (e) => {
    e.preventDefault();
    if (!trackFitBlock) return;

    try {
      const loadingToast = toast.loading('Submitting Track Fit Certificate and clearing possession...');
      
      await api.completeMaintenanceBlock(trackFitBlock.id, {
        completed_by: trackFitSigner,
        track_fit_status: trackFitStatus,
        speed_restriction_kmh: Number(trackFitSpeed),
        completion_notes: trackFitRemarks
      });

      toast.success(`✅ Track Fit Certificate Issued for ${trackFitBlock.id}! Track cleared for normal train traffic. Planner roster updated.`, {
        id: loadingToast,
        duration: 6000,
        icon: '📜'
      });

      setTrackFitBlock(null);
      await loadViewerData();
    } catch (error) {
      console.error('Error completing maintenance block:', error);
      toast.error('Failed to submit track fit certificate');
    }
  };

  const filteredPlans = allPlans.filter(plan => {
    if (statusFilter !== 'ALL' && plan.status !== statusFilter) return false;
    if (deptFilter !== 'ALL' && plan.assigned_department !== deptFilter) return false;
    return true;
  });

  const StatCard = ({ icon: Icon, label, value, color, subtitle }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-2xl font-black text-slate-900 mb-0.5">{value}</p>
          <p className="text-xs font-mono font-bold text-slate-500 uppercase">{label}</p>
          {subtitle && (
            <p className="text-[10px] font-mono text-slate-400 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-teal-600"></div>
        <p className="text-xs font-mono text-slate-500">Loading Field Staff & Viewer Hub...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-700 via-emerald-700 to-cyan-800 rounded-3xl shadow-lg p-8 text-white relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
              <Eye className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-mono font-bold bg-white/20 mb-2">
                👷 Field Supervisor & Station Staff Portal • Execution & Track Fit Handover
              </div>
              <h1 className="text-3xl font-black tracking-tight">Field Viewer & Handover Panel</h1>
              <p className="text-teal-100 text-xs font-mono mt-1">
                Tirunelveli - Madurai Mainline • {user?.full_name} ({user?.department || 'Field Ops'})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-center">
              <span className="text-2xl font-black text-emerald-300 block">{stats.completedBlocks}</span>
              <span className="text-[10px] font-mono text-teal-200 uppercase">Blocks Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Notice */}
      <div className="bg-teal-50 border border-teal-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Eye className="w-5 h-5 text-teal-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-teal-900 leading-relaxed">
            <p className="font-bold text-sm mb-1">Field Execution & Track Fit Certificate Authority</p>
            <p>
              As <strong>Field Staff / Viewer</strong>, you view work orders assigned to your department. Once on-site track welding, OHE inspection, or signal adjustment is completed, you submit the <strong>Track Fit Certificate</strong> to officially cancel the possession and clear the track for normal traffic.
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Activity} 
          label="Active Assigned" 
          value={stats.assignedBlocks} 
          color="bg-blue-600"
          subtitle="In Progress on Track"
        />
        <StatCard 
          icon={CheckCircle2} 
          label="Completed & Certified" 
          value={stats.completedBlocks} 
          color="bg-emerald-600"
          subtitle="Track Fit Handover Issued"
        />
        <StatCard 
          icon={Clock} 
          label="Approved Schedule" 
          value={stats.approvedBlocks} 
          color="bg-teal-600"
          subtitle="Ready for Execution"
        />
        <StatCard 
          icon={FileText} 
          label="Total Possessions" 
          value={stats.totalBlocks} 
          color="bg-slate-700"
          subtitle="Full Corridor Roster"
        />
      </div>

      {/* Corridor Maintenance Possessions List */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">Corridor Maintenance Possessions & Work Orders</h2>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Execute assigned track blocks and submit Track Fit Certificates upon work completion
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs font-bold">
            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {['ALL', 'Assigned', 'Completed', 'Approved', 'Proposed'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    statusFilter === st ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            {/* Dept Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              {['ALL', 'Civil', 'Electrical', 'Signal & Telecom'].map(dp => (
                <button
                  key={dp}
                  onClick={() => setDeptFilter(dp)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    deptFilter === dp ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {dp === 'Signal & Telecom' ? 'S&T' : dp}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Plan Cards */}
        <div className="space-y-3">
          {filteredPlans.length === 0 ? (
            <p className="text-slate-500 text-center py-8 font-mono text-xs">No plans matching the selected filter</p>
          ) : (
            filteredPlans.map(plan => {
              const isProposed = plan.status === 'Proposed';
              const isApproved = plan.status === 'Approved';
              const isAssigned = plan.status === 'Assigned' || plan.status === 'In Progress';
              const isCompleted = plan.status === 'Completed';

              return (
                <div 
                  key={plan.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    isCompleted ? 'bg-emerald-50/40 border-emerald-300' :
                    isAssigned ? 'bg-blue-50/40 border-blue-300' :
                    isApproved ? 'bg-green-50/20 border-green-200' :
                    'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-mono text-xs font-bold text-slate-500">
                          {plan.id}
                        </span>
                        <h3 className="font-black text-base text-slate-900">
                          {plan.title || plan.railway_sections?.section_name || 'Maintenance Block'}
                        </h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                          isCompleted ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                          isAssigned ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                          isApproved ? 'bg-green-100 text-green-800 border border-green-200' :
                          'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {isCompleted ? '✓ Completed (Track Fit Issued)' : plan.status}
                        </span>
                        {plan.optimization_score && (
                          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-[10px] font-mono font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            {plan.optimization_score}% AI Score
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600 font-mono mb-2">
                        Section: <strong>{plan.railway_sections?.section_name || plan.section_id}</strong>
                      </p>

                      <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(plan.start_time).toLocaleString()} - {new Date(plan.end_time).toLocaleTimeString()}
                        </span>
                        {plan.assigned_department && (
                          <span className="text-blue-700 font-bold">
                            Dept: {plan.assigned_department}
                          </span>
                        )}
                        {plan.assigned_viewer_name && (
                          <span className="text-teal-700 font-bold">
                            Supervisor: {plan.assigned_viewer_name}
                          </span>
                        )}
                        {isCompleted && plan.completed_by && (
                          <span className="text-emerald-700 font-bold">
                            Certified Fit By: {plan.completed_by} ({plan.track_fit_status || 'Normal Speed'})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => setSelectedPlan(plan)}
                        className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Dossier</span>
                      </button>

                      {isAssigned && (
                        <button
                          onClick={() => handleOpenTrackFitModal(plan)}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-mono font-bold text-xs flex items-center gap-1.5 shadow-sm cursor-pointer transition-all"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Submit Track Fit Certificate</span>
                        </button>
                      )}

                      {isCompleted && (
                        <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-mono font-bold border border-emerald-300 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          Track Cleared & Fit
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Track Fit Certificate Modal */}
      {trackFitBlock && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Track Fit & Handover Certificate</h3>
                  <p className="text-xs font-mono text-slate-500">Block ID: {trackFitBlock.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setTrackFitBlock(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmTrackFit} className="space-y-4 text-xs font-mono">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Section:</span>
                  <span className="font-bold text-slate-900">{trackFitBlock.railway_sections?.section_name || trackFitBlock.section_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Executing Dept:</span>
                  <span className="font-bold text-blue-700">{trackFitBlock.assigned_department || 'Civil Engineering'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Work Order Title:</span>
                  <span className="font-bold text-slate-800 truncate">{trackFitBlock.title}</span>
                </div>
              </div>

              {/* Step 1: Track Fitness Status */}
              <div>
                <label className="block font-bold text-slate-900 mb-1 uppercase">
                  1. Track Fitness & Speed Certification *
                </label>
                <select
                  value={trackFitStatus}
                  onChange={(e) => {
                    setTrackFitStatus(e.target.value);
                    if (e.target.value === 'Fit for Normal Speed') setTrackFitSpeed(110);
                    else if (e.target.value === 'Caution Order Imposed (30 km/h)') setTrackFitSpeed(30);
                    else if (e.target.value === 'Caution Order Imposed (50 km/h)') setTrackFitSpeed(50);
                  }}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:border-emerald-500 outline-none"
                >
                  <option value="Fit for Normal Speed">Fit for Normal Section Speed (110 km/h - No Caution)</option>
                  <option value="Caution Order Imposed (30 km/h)">Caution Order: Max 30 km/h for 24 Hours</option>
                  <option value="Caution Order Imposed (50 km/h)">Caution Order: Max 50 km/h for 48 Hours</option>
                </select>
              </div>

              {/* Step 2: Handover Remarks */}
              <div>
                <label className="block font-bold text-slate-900 mb-1 uppercase">
                  2. Handover Remarks & Safety Verification Notes
                </label>
                <textarea
                  value={trackFitRemarks}
                  onChange={(e) => setTrackFitRemarks(e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-slate-300 rounded-xl font-mono text-xs focus:border-emerald-500 outline-none"
                  placeholder="Confirm USFD ultrasonic testing passed, OHE power energized, signal points locked..."
                  required
                />
              </div>

              {/* Step 3: Supervisor Sign-off */}
              <div>
                <label className="block font-bold text-slate-900 mb-1 uppercase">
                  3. Field Supervisor Digital Signature *
                </label>
                <input
                  type="text"
                  value={trackFitSigner}
                  onChange={(e) => setTrackFitSigner(e.target.value)}
                  placeholder="Er. Name (Designation/Dept)"
                  required
                  className="w-full p-3 border border-slate-300 rounded-xl font-mono text-xs focus:border-emerald-500 outline-none"
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTrackFitBlock(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>Issue Track Fit & Handover</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Plan Details Dossier Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-slate-100 text-slate-700 rounded-xl">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Possession Details</h3>
                  <p className="text-xs font-mono text-slate-500">ID: {selectedPlan.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPlan(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Section:</span>
                  <span className="font-bold text-slate-900">{selectedPlan.railway_sections?.section_name || selectedPlan.section_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Timing:</span>
                  <span className="font-bold">{new Date(selectedPlan.start_time).toLocaleString()} - {new Date(selectedPlan.end_time).toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-bold text-teal-700">{selectedPlan.status}</span>
                </div>
                {selectedPlan.assigned_department && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Department:</span>
                    <span className="font-bold text-blue-700">{selectedPlan.assigned_department}</span>
                  </div>
                )}
                {selectedPlan.completed_by && (
                  <div className="flex justify-between">
                    <span className="text-slate-500">Certified Fit By:</span>
                    <span className="font-bold text-emerald-700">{selectedPlan.completed_by}</span>
                  </div>
                )}
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Description & Safety Directives:</span>
                <p className="text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 font-sans text-xs">
                  {selectedPlan.notes || selectedPlan.completion_notes || 'Corridor track possession.'}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSelectedPlan(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
