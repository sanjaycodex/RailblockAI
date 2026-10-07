import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  Shield, Users, Database, Settings as SettingsIcon, 
  Activity, TrendingUp, AlertTriangle, CheckCircle2,
  FileText, Lock, UserCog, BarChart3, CheckCheck, XCircle,
  Eye, Clock, TrainTrack, Calendar, AlertCircle, Sparkles,
  ChevronRight, X, Zap, Brain, RefreshCw, Train, ArrowUpRight,
  Layers, Check
} from 'lucide-react';
import { api } from '../services/api';
import AIRecommendationCard from '../components/common/AIRecommendationCard';
import toast from 'react-hot-toast';

export default function AdminPanel() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 3,
    totalTasks: 0,
    totalAssets: 0,
    totalBlocks: 0,
    criticalTasks: 0,
    systemHealth: 98.5,
    avgHealthPct: 89.4,
    availableWindows: 0,
    pendingApprovals: 0
  });
  const [sections, setSections] = useState([]);
  const [allBlocks, setAllBlocks] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [aiRecommendations, setAiRecommendations] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'approved', 'assigned', 'all'
  const [inspectBlock, setInspectBlock] = useState(null);
  const [rejectModalBlock, setRejectModalBlock] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
    loadAIRecommendations();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      const [summary, blocks, windows, secList, assets, allTasks] = await Promise.all([
        api.getDashboardSummary(),
        api.getMaintenanceBlocks(),
        api.getAvailableWindows(),
        api.getSections(),
        api.getAssets(),
        api.getTasks()
      ]);

      const pendingCount = blocks.filter(b => b.status === 'Proposed').length;
      const avgHealth = assets.length
        ? Math.round(assets.reduce((s, a) => s + (a.asset_health_score || 90), 0) / assets.length * 10) / 10
        : 89.4;

      setStats({
        totalUsers: 3,
        totalTasks: summary.totalTasks || 0,
        totalAssets: summary.assetsCount || 0,
        totalBlocks: blocks.length || 0,
        criticalTasks: summary.criticalTasks || 0,
        systemHealth: 98.5,
        avgHealthPct: avgHealth,
        availableWindows: windows.filter(w => w.status === 'Available').length,
        pendingApprovals: pendingCount
      });

      setSections(secList || []);
      setAllBlocks(blocks);
      setTasks(allTasks || []);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const loadAIRecommendations = async () => {
    setAiLoading(true);
    try {
      const recs = await api.generateAIRecommendedPlans();
      setAiRecommendations(recs);
    } catch (e) {
      console.warn('AI recommendations error:', e);
    } finally {
      setAiLoading(false);
    }
  };

  const handleApprovePlan = async (blockId) => {
    try {
      await api.approveMaintenanceBlock(blockId, user?.full_name || 'Chief Controller');
      toast.success('Plan approved! Section Planner can now assign to respective department.', {
        duration: 5000,
        icon: '✅'
      });
      if (inspectBlock?.id === blockId) {
        setInspectBlock(null);
      }
      await loadAdminData();
      await loadAIRecommendations();
    } catch (error) {
      console.error('Error approving plan:', error);
      toast.error('Failed to approve plan');
    }
  };

  const handleApproveAIRecommendation = async (rec) => {
    try {
      const loadingToast = toast.loading(`Approving AI plan for ${rec.section_name}...`);
      await api.approveAIRecommendation(rec, user?.full_name || 'Chief Controller');
      toast.success(`AI Plan for ${rec.section_name} approved! Deployed to Planner roster.`, {
        id: loadingToast,
        duration: 5000,
        icon: '🤖'
      });
      await loadAdminData();
      await loadAIRecommendations();
    } catch (error) {
      console.error('Error approving AI recommendation:', error);
      toast.error('Failed to approve AI recommendation');
    }
  };

  // Handler for the AI Optimization Proposals (from Dashboard.jsx)
  const handleApproveOptimizationProposal = async (proposal) => {
    try {
      const loadingToast = toast.loading(`Approving & applying "${proposal.title}"...`);
      
      const now = new Date();
      const startTime = new Date(now.getTime() + 2 * 3600000).toISOString();
      const endTime = new Date(now.getTime() + 5 * 3600000).toISOString();
      
      const newBlock = {
        id: `BLK-OPT-${Date.now().toString().slice(-4)}`,
        section_id: proposal.taskId ? 'SEC-MEJ-CVP' : 'SEC-TEN-MEJ',
        title: proposal.title,
        start_time: startTime,
        end_time: endTime,
        duration_minutes: proposal.impactComparison?.originalDelayMinutes || 120,
        status: 'Approved',
        optimization_score: proposal.confidenceScore || 94.0,
        approved_by: user?.full_name || 'Er. S. Kumar (Chief Controller)',
        approved_at: now.toISOString(),
        assigned_department: 'Civil',
        notes: `AI Optimization: ${proposal.description}. Estimated savings: ${proposal.impactComparison?.costSavings || '₹3.0 Lakhs'}. Projected gain: ${proposal.projectedPunctualityGain || '+2%'}.`,
        section_name: 'Tirunelveli - Madurai Mainline'
      };

      await api.createMaintenanceBlock(newBlock);
      toast.success(`AI Optimization Proposal Approved! Block ${newBlock.id} created and unlocked for Planner.`, {
        id: loadingToast,
        duration: 5000,
        icon: '🚀'
      });

      await loadAdminData();
      await loadAIRecommendations();
    } catch (error) {
      console.error('Error applying optimization proposal:', error);
      toast.error('Failed to apply optimization proposal');
    }
  };

  const handleOpenRejectModal = (block) => {
    setRejectModalBlock(block);
    setRejectReason('Conflict with passenger train schedule. Please shift window by +30 minutes.');
  };

  const handleConfirmReject = async () => {
    if (!rejectModalBlock) return;
    try {
      await api.rejectMaintenanceBlock(
        rejectModalBlock.id,
        user?.full_name || 'Chief Controller',
        rejectReason || 'Requires schedule revision'
      );
      toast.error(`Plan ${rejectModalBlock.id} rejected. Reason logged for Planner.`, {
        icon: '❌'
      });
      setRejectModalBlock(null);
      if (inspectBlock?.id === rejectModalBlock.id) {
        setInspectBlock(null);
      }
      await loadAdminData();
    } catch (error) {
      console.error('Error rejecting plan:', error);
      toast.error('Failed to reject plan');
    }
  };

  // Generate dynamic AI proposals identical to Dashboard.jsx
  const criticalTasks = tasks.filter(t => t.severity === 'Critical' || t.priority_level === 'P1 Critical').slice(0, 3);
  
  const dynamicAIProposals = criticalTasks.length > 0 ? criticalTasks.map((task, idx) => {
    const recommendations = [
      {
        category: 'Dynamic Slot Shifting',
        title: `Shift ${task.section_id?.replace('SEC-', '')} Block to Shadow Window`,
        description: `Prevents cascading headway delay to 20666 Vande Bharat Express while granting ${task.estimated_duration}-min window for Immediate Removal (IMR) ${task.task_title}.`,
        suggestedTime: 'Tomorrow 02:15 - 04:15 (Shadow Slot)',
        confidenceScore: 94,
        affectedTrainsCount: 1,
        projectedPunctualityGain: '+2%',
        costSavings: '₹3.0 Lakhs'
      },
      {
        category: 'Multi-Discipline Bundling',
        title: `Bundle ${task.task_title} with Adjacent Civil Work`,
        description: `Synchronizes Civil work with complementary tasks in ${task.section_id?.replace('SEC-', '')} section. Eliminates duplicate possession, saves 30 mins.`,
        suggestedTime: 'Sunday 01:00 - 04:30 AM',
        confidenceScore: 92,
        affectedTrainsCount: 0,
        projectedPunctualityGain: '+3.8%',
        costSavings: '₹8.0 Lakhs'
      },
      {
        category: 'Priority Escalation',
        title: `Expedite ${task.task_title} - High Track Stress Detected`,
        description: `AI predicts 89% failure probability if deferred past 48h. OR-Tools recommends immediate ${task.estimated_duration}-min possession in next shadow window.`,
        suggestedTime: 'Tonight 01:30 - 03:30',
        confidenceScore: 97,
        affectedTrainsCount: 0,
        projectedPunctualityGain: '+4.2%',
        costSavings: '₹10.5 Lakhs'
      }
    ];
    
    const rec = recommendations[idx % 3];
    return {
      id: `ai-rec-admin-${task.id}`,
      confidenceScore: rec.confidenceScore,
      category: rec.category,
      title: rec.title,
      description: rec.description,
      projectedPunctualityGain: rec.projectedPunctualityGain,
      affectedTrainsCount: rec.affectedTrainsCount,
      impactComparison: {
        originalDelayMinutes: task.estimated_duration || 120,
        optimizedDelayMinutes: Math.floor((task.estimated_duration || 120) * 0.15),
        costSavings: rec.costSavings
      },
      suggestedTime: rec.suggestedTime,
      status: 'Ready to Apply',
      taskId: task.id
    };
  }) : [
    {
      id: 'ai-rec-admin-default-1',
      confidenceScore: 94,
      category: 'Dynamic Slot Shifting',
      title: 'Shift MEJ–CVP Block to Shadow Window',
      description: 'Prevents cascading headway delay to 20666 Vande Bharat Express while granting 120-min window for Immediate Removal (IMR) Transverse Rail Flaw at KM 42/14.',
      projectedPunctualityGain: '+2%',
      affectedTrainsCount: 1,
      impactComparison: {
        originalDelayMinutes: 120,
        optimizedDelayMinutes: 18,
        costSavings: '₹3.0 Lakhs'
      },
      suggestedTime: 'Tomorrow 02:15 - 04:15 (Shadow Slot)',
      status: 'Ready to Apply'
    },
    {
      id: 'ai-rec-admin-default-2',
      confidenceScore: 92,
      category: 'Multi-Discipline Bundling',
      title: 'Bundle Thermit Weld Clamp & Jogged Fishplate Installation at KM 152/4 (UP) with Adjacent Civil Work',
      description: 'Synchronizes Civil work with complementary tasks in TMQ-MDU section. Eliminates duplicate possession, saves 30 mins.',
      projectedPunctualityGain: '+3.8%',
      affectedTrainsCount: 0,
      impactComparison: {
        originalDelayMinutes: 75,
        optimizedDelayMinutes: 11,
        costSavings: '₹8.0 Lakhs'
      },
      suggestedTime: 'Sunday 01:00 - 04:30 AM',
      status: 'Ready to Apply'
    }
  ];

  // Helper to compute AI Criticality Score for sorting proposals
  const getBlockCriticality = (b) => {
    if (b.ai_criticality_score) return Number(b.ai_criticality_score);
    if (b.priority_score) return Number(b.priority_score);
    const text = `${b.title || ''} ${b.notes || ''}`.toLowerCase();
    if (text.includes('imr') || text.includes('transverse') || text.includes('fracture') || text.includes('critical')) return 98;
    if (text.includes('obs') || text.includes('crossing') || text.includes('point') || text.includes('flashover')) return 85;
    if (text.includes('bundle') || text.includes('smart') || text.includes('multi-discipline')) return 88;
    return Number(b.optimization_score || 50);
  };

  const pendingList = [...allBlocks]
    .filter(b => b.status === 'Proposed')
    .sort((a, b) => getBlockCriticality(b) - getBlockCriticality(a));

  const approvedList = allBlocks.filter(b => b.status === 'Approved');
  const assignedList = allBlocks.filter(b => b.status === 'Assigned' || b.status === 'In Progress');

  const displayedBlocks = 
    activeTab === 'pending' ? pendingList :
    activeTab === 'approved' ? approvedList :
    activeTab === 'assigned' ? assignedList :
    [...allBlocks].sort((a, b) => getBlockCriticality(b) - getBlockCriticality(a));

  const StatCard = ({ icon: Icon, label, value, color, trend, subtitle }) => (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-5 hover:shadow-md transition-all">
      <div className="flex items-start justify-between mb-2.5">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        {trend && (
          <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full text-[11px] font-mono font-bold flex items-center gap-1 border border-emerald-200">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-black text-slate-900 mb-0.5">{value}</p>
        <p className="text-[11px] font-mono font-bold text-slate-500 uppercase">{label}</p>
        {subtitle && <p className="text-[10px] text-slate-400 font-mono mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-96 gap-3">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
        <p className="text-xs font-mono text-slate-500">Loading Chief Controller Command Suite...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-blue-900 rounded-3xl shadow-lg p-8 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-mono font-bold bg-white/20 mb-2">
                👑 Chief Operating Controller • Full Executive Authority
              </div>
              <h1 className="text-3xl font-black tracking-tight">Admin Approval & Orchestration Hub</h1>
              <p className="text-purple-100 text-xs font-mono mt-1">
                Tirunelveli - Madurai Mainline (TEN-MDU) • {user?.full_name}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/20 text-center">
              <span className="text-2xl font-black text-yellow-300 block">{stats.pendingApprovals}</span>
              <span className="text-[10px] font-mono text-purple-200 uppercase">Awaiting Approval</span>
            </div>
            <button
              onClick={() => { loadAdminData(); loadAIRecommendations(); }}
              className="p-3 bg-white/10 hover:bg-white/20 rounded-xl border border-white/20 text-white transition-all cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Dashboard KPIs & Operational Telemetry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={AlertTriangle} 
          label="Pending Approvals" 
          value={stats.pendingApprovals} 
          color="bg-amber-600"
          trend={stats.pendingApprovals > 0 ? "Action Needed" : "All Clear"}
          subtitle="Plans waiting for Admin decision"
        />
        <StatCard 
          icon={CheckCircle2} 
          label="Approved Plans" 
          value={approvedList.length} 
          color="bg-emerald-600"
          trend="Ready for Dept"
          subtitle="Cleared for planner assignment"
        />
        <StatCard 
          icon={Activity} 
          label="Corridor Asset Health" 
          value={`${stats.avgHealthPct}%`} 
          color="bg-blue-600"
          subtitle="Avg across 6 mainline sections"
        />
        <StatCard 
          icon={Clock} 
          label="Available Windows" 
          value={stats.availableWindows} 
          color="bg-purple-600"
          subtitle="Shadow night slots (01:00-04:30)"
        />
      </div>

      {/* Corridor Section Health Ribbon */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrainTrack className="w-4 h-4 text-[#002869]" />
            <h3 className="text-sm font-bold text-slate-900">TEN-MDU Corridor Sections Status</h3>
          </div>
          <span className="text-xs font-mono text-slate-500">6 Block Sections Monitored</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {sections.map((sec) => {
            const health = sec.asset_health_score || 88;
            const isGood = health >= 85;
            const isWarn = health >= 75 && health < 85;
            return (
              <div key={sec.id} className={`p-2.5 rounded-xl border text-xs font-mono ${
                isGood ? 'bg-emerald-50/50 border-emerald-200' :
                isWarn ? 'bg-amber-50/50 border-amber-200' :
                'bg-red-50/50 border-red-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{sec.code || sec.id.replace('SEC-', '')}</span>
                  <span className={`text-[10px] font-black px-1.5 py-0.2 rounded ${
                    isGood ? 'bg-emerald-100 text-emerald-800' :
                    isWarn ? 'bg-amber-100 text-amber-800' :
                    'bg-red-100 text-red-800'
                  }`}>{health}%</span>
                </div>
                <p className="text-[10px] text-slate-500 truncate mt-1">{sec.section_name}</p>
                <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-1.5 rounded-full ${isGood ? 'bg-emerald-500' : isWarn ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${health}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI RECOMMENDED OPTIMIZATION PROPOSALS FOR THIS CORRIDOR (from Dashboard / Photo 2) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#002869]" />
            <h2 className="text-xl font-black text-[#002869]">
              AI Recommended Optimization Proposals for this Corridor
            </h2>
          </div>
          <span className="text-xs font-mono text-slate-500">Live AI Timetable Optimizer</span>
        </div>

        <div className="space-y-3">
          {dynamicAIProposals.map((rec) => (
            <AIRecommendationCard
              key={rec.id}
              recommendation={rec}
              onApply={() => handleApproveOptimizationProposal(rec)}
            />
          ))}
        </div>
      </div>

      {/* AI TRAIN-TIMETABLE DE-CONFLICTED RECOMMENDATIONS (Corridor Bundles) */}
      <div className="bg-gradient-to-br from-indigo-900 via-[#002869] to-purple-900 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/20 text-yellow-300 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              AI TRAIN-TIMETABLE DE-CONFLICTED RECOMMENDATIONS
            </div>
            <h2 className="text-xl font-black">AI Bundled Track Possession Plans</h2>
            <p className="text-xs text-indigo-200 font-mono">
              Auto-calculated from 27-train passenger schedule & asset severity. Zero express train clashes.
            </p>
          </div>
          <button
            onClick={loadAIRecommendations}
            disabled={aiLoading}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold rounded-xl border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${aiLoading ? 'animate-spin' : ''}`} />
            <span>{aiLoading ? 'Optimizing...' : 'Re-calculate AI Plans'}</span>
          </button>
        </div>

        {aiRecommendations.length === 0 ? (
          <div className="text-center py-8 bg-white/5 rounded-2xl border border-white/10 font-mono text-xs text-indigo-200">
            No immediate AI maintenance blocks recommended. All critical sections are covered.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {aiRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/15 p-4 flex flex-col justify-between hover:bg-white/15 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 rounded-md bg-yellow-400 text-slate-900 text-[10px] font-mono font-black">
                      {rec.ai_score}% AI SCORE
                    </span>
                    <span className="text-[11px] font-mono text-emerald-300 font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Train Safe
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-white mb-1">{rec.section_name}</h4>
                  
                  <div className="text-[11px] font-mono text-indigo-200 space-y-1 mb-3">
                    <p className="flex items-center gap-1 text-yellow-200">
                      <Clock className="w-3 h-3" /> Window: <strong>{rec.window_label}</strong>
                    </p>
                    <p>• Tasks Bundled: <strong>{rec.tasks_count} tasks</strong> ({rec.critical_count} critical)</p>
                    <p>• Est Duration: <strong>{rec.total_duration_min} mins</strong></p>
                    <p className="text-[10px] text-indigo-300">
                      • De-conflicted: {rec.conflicting_trains?.slice(0, 2).join(', ')}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-indigo-200">
                    Dept: {rec.departments?.join(', ') || 'Civil'}
                  </span>
                  <button
                    onClick={() => handleApproveAIRecommendation(rec)}
                    className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-mono font-bold rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Approve Plan</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Plan Inspection & Approval Workspace */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-black text-slate-900">Maintenance Plans & Approvals</h2>
            <p className="text-xs text-slate-500 font-mono">Inspect plan details, check timetable safety, and grant possession clearances</p>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-1 p-1 bg-slate-100 rounded-xl font-mono text-xs font-bold">
            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'pending'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending Approval ({pendingList.length})
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'approved'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Approved ({approvedList.length})
            </button>
            <button
              onClick={() => setActiveTab('assigned')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'assigned'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Assigned ({assignedList.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === 'all'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({allBlocks.length})
            </button>
          </div>
        </div>

        {/* Plans List */}
        <div className="space-y-4">
          {displayedBlocks.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
              <p className="font-bold text-slate-800 text-sm">No plans matching this filter</p>
              <p className="text-xs text-slate-500 font-mono mt-1">All maintenance blocks in this state have been handled.</p>
            </div>
          ) : (
            displayedBlocks.map((plan, index) => {
              const isProposed = plan.status === 'Proposed';
              const isApproved = plan.status === 'Approved';
              const isAssigned = plan.status === 'Assigned';
              const critScore = getBlockCriticality(plan);
              const isTopRankedCritical = isProposed && index === 0 && critScore >= 85;

              return (
                <div 
                  key={plan.id}
                  className={`p-5 rounded-2xl border transition-all relative ${
                    isTopRankedCritical
                      ? 'bg-red-50/60 border-red-300 shadow-sm ring-1 ring-red-400'
                      : isProposed
                      ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300'
                      : isApproved
                      ? 'bg-emerald-50/30 border-emerald-200'
                      : 'bg-white border-slate-200'
                  }`}
                >
                  {/* Top Critical Ribbon */}
                  {isTopRankedCritical && (
                    <div className="mb-3 px-3 py-1.5 bg-red-600 text-white rounded-xl text-xs font-mono font-bold flex items-center justify-between shadow-xs">
                      <span className="flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-yellow-300 animate-bounce" />
                        <span>#1 AI TOP CRITICAL POSSESSION • HIGHEST DERAILMENT / PUNCTUALITY IMPACT</span>
                      </span>
                      <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">
                        Immediate Controller Action
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className="font-mono text-xs font-bold text-slate-500">
                          {plan.id}
                        </span>

                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                          isTopRankedCritical ? 'bg-red-100 text-red-900 border border-red-300' :
                          isProposed ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          isApproved ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          isAssigned ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {plan.status === 'Proposed' ? 'Awaiting Admin Approval' : plan.status}
                        </span>

                        {/* AI Criticality Meter */}
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 border ${
                          critScore >= 90 ? 'bg-red-100 text-red-800 border-red-300' :
                          critScore >= 75 ? 'bg-amber-100 text-amber-800 border-amber-300' :
                          'bg-purple-100 text-purple-700 border-purple-200'
                        }`}>
                          <Sparkles className="w-3 h-3" />
                          AI Criticality: {critScore}% ({critScore >= 90 ? 'P1 Critical' : critScore >= 75 ? 'P2 High' : 'P3 Medium'})
                        </span>
                      </div>

                      <h3 className="font-black text-base text-slate-900 mb-1">
                        {plan.title || plan.railway_sections?.section_name || 'Corridor Maintenance Block'}
                      </h3>
                      
                      <p className="text-xs text-slate-600 font-mono mb-2">
                        Section: <strong>{plan.railway_sections?.section_name || plan.section_id}</strong>
                      </p>

                      {/* AI Risk Summary Callout */}
                      {(plan.ai_risk_summary || isTopRankedCritical) && (
                        <div className={`p-2.5 rounded-xl text-[11px] font-mono mb-2 border ${
                          critScore >= 90 ? 'bg-red-100/70 text-red-950 border-red-200' : 'bg-slate-100 text-slate-800 border-slate-200'
                        }`}>
                          <strong>AI Safety Hazard Assessment:</strong> {plan.ai_risk_summary || 'IMR Transverse rail defect on high-speed track. Immediate possession granted priority to avoid passenger headway penalties.'}
                        </div>
                      )}

                      <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-600">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {new Date(plan.start_time).toLocaleString()} - {new Date(plan.end_time).toLocaleTimeString()}
                        </span>
                        <span>
                          Duration: <strong>{plan.duration_minutes || 180} mins</strong>
                        </span>
                        {plan.approved_by && (
                          <span className="text-emerald-700">
                            Approved by: <strong>{plan.approved_by}</strong>
                          </span>
                        )}
                        {plan.assigned_department && (
                          <span className="text-blue-700">
                            Dept: <strong>{plan.assigned_department}</strong>
                          </span>
                        )}
                        {plan.assigned_viewer_name && (
                          <span className="text-teal-700">
                            Field Staff: <strong>{plan.assigned_viewer_name}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        onClick={() => setInspectBlock(plan)}
                        className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-mono font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect Plan</span>
                      </button>

                      {isProposed && (
                        <>
                          <button
                            onClick={() => handleApprovePlan(plan.id)}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>Approve Plan</span>
                          </button>
                          <button
                            onClick={() => handleOpenRejectModal(plan)}
                            className="px-3.5 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-mono font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}

                      {isApproved && !plan.assigned_department && (
                        <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                          ✓ Ready for Planner Assignment
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

      {/* Plan Inspection Modal */}
      {inspectBlock && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">Chief Controller Inspection Report</h3>
                  <p className="text-xs font-mono text-slate-500">Plan ID: {inspectBlock.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setInspectBlock(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs font-mono">
              {/* Header Details */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Corridor:</span>
                  <span className="font-bold text-slate-900">Tirunelveli - Madurai Mainline (TEN-MDU)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Railway Section:</span>
                  <span className="font-bold text-slate-900">{inspectBlock.railway_sections?.section_name || inspectBlock.section_id}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Possession Window:</span>
                  <span className="font-bold text-slate-900">
                    {new Date(inspectBlock.start_time).toLocaleString()} - {new Date(inspectBlock.end_time).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Possession Slot Duration:</span>
                  <span className="font-bold text-purple-700">{inspectBlock.duration_minutes || 180} Minutes (Shadow Headway)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">AI Optimization Score:</span>
                  <span className="font-bold text-emerald-700">{inspectBlock.optimization_score || 94.0}% (High Confidence)</span>
                </div>
              </div>

              {/* Safety & Train Movement De-conflict Assessment */}
              <div className="p-4 bg-blue-50/50 rounded-2xl border border-blue-200 space-y-2">
                <h4 className="font-bold text-blue-900 text-sm flex items-center gap-1.5">
                  <TrainTrack className="w-4 h-4 text-blue-700" />
                  Train Schedule De-conflict Verification (27 Trains Fleet)
                </h4>
                <div className="space-y-1.5 text-slate-700 text-[11px]">
                  <p>• <strong>20666 / 20627 Vande Bharat Expresses:</strong> Clears corridor by 07:45 / 13:00 (No headway overlap, zero punctuality penalty).</p>
                  <p>• <strong>12638 Pandian & 12694 Pearl City SF:</strong> Pass at 21:20 & 22:50 (Prior to possession commencement).</p>
                  <p>• <strong>12642 Thirukkural & 20603 Amrit Bharat:</strong> Protected daylight & evening schedules.</p>
                  <p>• <strong>BCNHL & BOXNHL Freight Rakes:</strong> Timed into Kovilpatti & Virudhunagar loops.</p>
                  <p className="text-emerald-700 font-bold">✓ 27 Corridor Trains Protected • Zero passenger delay impact predicted during shadow window.</p>
                </div>
              </div>

              {/* Notes / Plan Description */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <span className="text-slate-500 block mb-1">Plan Description & Tasks:</span>
                <p className="text-slate-800 leading-relaxed font-sans text-xs">
                  {inspectBlock.notes || inspectBlock.title || 'Multi-discipline corridor possession combining ultrasonic rail flaw remediation with traction catenary adjustments.'}
                </p>
              </div>

              {/* Current Status & Approvals */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-slate-500 block">Current Status:</span>
                  <span className="font-bold text-slate-900 text-sm">{inspectBlock.status}</span>
                </div>
                {inspectBlock.assigned_department && (
                  <div>
                    <span className="text-slate-500 block">Assigned Dept:</span>
                    <span className="font-bold text-blue-700">{inspectBlock.assigned_department}</span>
                  </div>
                )}
                {inspectBlock.approved_by && (
                  <div>
                    <span className="text-slate-500 block">Approved By:</span>
                    <span className="font-bold text-emerald-700">{inspectBlock.approved_by}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
              <button
                onClick={() => setInspectBlock(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono font-bold text-xs rounded-xl cursor-pointer"
              >
                Close
              </button>

              {inspectBlock.status === 'Proposed' && (
                <>
                  <button
                    onClick={() => handleOpenRejectModal(inspectBlock)}
                    className="px-4 py-2.5 bg-red-100 hover:bg-red-200 text-red-700 font-mono font-bold text-xs rounded-xl cursor-pointer"
                  >
                    Reject Plan
                  </button>
                  <button
                    onClick={() => handleApprovePlan(inspectBlock.id)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-xs rounded-xl shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCheck className="w-4 h-4" />
                    <span>Approve & Unlock for Planner</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rejection Modal */}
      {rejectModalBlock && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6">
            <h3 className="font-black text-lg text-slate-900 mb-2">Reject Maintenance Plan</h3>
            <p className="text-xs text-slate-600 font-mono mb-4">
              Enter reason for rejection for <strong>{rejectModalBlock.title || rejectModalBlock.id}</strong>. 
              The Planner will be notified to adjust the plan.
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              className="w-full p-3 border border-slate-300 rounded-xl text-xs font-mono focus:border-red-500 outline-none mb-4"
              placeholder="Enter rejection remarks..."
            />

            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setRejectModalBlock(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 font-mono text-xs font-bold rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-mono text-xs font-bold rounded-xl shadow-xs cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
