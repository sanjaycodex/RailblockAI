import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  AlertTriangle,
  ShieldCheck,
  Cpu,
  Search,
  Activity,
  Sparkles,
  Filter,
  ChevronRight,
  Wrench,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  RefreshCw,
  Layers
} from 'lucide-react';
import MetricCard from '../components/common/MetricCard';
import StatusBadge from '../components/common/StatusBadge';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { api } from '../services/api';

export default function MaintenanceIntelligence() {
  const [tasks, setTasks] = useState([]);
  const [sections, setSections] = useState([]);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [sectionFilter, setSectionFilter] = useState('ALL');
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Modals
  const [selectedTask, setSelectedTask] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    task_title: '',
    department: 'Civil',
    section_id: '',
    asset_id: '',
    severity: 'High',
    urgency: 'Planned',
    estimated_duration: 120,
    deadline: '2026-08-30T12:00:00Z',
    status: 'Pending',
    priority_level: 'High',
    failure_risk: 75,
    operational_impact: 70
  });

  const [formErrors, setFormErrors] = useState({});

  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedTasks, fetchedSections, fetchedAssets] = await Promise.all([
        api.getTasks(),
        api.getSections(),
        api.getAssets()
      ]);
      setTasks(fetchedTasks);
      setSections(fetchedSections);
      setAssets(fetchedAssets);
      if (fetchedSections.length > 0 && !formData.section_id) {
        setFormData((prev) => ({
          ...prev,
          section_id: fetchedSections[0].id,
          asset_id: fetchedAssets[0]?.id || ''
        }));
      }
    } catch (err) {
      console.error('Error loading maintenance data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (deptFilter !== 'ALL' && t.department !== deptFilter) return false;
    if (sectionFilter !== 'ALL' && t.section_id !== sectionFilter) return false;
    if (severityFilter !== 'ALL' && t.severity !== severityFilter) return false;
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    return true;
  });

  // Validation
  const validateForm = () => {
    const errors = {};
    if (!formData.task_title.trim()) errors.task_title = 'Task title is required.';
    if (!formData.section_id) errors.section_id = 'Railway section is required.';
    if (!formData.asset_id) errors.asset_id = 'Asset is required.';
    if (!formData.estimated_duration || formData.estimated_duration <= 0) {
      errors.estimated_duration = 'Duration must be greater than 0 mins.';
    }
    if (!formData.deadline) errors.deadline = 'Deadline timestamp is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const created = await api.createTask({
        ...formData,
        estimated_duration: Number(formData.estimated_duration),
        priority_score: formData.severity === 'Critical' ? 95 : formData.severity === 'High' ? 85 : 65
      });
      setTasks((prev) => [created, ...prev]);
      setIsAddModalOpen(false);
      resetForm();
    } catch (err) {
      alert('Failed to create task: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    if (!validateForm() || !taskToEdit) return;

    setIsSubmitting(true);
    try {
      const updated = await api.updateTask(taskToEdit.id, {
        ...formData,
        estimated_duration: Number(formData.estimated_duration)
      });
      setTasks((prev) => prev.map((t) => (t.id === taskToEdit.id ? updated : t)));
      setIsEditModalOpen(false);
      setTaskToEdit(null);
      resetForm();
    } catch (err) {
      alert('Failed to update task: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickStatusChange = async (taskId, newStatus) => {
    try {
      const updated = await api.updateTask(taskId, { status: newStatus });
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updated : t)));
      if (selectedTask?.id === taskId) {
        setSelectedTask(updated);
      }
    } catch (err) {
      alert('Error updating status: ' + err.message);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    try {
      await api.deleteTask(taskToDelete.id);
      setTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id));
      setTaskToDelete(null);
    } catch (err) {
      alert('Failed to delete task: ' + err.message);
    }
  };

  const openEditModal = (task) => {
    setTaskToEdit(task);
    setFormData({
      task_title: task.task_title || '',
      department: task.department || 'Civil',
      section_id: task.section_id || '',
      asset_id: task.asset_id || '',
      severity: task.severity || 'Medium',
      urgency: task.urgency || 'Planned',
      estimated_duration: task.estimated_duration || 120,
      deadline: task.deadline ? task.deadline.substring(0, 16) : '2026-08-30T12:00',
      status: task.status || 'Pending',
      priority_level: task.priority_level || 'Medium',
      failure_risk: task.failure_risk || 75,
      operational_impact: task.operational_impact || 70
    });
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      task_title: '',
      department: 'Civil',
      section_id: sections[0]?.id || '',
      asset_id: assets[0]?.id || '',
      severity: 'High',
      urgency: 'Planned',
      estimated_duration: 120,
      deadline: '2026-08-30T12:00:00Z',
      status: 'Pending',
      priority_level: 'High',
      failure_risk: 75,
      operational_impact: 70
    });
    setFormErrors({});
  };

  // Section Asset Filter helper
  const availableAssetsForSection = assets.filter(
    (a) => (!formData.section_id || a.section_id === formData.section_id) && (!formData.department || a.department === formData.department)
  );

  const columns = [
    {
      header: 'Task ID & Work Details',
      key: 'task_title',
      render: (val, row) => (
        <div>
          <span className="font-mono font-bold text-[#002869] text-xs block">{row.id}</span>
          <span className="font-semibold text-slate-800 text-xs">{val}</span>
          <span className="text-[11px] font-mono text-slate-500 block mt-0.5">
            Asset: {row.asset_id} • {row.section_id?.replace('SEC-', '')}
          </span>
        </div>
      )
    },
    {
      header: 'Discipline',
      key: 'department',
      render: (val) => (
        <span className="font-mono text-xs font-semibold text-[#005db7]">{val}</span>
      )
    },
    {
      header: 'Severity',
      key: 'severity',
      sortable: true,
      render: (val) => (
        <span
          className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
            val === 'Critical'
              ? 'bg-red-100 text-[#ba1a1a]'
              : val === 'High'
              ? 'bg-amber-100 text-amber-800'
              : 'bg-blue-50 text-[#005db7]'
          }`}
        >
          {val}
        </span>
      )
    },
    {
      header: 'Est. Duration',
      key: 'estimated_duration',
      sortable: true,
      render: (val) => (
        <span className="font-mono font-semibold text-xs text-slate-800">{val} mins</span>
      )
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => <StatusBadge status={val} size="sm" />
    },
    {
      header: 'Actions',
      key: 'actions',
      render: (_, row) => (
        <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => openEditModal(row)}
            className="p-1 text-slate-500 hover:text-[#002869] hover:bg-slate-100 rounded transition-colors"
            title="Edit Task"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setTaskToDelete(row)}
            className="p-1 text-slate-500 hover:text-[#ba1a1a] hover:bg-red-50 rounded transition-colors"
            title="Delete Task"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#dae2ff] text-[#001947]">
              SUPABASE CONNECTED BACKEND
            </span>
            <span className="text-xs font-mono text-slate-500">• Tirunelveli - Madurai (TEN-MDU)</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#002869] tracking-tight">
            Maintenance Intelligence & Task Management
          </h1>
          <p className="text-xs text-[#434652] mt-1 max-w-2xl">
            Live database management of track defect rectifications, USFD flaw interventions, OHE insulator renewals, and signaling point overhauls.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2.5 bg-[#002869] hover:bg-[#0b3d91] text-white text-xs font-mono font-bold rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Maintenance Task
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Registered Tasks"
          value={tasks.length}
          unit="Tasks"
          delta={`${tasks.filter((t) => t.status === 'Pending').length} Pending`}
          subtitle="Tirunelveli - Madurai"
          icon="activity"
          iconBg="bg-blue-50 text-[#005db7]"
        />
        <MetricCard
          title="Safety Critical (IMR / P1)"
          value={tasks.filter((t) => t.severity === 'Critical' || t.priority_level === 'P1 Critical').length}
          unit="Immediate"
          delta="Immediate Action"
          deltaType="negative"
          subtitle="Track fracture & switch risk"
          icon="warning"
          iconBg="bg-red-50 text-[#ba1a1a]"
        />
        <MetricCard
          title="AI-Optimized Possessions"
          value={tasks.filter((t) => t.status === 'AI-Optimized' || t.status === 'Approved').length}
          unit="Ready"
          delta="100% De-conflicted"
          subtitle="Zero passenger clashes"
          icon="sparkles"
          iconBg="bg-emerald-50 text-[#00a859]"
        />
        <MetricCard
          title="Avg Task Duration"
          value={tasks.length > 0 ? (tasks.reduce((sum, t) => sum + (t.estimated_duration || 0), 0) / tasks.length).toFixed(0) : 0}
          unit="Mins"
          delta="Standard Window"
          subtitle="Machine possession slot"
          icon="clock"
          iconBg="bg-indigo-50 text-[#002869]"
        />
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-mono text-[#747783] mr-2">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        {/* Department Filter */}
        <select
          value={deptFilter}
          onChange={(e) => setDeptFilter(e.target.value)}
          className="text-xs font-mono bg-[#f4f3fb] border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none"
        >
          <option value="ALL">All Departments</option>
          <option value="Civil">Civil Engineering</option>
          <option value="Signal & Telecom">Signal & Telecom</option>
          <option value="Electrical">Electrical (TRD)</option>
        </select>

        {/* Section Filter */}
        <select
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
          className="text-xs font-mono bg-[#f4f3fb] border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none"
        >
          <option value="ALL">All Corridor Sections</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.section_name}
            </option>
          ))}
        </select>

        {/* Severity Filter */}
        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          className="text-xs font-mono bg-[#f4f3fb] border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none"
        >
          <option value="ALL">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs font-mono bg-[#f4f3fb] border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none"
        >
          <option value="ALL">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="AI-Optimized">AI-Optimized</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>

        {(deptFilter !== 'ALL' || sectionFilter !== 'ALL' || severityFilter !== 'ALL' || statusFilter !== 'ALL') && (
          <button
            onClick={() => {
              setDeptFilter('ALL');
              setSectionFilter('ALL');
              setSeverityFilter('ALL');
              setStatusFilter('ALL');
            }}
            className="text-xs font-mono text-[#ba1a1a] hover:underline ml-auto cursor-pointer"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Tasks Table */}
      <DataTable
        columns={columns}
        data={filteredTasks}
        title="Active Maintenance Tasks Queue (Live Supabase Query)"
        onRowClick={(row) => setSelectedTask(row)}
        searchPlaceholder="Search task title, asset ID, or section..."
      />

      {/* Task Details Modal */}
      {selectedTask && (
        <Modal
          isOpen={Boolean(selectedTask)}
          onClose={() => setSelectedTask(null)}
          title={`Task Specification: ${selectedTask.id}`}
          subtitle={`${selectedTask.department} • ${selectedTask.section_id}`}
          maxWidth="max-w-xl"
          footer={
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleQuickStatusChange(selectedTask.id, 'Approved')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleQuickStatusChange(selectedTask.id, 'AI-Optimized')}
                  className="px-3 py-1.5 bg-[#005db7] hover:bg-blue-700 text-white text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer"
                >
                  AI-Optimize
                </button>
                <button
                  onClick={() => handleQuickStatusChange(selectedTask.id, 'Completed')}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-800 text-white text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Complete
                </button>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-mono font-bold rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-[#faf8ff] border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-[#002869] mb-1">{selectedTask.task_title}</h4>
                <p className="text-[#747783] font-mono">Source System: {selectedTask.source_system}</p>
              </div>
              <StatusBadge status={selectedTask.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#747783] block">Target Asset ID</span>
                <span className="font-semibold text-slate-800">{selectedTask.asset_id}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#747783] block">Railway Section</span>
                <span className="font-semibold text-slate-800">{selectedTask.section_id}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#747783] block">Severity & Urgency</span>
                <span className="font-semibold text-red-700">{selectedTask.severity} ({selectedTask.urgency})</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#747783] block">Estimated Duration</span>
                <span className="font-semibold text-slate-800">{selectedTask.estimated_duration} Minutes</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#747783] block">Failure Risk Score</span>
                <span className="font-mono font-bold text-amber-700">{selectedTask.failure_risk || 75}/100</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#747783] block">Operational Impact</span>
                <span className="font-mono font-bold text-[#005db7]">{selectedTask.operational_impact || 70}/100</span>
              </div>
            </div>

            <div className="p-3 bg-[#e9edff]/50 border border-[#dae2ff] rounded-xl flex items-start gap-2 text-[11px] text-[#001947]">
              <Sparkles className="w-4 h-4 text-[#005db7] flex-shrink-0 mt-0.5" />
              <span>
                AI Suggestion: This task can be bundled with available night shadow blocks on the Tirunelveli-Madurai line between 01:30 and 04:30 AM without causing headway clashes with 20666 Vande Bharat Express.
              </span>
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Task Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <Modal
          isOpen={isAddModalOpen || isEditModalOpen}
          onClose={() => {
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
            setTaskToEdit(null);
          }}
          title={isEditModalOpen ? `Edit Maintenance Task: ${taskToEdit?.id}` : 'Register New Maintenance Task'}
          subtitle="Add engineering or telemetry defect requirement to Supabase queue"
          maxWidth="max-w-lg"
          footer={
            <>
              <button
                type="button"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="px-4 py-2 text-xs font-mono font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={isEditModalOpen ? handleUpdateTask : handleCreateTask}
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#002869] hover:bg-[#0b3d91] text-white text-xs font-mono font-bold rounded-lg shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : isEditModalOpen ? 'Update Task' : 'Create Task'}
              </button>
            </>
          }
        >
          <form className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-[#002869] mb-1 font-mono uppercase">
                Task Title / Defect Description *
              </label>
              <input
                type="text"
                value={formData.task_title}
                onChange={(e) => setFormData({ ...formData, task_title: e.target.value })}
                placeholder="e.g. Ultrasonic Rail Flaw Rectification at KM 42/14"
                className={`w-full px-3 py-2 bg-[#f4f3fb] border rounded-xl focus:bg-white outline-none ${
                  formErrors.task_title ? 'border-red-400' : 'border-slate-200'
                }`}
              />
              {formErrors.task_title && (
                <span className="text-[11px] text-red-600 mt-1 block">{formErrors.task_title}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#002869] mb-1 font-mono uppercase">
                  Discipline Department *
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f4f3fb] border border-slate-200 rounded-xl focus:bg-white outline-none"
                >
                  <option value="Civil">Civil (P-Way & Track)</option>
                  <option value="Signal & Telecom">Signal & Telecom</option>
                  <option value="Electrical">Electrical (TRD / OHE)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#002869] mb-1 font-mono uppercase">
                  Railway Section *
                </label>
                <select
                  value={formData.section_id}
                  onChange={(e) => setFormData({ ...formData, section_id: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f4f3fb] border border-slate-200 rounded-xl focus:bg-white outline-none"
                >
                  {sections.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.section_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-[#002869] mb-1 font-mono uppercase">
                Target Asset *
              </label>
              <select
                value={formData.asset_id}
                onChange={(e) => setFormData({ ...formData, asset_id: e.target.value })}
                className="w-full px-3 py-2 bg-[#f4f3fb] border border-slate-200 rounded-xl focus:bg-white outline-none"
              >
                {availableAssetsForSection.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.id} - {a.asset_name} ({a.asset_type})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#002869] mb-1 font-mono uppercase">
                  Severity *
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f4f3fb] border border-slate-200 rounded-xl focus:bg-white outline-none"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#002869] mb-1 font-mono uppercase">
                  Estimated Duration (Mins) *
                </label>
                <input
                  type="number"
                  value={formData.estimated_duration}
                  onChange={(e) => setFormData({ ...formData, estimated_duration: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f4f3fb] border border-slate-200 rounded-xl focus:bg-white outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-[#002869] mb-1 font-mono uppercase">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f4f3fb] border border-slate-200 rounded-xl focus:bg-white outline-none"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="AI-Optimized">AI-Optimized</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#002869] mb-1 font-mono uppercase">
                  Deadline Date *
                </label>
                <input
                  type="datetime-local"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-3 py-2 bg-[#f4f3fb] border border-slate-200 rounded-xl focus:bg-white outline-none"
                />
              </div>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(taskToDelete)}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Maintenance Task"
        message={`Are you sure you want to remove ${taskToDelete?.id} ("${taskToDelete?.task_title}") from the database queue?`}
        confirmText="Delete Task"
        type="danger"
      />
    </div>
  );
}
