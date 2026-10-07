import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Wrench, Calendar, Package, Zap, Brain, Play,
  CheckCircle2, Clock, AlertCircle, TrendingUp, Send, Users,
  Phone, Radio, MapPin, Sparkles, Filter, AlertTriangle, ChevronRight, X, Eye, Plus, Check
} from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { analyzeProblemCriticality, analyzeProblemWithGroq } from '../services/aiCriticalityEngine';

const DEPARTMENTS = ['Civil', 'Electrical', 'Signal & Telecom', 'Mechanical'];

const QuickAction = ({ icon: Icon, label, color, onClick }) => (
  <button
    onClick={onClick}
    className={`${color} text-white rounded-2xl shadow-sm p-4 hover:shadow-md hover:scale-[1.02] transition-all duration-200 flex flex-col items-center gap-2 w-full cursor-pointer text-center`}
  >
    <Icon className="w-6 h-6" />
    <span className="font-mono font-bold text-xs">{label}</span>
  </button>
);

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
    <div className="flex items-start gap-4">
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-2xl font-black text-slate-900">{value}</p>
        <p className="text-xs font-mono font-bold text-slate-500 uppercase">{label}</p>
      </div>
    </div>
  </div>
);

export default function PlannerPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pendingTasks: 0,
    scheduledBlocks: 0,
    optimizationScore: 94,
    assignedTasks: 0,
    awaitingApproval: 0
  });
  const [recentBlocks, setRecentBlocks] = useState([]);
  const [planFilter, setPlanFilter] = useState('ALL');
  const [fieldViewers, setFieldViewers] = useState([]);
  const [viewerDeptFilter, setViewerDeptFilter] = useState('ALL');
  const [viewerStatusFilter, setViewerStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Assignment Modal State (for existing approved blocks)
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [selectedDept, setSelectedDept] = useState('Civil');
  const [selectedViewerId, setSelectedViewerId] = useState('');
  const [assignmentNotes, setAssignmentNotes] = useState('');

  // Create & Assign New Work Order Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newWorkSection, setNewWorkSection] = useState('SEC-TEN-MEJ');
  const [newWorkDept, setNewWorkDept] = useState('Civil');
  const [newWorkTitle, setNewWorkTitle] = useState('');
  const [newWorkViewerId, setNewWorkViewerId] = useState('');
  const [newWorkDuration, setNewWorkDuration] = useState(120);
  const [newWorkPriority, setNewWorkPriority] = useState('P1 Critical');
  const [newWorkNotes, setNewWorkNotes] = useState('');

  useEffect(() => {
    loadPlannerData();
  }, []);

  const loadPlannerData = async () => {
    try {
      setLoading(true);

      const [summary, blocks, viewers] = await Promise.all([
        api.getDashboardSummary(),
        api.getMaintenanceBlocks(),
        api.getFieldViewers()
      ]);

      const proposedCount = blocks.filter(b => b.status === 'Proposed').length;
      const assignedCount = blocks.filter(b => b.status === 'Assigned' || b.status === 'In Progress').length;

      setStats({
        pendingTasks: summary.pendingTasks || 0,
        scheduledBlocks: blocks.length,
        optimizationScore: 94,
        assignedTasks: assignedCount,
        awaitingApproval: proposedCount
      });

      setRecentBlocks(blocks);
      setFieldViewers(viewers);

    } catch (error) {
      console.error('Error loading planner data:', error);
      toast.error('Failed to load planner data');
    } finally {
      setLoading(false);
    }
  };

  const openAssignModal = (block) => {
    setSelectedBlock(block);
    const dept = block.assigned_department || 'Civil';
    setSelectedDept(dept);
    
    // Find first available viewer for this dept
    const deptViewers = fieldViewers.filter(v => v.department === dept);
    const firstAvail = deptViewers.find(v => v.status === 'Available') || deptViewers[0];
    setSelectedViewerId(firstAvail?.id || '');
    setAssignmentNotes(`Priority maintenance assignment for ${block.railway_sections?.section_name || block.title || 'corridor section'}. Adhere strictly to Southern Railway safety rules and caution orders.`);
    setAssignModalOpen(true);
  };

  const handleDeptChange = (dept) => {
    setSelectedDept(dept);
    const deptViewers = fieldViewers.filter(v => v.department === dept);
    const firstAvail = deptViewers.find(v => v.status === 'Available') || deptViewers[0];
    setSelectedViewerId(firstAvail?.id || '');
  };

  const handleConfirmAssignment = async (e) => {
    e.preventDefault();
    if (!selectedBlock) return;

    try {
      const chosenViewer = fieldViewers.find(v => v.id === selectedViewerId) || null;
      await api.assignMaintenanceBlock(
        selectedBlock.id,
        selectedDept,
        chosenViewer,
        user?.full_name || 'Er. R. Ramesh (Senior Section Engineer)',
        assignmentNotes
      );

      toast.success(`Plan assigned to ${selectedDept} department under ${chosenViewer?.name || 'designated supervisor'}!`, {
        duration: 5000,
        icon: '📋'
      });

      setAssignModalOpen(false);
      setSelectedBlock(null);
      await loadPlannerData();
    } catch (error) {
      console.error('Error assigning plan:', error);
      toast.error('Failed to assign plan');
    }
  };

  // Handler to submit a new work order to Admin for approval
  const handleCreateAndAssignNewWork = async (e) => {
    e.preventDefault();
    if (!newWorkTitle) {
      toast.error('Please enter a work order title');
      return;
    }

    try {
      const sectionNameMap = {
        'SEC-TEN-MEJ': 'Tirunelveli - Vanchi Maniyachchi (TEN-MEJ)',
        'SEC-MEJ-CVP': 'Vanchi Maniyachchi - Kovilpatti (MEJ-CVP)',
        'SEC-CVP-SRT': 'Kovilpatti - Satur (CVP-SRT)',
        'SEC-SRT-VPT': 'Satur - Virudhunagar (SRT-VPT)',
        'SEC-VPT-TMQ': 'Virudhunagar - Tirumangalam (VPT-TMQ)',
        'SEC-TMQ-MDU': 'Tirumangalam - Madurai Approach (TMQ-MDU)',
      };

      const now = new Date();
      const startTime = new Date(now.getTime() + 4 * 3600000).toISOString();
      const endTime = new Date(now.getTime() + (4 + (newWorkDuration / 60)) * 3600000).toISOString();

      const aiAnalysis = await analyzeProblemWithGroq({
        title: newWorkTitle,
        notes: newWorkNotes,
        section_id: newWorkSection,
        department: newWorkDept
      });

      const newBlock = {
        id: `BLK-WO-${Date.now().toString().slice(-4)}`,
        section_id: newWorkSection,
        title: newWorkTitle,
        start_time: startTime,
        end_time: endTime,
        duration_minutes: Number(newWorkDuration),
        status: 'Proposed', // Awaiting Admin Approval
        optimization_score: 95.0,
        ai_criticality_score: aiAnalysis.criticalityScore,
        priority_score: aiAnalysis.criticalityScore,
        priority_level: aiAnalysis.priorityLevel,
        hazard_type: aiAnalysis.hazardType,
        ai_risk_summary: aiAnalysis.riskSummary,
        ai_model_used: aiAnalysis.modelUsed,
        approved_by: null,
        approved_at: null,
        assigned_department: newWorkDept, // Target dept requested
        assigned_by: user?.full_name || 'Er. R. Ramesh (Senior Section Engineer)',
        assigned_viewer_id: null,
        assigned_viewer_name: null,
        notes: newWorkNotes || `Problem submitted by Planner. Target Dept: ${newWorkDept}. Priority: ${aiAnalysis.priorityLevel}.`,
        section_name: sectionNameMap[newWorkSection] || newWorkSection
      };

      await api.createMaintenanceBlock(newBlock);

      toast.success(`🤖 Groq AI (${aiAnalysis.modelUsed || 'LLaMA 3.3'}): Assessed as ${aiAnalysis.priorityLevel} (${aiAnalysis.criticalityScore}%). Prioritized for Chief Controller!`, {
        duration: 6500,
        icon: '⚡'
      });

      setCreateModalOpen(false);
      setNewWorkTitle('');
      setNewWorkNotes('');
      await loadPlannerData();
    } catch (error) {
      console.error('Error creating work order:', error);
      toast.error('Failed to create work order');
    }
  };

  const handleToggleViewerStatus = async (viewerId, currentStatus) => {
    const nextStatus = 
      currentStatus === 'Available' ? 'Occupied' :
      currentStatus === 'Occupied' ? 'Off-Duty' : 'Available';

    await api.updateViewerStatus(viewerId, nextStatus, nextStatus === 'Occupied' ? 'Manual Work Order' : null);
    toast(`Viewer status updated to ${nextStatus}`, { icon: '🔄' });
    const updated = await api.getFieldViewers();
    setFieldViewers(updated);
  };

  // Filtered viewers for the availability hub
  const displayedViewers = fieldViewers.filter(v => {
    if (viewerDeptFilter !== 'ALL' && v.department !== viewerDeptFilter) return false;
    if (viewerStatusFilter !== 'ALL' && v.status !== viewerStatusFilter) return false;
    return true;
  });

  const availableViewersCount = fieldViewers.filter(v => v.status === 'Available').length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
        <p className="text-xs font-mono text-slate-500">Loading Section Planning Suite & Availability Hub...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-700 via-cyan-700 to-indigo-800 rounded-3xl shadow-lg p-8 text-white relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
              <Wrench className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-mono font-bold bg-white/20 mb-2">
                🛠️ Section Planning Engineer • Planning & Department Assignment
              </div>
              <h1 className="text-3xl font-black tracking-tight">Planner Control & Assignment Panel</h1>
              <p className="text-blue-100 text-xs font-mono mt-1">
                Tirunelveli Section (TEN-MDU) • {user?.full_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-4 py-2.5 bg-white text-blue-900 hover:bg-blue-50 font-mono font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Work Order</span>
            </button>
            <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-center">
              <span className="text-2xl font-black text-cyan-300 block">{availableViewersCount}/{fieldViewers.length}</span>
              <span className="text-[10px] font-mono text-blue-200 uppercase">Field Staff On-Duty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Responsibilities Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <Wrench className="w-5 h-5 text-blue-700 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-blue-900 leading-relaxed">
            <p className="font-bold text-sm mb-1">Planner Workflow & Assignment Authority</p>
            <p>
              As <strong>Planner</strong>, your key duties are to <strong>view maintenance plans</strong>, <strong>check the real-time availability of viewers/field staff</strong>, 
              and <strong>assign approved plans to respective departments</strong> (Civil, Electrical, S&T, Mechanical).
            </p>
            <div className="mt-2 text-blue-800 flex items-center gap-2">
              <span className="bg-blue-200 text-blue-900 font-mono px-2 py-0.5 rounded font-bold text-[10px]">NOTICE</span>
              <span>Approval authority is held strictly by the <strong>Admin (Chief Controller)</strong>. Planners cannot approve or reject plans.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Clock} 
          label="Awaiting Admin" 
          value={stats.awaitingApproval} 
          color="bg-orange-500"
        />
        <StatCard 
          icon={CheckCircle2} 
          label="Assigned to Dept" 
          value={stats.assignedTasks} 
          color="bg-green-600"
        />
        <StatCard 
          icon={Users} 
          label="Available Viewers" 
          value={`${availableViewersCount} Active`} 
          color="bg-teal-600"
        />
        <StatCard 
          icon={Package} 
          label="Total Plans" 
          value={stats.scheduledBlocks} 
          color="bg-blue-600"
        />
      </div>

      {/* SECTION 1: FIELD STAFF & VIEWER AVAILABILITY HUB (PRIMARY PLANNER FUNCTION) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></span>
              <h2 className="text-xl font-black text-slate-900">Live Field Staff & Viewer Availability Roster</h2>
            </div>
            <p className="text-xs text-slate-500 font-mono mt-0.5">
              Verify real-time availability of station masters, section supervisors, and field engineers before work assignment
            </p>
          </div>

          {/* Availability Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Dept Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl font-mono text-xs font-bold">
              {['ALL', 'Civil', 'Electrical', 'Signal & Telecom'].map(d => (
                <button
                  key={d}
                  onClick={() => setViewerDeptFilter(d)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    viewerDeptFilter === d ? 'bg-white text-blue-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {d === 'Signal & Telecom' ? 'S&T' : d}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl font-mono text-xs font-bold">
              {['ALL', 'Available', 'Occupied'].map(s => (
                <button
                  key={s}
                  onClick={() => setViewerStatusFilter(s)}
                  className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                    viewerStatusFilter === s ? 'bg-white text-teal-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Viewers Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {displayedViewers.map(viewer => {
            const isAvail = viewer.status === 'Available';
            const isOccupied = viewer.status === 'Occupied';

            return (
              <div
                key={viewer.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isAvail ? 'bg-teal-50/30 border-teal-200' :
                  isOccupied ? 'bg-amber-50/40 border-amber-200' :
                  'bg-slate-50 border-slate-200 opacity-70'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                    {viewer.department}
                  </span>
                  <button
                    onClick={() => handleToggleViewerStatus(viewer.id, viewer.status)}
                    title="Click to toggle status for testing"
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold cursor-pointer transition-all ${
                      isAvail ? 'bg-green-100 text-green-800 border border-green-300 hover:bg-green-200' :
                      isOccupied ? 'bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200' :
                      'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    ● {viewer.status}
                  </button>
                </div>

                <h4 className="font-bold text-slate-900 text-sm leading-snug">{viewer.name}</h4>
                <p className="text-[11px] text-slate-600 font-mono mt-0.5">{viewer.designation}</p>

                <div className="mt-3 pt-2.5 border-t border-slate-200/80 space-y-1 text-[11px] font-mono text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>Station: <strong>{viewer.station_name} ({viewer.station_code})</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Shift: {viewer.shift}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Radio className="w-3.5 h-3.5 text-slate-400" />
                    <span>{viewer.radio_channel}</span>
                  </div>
                  {viewer.current_assignment && (
                    <div className="mt-1 text-[10px] text-amber-800 bg-amber-100/60 p-1.5 rounded-lg">
                      Task: {viewer.current_assignment}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: PLANS & DEPARTMENT ASSIGNMENT WORKSPACE */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-black text-slate-900">Maintenance Plans & Department Assignment Workspace</h2>
            <p className="text-xs text-slate-500 font-mono">
              Assign <strong>Approved</strong> possessions to field supervisors. Monitor live execution and verified <strong>Track Fit Certificates</strong>.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl font-mono text-xs font-bold">
              {['ALL', 'Approved', 'Assigned', 'Completed', 'Proposed'].map(f => (
                <button
                  key={f}
                  onClick={() => setPlanFilter(f)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                    planFilter === f ? 'bg-[#002869] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f === 'Proposed' ? 'Pending Admin' : f}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCreateModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-mono font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Work Order</span>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {recentBlocks
            .filter(b => {
              if (planFilter === 'ALL') return true;
              if (planFilter === 'Assigned') return b.status === 'Assigned' || b.status === 'In Progress';
              return b.status === planFilter;
            })
            .length === 0 ? (
            <p className="text-slate-500 text-center py-8 font-mono text-xs">No plans matching the "{planFilter}" filter</p>
          ) : (
            recentBlocks
              .filter(b => {
                if (planFilter === 'ALL') return true;
                if (planFilter === 'Assigned') return b.status === 'Assigned' || b.status === 'In Progress';
                return b.status === planFilter;
              })
              .map(block => {
                const isProposed = block.status === 'Proposed';
                const isApproved = block.status === 'Approved';
                const isAssigned = block.status === 'Assigned' || block.status === 'In Progress';
                const isCompleted = block.status === 'Completed';

                return (
                  <div 
                    key={block.id}
                    className={`p-5 rounded-2xl border transition-all ${
                      isCompleted ? 'bg-emerald-50/50 border-emerald-300' :
                      isApproved ? 'bg-green-50/40 border-green-200' :
                      isAssigned ? 'bg-blue-50/30 border-blue-200' :
                      'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="font-mono text-xs font-bold text-slate-500">
                            {block.id}
                          </span>
                          <h3 className="font-black text-base text-slate-900">
                            {block.title || block.railway_sections?.section_name || 'Corridor Maintenance Block'}
                          </h3>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                            isCompleted ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                            isProposed ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                            isApproved ? 'bg-green-100 text-green-800 border border-green-200' :
                            isAssigned ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {isCompleted ? '✓ Completed (Track Fit Issued)' : block.status}
                          </span>
                          {block.optimization_score && (
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-[10px] font-mono font-bold flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              {block.optimization_score}% AI Score
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 font-mono mb-2">
                          Section: <strong>{block.railway_sections?.section_name || block.section_id}</strong>
                        </p>

                        <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-600">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(block.start_time).toLocaleString()} - {new Date(block.end_time).toLocaleTimeString()}
                          </span>
                          {block.approved_by && (
                            <span className="text-green-700 font-bold">
                              ✓ Approved by: {block.approved_by}
                            </span>
                          )}
                          {block.assigned_department && (
                            <span className="text-blue-700 font-bold">
                              Dept: {block.assigned_department}
                            </span>
                          )}
                          {block.assigned_viewer_name && (
                            <span className="text-teal-700 font-bold">
                              Supervisor: {block.assigned_viewer_name}
                            </span>
                          )}
                          {isCompleted && block.completed_by && (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              Track Fit Certified by: {block.completed_by} ({block.track_fit_status || 'Normal Speed 110 km/h'})
                            </span>
                          )}
                        </div>

                        {/* Completion Certificate Note */}
                        {isCompleted && block.completion_notes && (
                          <div className="mt-2.5 p-2.5 bg-emerald-100/60 border border-emerald-200 rounded-xl text-[11px] font-mono text-emerald-900">
                            <strong>Handover Directives:</strong> {block.completion_notes}
                          </div>
                        )}
                      </div>

                      {/* Action Controls */}
                      <div>
                        {isApproved && (
                          <button
                            onClick={() => openAssignModal(block)}
                            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-mono font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>Assign to Dept & Staff</span>
                          </button>
                        )}

                        {isProposed && (
                          <div className="px-3.5 py-2 bg-orange-100/70 border border-orange-200 text-orange-800 rounded-xl text-xs font-mono flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                            <span>Awaiting Admin Approval (Planner cannot approve)</span>
                          </div>
                        )}

                        {isAssigned && (
                          <span className="px-3.5 py-2 bg-blue-100 text-blue-800 border border-blue-200 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5">
                            ✓ Work Order Issued to Field
                          </span>
                        )}

                        {isCompleted && (
                          <span className="px-3.5 py-2 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            Track Fit & Cleared
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


      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-sm font-bold font-mono uppercase text-slate-500 mb-3">AI Optimization & Planning Tools</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <QuickAction 
            icon={Brain} 
            label="Priority Engine"
            color="bg-gradient-to-br from-purple-600 to-indigo-600"
            onClick={() => navigate('/ai-priority-engine')}
          />
          <QuickAction 
            icon={Package} 
            label="Smart Bundling"
            color="bg-gradient-to-br from-green-600 to-emerald-600"
            onClick={() => navigate('/smart-block-bundling')}
          />
          <QuickAction 
            icon={Zap} 
            label="Block Optimizer"
            color="bg-gradient-to-br from-orange-600 to-amber-600"
            onClick={() => navigate('/ai-block-optimizer')}
          />
          <QuickAction 
            icon={Calendar} 
            label="Weekly Plan"
            color="bg-gradient-to-br from-blue-600 to-cyan-600"
            onClick={() => navigate('/weekly-planner')}
          />
          <QuickAction 
            icon={Calendar} 
            label="Monthly Plan"
            color="bg-gradient-to-br from-indigo-600 to-purple-600"
            onClick={() => navigate('/monthly-planner')}
          />
          <QuickAction 
            icon={Play} 
            label="What-If Sim"
            color="bg-gradient-to-br from-teal-600 to-emerald-600"
            onClick={() => navigate('/what-if-simulator')}
          />
        </div>
      </div>

      {/* 1. Department & Staff Assignment Modal */}
      {assignModalOpen && selectedBlock && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Assign Maintenance Plan</h3>
                  <p className="text-xs font-mono text-slate-500">Plan: {selectedBlock.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setAssignModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmAssignment} className="space-y-4 text-xs font-mono">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500 block">Section:</span>
                <span className="font-bold text-slate-900 text-sm">
                  {selectedBlock.railway_sections?.section_name || selectedBlock.section_id}
                </span>
                <span className="text-slate-500 block mt-1">Scheduled Window:</span>
                <span className="text-slate-800 font-bold">
                  {new Date(selectedBlock.start_time).toLocaleString()} - {new Date(selectedBlock.end_time).toLocaleTimeString()}
                </span>
              </div>

              {/* Step 1: Select Target Department */}
              <div>
                <label className="block font-bold text-slate-900 mb-2 uppercase">
                  1. Select Target Department
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {DEPARTMENTS.map(dept => (
                    <button
                      key={dept}
                      type="button"
                      onClick={() => handleDeptChange(dept)}
                      className={`p-3 rounded-xl border text-left font-bold transition-all cursor-pointer ${
                        selectedDept === dept
                          ? 'bg-blue-50 border-blue-600 text-blue-900 shadow-xs'
                          : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span>{dept}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 2: Select Available Viewer / Field Supervisor */}
              <div>
                <label className="block font-bold text-slate-900 mb-2 uppercase">
                  2. Select Available Field Supervisor / Viewer ({selectedDept})
                </label>
                <select
                  value={selectedViewerId}
                  onChange={(e) => setSelectedViewerId(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:border-blue-500 outline-none"
                >
                  <option value="">-- Assign to General {selectedDept} Department Pool --</option>
                  {fieldViewers
                    .filter(v => v.department === selectedDept)
                    .map(v => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.designation}) — Status: {v.status} [{v.station_name}]
                      </option>
                    ))}
                </select>
              </div>

              {/* Step 3: Assignment Instructions */}
              <div>
                <label className="block font-bold text-slate-900 mb-1 uppercase">
                  3. Work Order Notes & Safety Instructions
                </label>
                <textarea
                  value={assignmentNotes}
                  onChange={(e) => setAssignmentNotes(e.target.value)}
                  rows={3}
                  className="w-full p-3 border border-slate-300 rounded-xl font-mono text-xs focus:border-blue-500 outline-none"
                  placeholder="Enter machinery requirements, caution orders, speed restriction directives..."
                />
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Confirm Department Assignment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Create & Assign New Work Order Modal */}
      {createModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Create & Assign Work Order</h3>
                  <p className="text-xs font-mono text-slate-500">Assign maintenance task directly to Department and Field Staff</p>
                </div>
              </div>
              <button 
                onClick={() => setCreateModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateAndAssignNewWork} className="space-y-4 text-xs font-mono">
              {/* Work Order Title */}
              <div>
                <label className="block font-bold text-slate-900 mb-1 uppercase">
                  Work Order / Task Title *
                </label>
                <input
                  type="text"
                  value={newWorkTitle}
                  onChange={(e) => setNewWorkTitle(e.target.value)}
                  placeholder="e.g. Ultrasonic Rail Flaw Rectification & Joint Catenary Overhaul"
                  required
                  className="w-full p-3 border border-slate-300 rounded-xl font-mono text-xs focus:border-blue-500 outline-none"
                />
              </div>

              {/* Section & Department */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-900 mb-1 uppercase">
                    Corridor Section
                  </label>
                  <select
                    value={newWorkSection}
                    onChange={(e) => setNewWorkSection(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:border-blue-500 outline-none"
                  >
                    <option value="SEC-TEN-MEJ">Tirunelveli - Vanchi Maniyachchi (TEN-MEJ)</option>
                    <option value="SEC-MEJ-CVP">Vanchi Maniyachchi - Kovilpatti (MEJ-CVP)</option>
                    <option value="SEC-CVP-SRT">Kovilpatti - Satur (CVP-SRT)</option>
                    <option value="SEC-SRT-VPT">Satur - Virudhunagar (SRT-VPT)</option>
                    <option value="SEC-VPT-TMQ">Virudhunagar - Tirumangalam (VPT-TMQ)</option>
                    <option value="SEC-TMQ-MDU">Tirumangalam - Madurai (TMQ-MDU)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-900 mb-1 uppercase">
                    Target Department
                  </label>
                  <select
                    value={newWorkDept}
                    onChange={(e) => {
                      setNewWorkDept(e.target.value);
                      const deptViewers = fieldViewers.filter(v => v.department === e.target.value);
                      const firstAvail = deptViewers.find(v => v.status === 'Available') || deptViewers[0];
                      setNewWorkViewerId(firstAvail?.id || '');
                    }}
                    className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl font-mono text-xs focus:border-blue-500 outline-none"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* LIVE AI CRITICALITY & RISK ANALYZER */}
              {(() => {
                const liveAi = analyzeProblemCriticality({
                  title: newWorkTitle,
                  notes: newWorkNotes,
                  section_id: newWorkSection,
                  department: newWorkDept
                });

                return (
                  <div className={`p-3.5 rounded-2xl border transition-all ${
                    liveAi.isTopCritical
                      ? 'bg-red-50/80 border-red-300 text-red-950'
                      : liveAi.priorityLevel === 'P2 High'
                      ? 'bg-amber-50/80 border-amber-300 text-amber-950'
                      : 'bg-indigo-50/80 border-indigo-200 text-indigo-950'
                  }`}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5 font-bold">
                        <Sparkles className={`w-4 h-4 ${liveAi.isTopCritical ? 'text-red-600 animate-pulse' : 'text-indigo-600'}`} />
                        <span>AI Problem Criticality Assessment</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md font-mono font-bold text-[10px] uppercase ${
                          liveAi.isTopCritical ? 'bg-red-600 text-white shadow-xs' :
                          liveAi.priorityLevel === 'P2 High' ? 'bg-amber-600 text-white' :
                          'bg-indigo-600 text-white'
                        }`}>
                          {liveAi.priorityLevel}
                        </span>
                        <span className="font-mono font-black text-sm">
                          {liveAi.criticalityScore}%
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] leading-relaxed mb-2">
                      {liveAi.riskSummary}
                    </p>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] font-mono">
                      <span>Category: <strong>{liveAi.hazardType}</strong></span>
                      {liveAi.isTopCritical && (
                        <span className="text-red-700 font-bold bg-red-100 px-2 py-0.5 rounded border border-red-200">
                          ⭐ Will be placed at #1 on Chief Controller screen
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Notice */}
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-[11px] leading-relaxed">
                <p className="font-bold flex items-center gap-1 mb-0.5">
                  <span>ℹ️ Chief Controller Approval Gate</span>
                </p>
                <p>
                  Submitting this work order will send it to the <strong>Admin Dashboard</strong> as a proposed possession block. 
                  Once approved by the Chief Controller, it will appear in your <strong>Approved Plans</strong> list, where you can assign specific field staff and supervisors.
                </p>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Work Order for Admin Approval</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
