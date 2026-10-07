import React, { useState, useEffect } from 'react';
import { Activity, ShieldCheck, AlertTriangle, Layers, Filter, CheckCircle2, RefreshCw, ChevronRight } from 'lucide-react';
import MetricCard from '../components/common/MetricCard';
import StatusBadge from '../components/common/StatusBadge';
import DataTable from '../components/common/DataTable';
import Modal from '../components/common/Modal';
import { api } from '../services/api';

export default function AssetHealth() {
  const [assets, setAssets] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterDept, setFilterDept] = useState('ALL');
  const [filterSection, setFilterSection] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedAsset, setSelectedAsset] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedAssets, fetchedTasks, fetchedSections] = await Promise.all([
        api.getAssets(),
        api.getTasks(),
        api.getSections()
      ]);
      setAssets(fetchedAssets);
      setTasks(fetchedTasks);
      setSections(fetchedSections);
    } catch (e) {
      console.error('Error loading assets:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const enrichedAssets = assets.map((a) => {
    const assetTasks = tasks.filter((t) => t.asset_id === a.id);
    return {
      ...a,
      activeTasksCount: assetTasks.length,
      criticalTasksCount: assetTasks.filter((t) => t.severity === 'Critical').length,
      tasks: assetTasks
    };
  });

  const filteredAssets = enrichedAssets.filter((a) => {
    if (filterDept !== 'ALL' && a.department !== filterDept) return false;
    if (filterSection !== 'ALL' && a.section_id !== filterSection) return false;
    if (filterStatus !== 'ALL' && a.status !== filterStatus) return false;
    return true;
  });

  const avgHealth = assets.length > 0
    ? (assets.reduce((sum, a) => sum + Number(a.asset_health_score || 90), 0) / assets.length).toFixed(1)
    : '92.4';

  const columns = [
    {
      header: 'Asset Code & Name',
      key: 'asset_name',
      render: (val, row) => (
        <div>
          <span className="font-mono font-bold text-[#002869] text-xs block">{row.id}</span>
          <span className="text-xs font-semibold text-slate-800">{val}</span>
          <span className="text-[11px] font-mono text-slate-500 block mt-0.5">{row.asset_type}</span>
        </div>
      )
    },
    {
      header: 'Discipline',
      key: 'department',
      render: (val) => (
        <span className="font-mono text-xs text-[#005db7] font-semibold">{val}</span>
      )
    },
    {
      header: 'Railway Section',
      key: 'section_id',
      render: (val) => (
        <span className="font-medium text-xs text-slate-700 font-mono">
          {val.replace('SEC-', '')}
        </span>
      )
    },
    {
      header: 'Health Score',
      key: 'asset_health_score',
      sortable: true,
      render: (val) => {
        const score = Number(val);
        return (
          <div className="flex items-center gap-2">
            <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full ${
                  score > 90 ? 'bg-[#00a859]' : score > 80 ? 'bg-amber-500' : 'bg-[#ba1a1a]'
                }`}
                style={{ width: `${score}%` }}
              />
            </div>
            <span className="font-mono font-bold text-xs">{score}%</span>
          </div>
        );
      }
    },
    {
      header: 'Criticality',
      key: 'criticality',
      render: (val) => (
        <span
          className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
            val === 'Critical'
              ? 'bg-red-50 text-[#ba1a1a]'
              : val === 'High'
              ? 'bg-amber-50 text-amber-800'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          {val}
        </span>
      )
    },
    {
      header: 'Active Tasks',
      key: 'activeTasksCount',
      sortable: true,
      render: (val, row) => (
        <span
          className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
            val > 0 ? 'bg-[#dae2ff] text-[#001947]' : 'bg-slate-100 text-slate-500'
          }`}
        >
          {val} Tasks {row.criticalTasksCount > 0 && `(${row.criticalTasksCount} IMR)`}
        </span>
      )
    },
    {
      header: 'Condition Status',
      key: 'status',
      render: (val) => <StatusBadge status={val} size="sm" />
    }
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-[#dae2ff] text-[#001947]">
              INFRASTRUCTURE ASSET TELEMETRY
            </span>
            <span className="text-xs font-mono text-slate-500">• 157.1 KM Corridor Monitored</span>
          </div>
          <h1 className="text-2xl font-extrabold text-[#002869] tracking-tight">
            Asset Health & Condition Monitoring
          </h1>
          <p className="text-xs text-[#434652] mt-1 max-w-2xl">
            Live database registry for 60kg rails, pre-stressed sleepers, 25kV traction masts, Electronic Interlocking cabins, and point machines on the Tirunelveli-Madurai trunk line.
          </p>
        </div>

        <button
          onClick={loadData}
          className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Average Asset Health Index"
          value={`${avgHealth}%`}
          delta="+1.8%"
          subtitle="Tirunelveli - Madurai"
          icon="activity"
          iconBg="bg-blue-50 text-[#005db7]"
        />
        <MetricCard
          title="Degraded Asset Nodes"
          value={assets.filter((a) => a.status === 'Degraded' || a.status === 'Caution').length}
          unit="Assets"
          delta="Immediate Attention"
          deltaType="negative"
          subtitle="Priority for block allocation"
          icon="warning"
          iconBg="bg-amber-50 text-[#d97706]"
        />
        <MetricCard
          title="Total Monitored Assets"
          value={assets.length}
          unit="Assets"
          delta="100% Online"
          subtitle="Civil + Electrical + S&T"
          icon="shield_check"
          iconBg="bg-emerald-50 text-[#00a859]"
        />
        <MetricCard
          title="Assets with Active Tasks"
          value={enrichedAssets.filter((a) => a.activeTasksCount > 0).length}
          delta={`${tasks.length} Total Tasks`}
          subtitle="Scheduled in queue"
          icon="layers"
          iconBg="bg-indigo-50 text-[#002869]"
        />
      </div>

      {/* Filters Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-mono text-[#747783] mr-2">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        <select
          value={filterDept}
          onChange={(e) => setFilterDept(e.target.value)}
          className="text-xs font-mono bg-[#f4f3fb] border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none"
        >
          <option value="ALL">All Disciplines</option>
          <option value="Civil">Civil (P-Way & Track)</option>
          <option value="Signal & Telecom">Signal & Telecom</option>
          <option value="Electrical">Electrical (TRD)</option>
        </select>

        <select
          value={filterSection}
          onChange={(e) => setFilterSection(e.target.value)}
          className="text-xs font-mono bg-[#f4f3fb] border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none"
        >
          <option value="ALL">All Sections</option>
          {sections.map((s) => (
            <option key={s.id} value={s.id}>
              {s.section_name}
            </option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="text-xs font-mono bg-[#f4f3fb] border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 outline-none"
        >
          <option value="ALL">All Condition Statuses</option>
          <option value="Normal">Normal</option>
          <option value="Caution">Caution</option>
          <option value="Degraded">Degraded</option>
        </select>

        {(filterDept !== 'ALL' || filterSection !== 'ALL' || filterStatus !== 'ALL') && (
          <button
            onClick={() => {
              setFilterDept('ALL');
              setFilterSection('ALL');
              setFilterStatus('ALL');
            }}
            className="text-xs font-mono text-[#ba1a1a] hover:underline ml-auto cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Asset Table */}
      <DataTable
        columns={columns}
        data={filteredAssets}
        title="Infrastructure Asset Health Register (Live Database Query)"
        onRowClick={(row) => setSelectedAsset(row)}
        searchPlaceholder="Search asset name, type, or code..."
      />

      {/* Asset Detail Modal */}
      {selectedAsset && (
        <Modal
          isOpen={Boolean(selectedAsset)}
          onClose={() => setSelectedAsset(null)}
          title={`Asset Inspection Dossier: ${selectedAsset.id}`}
          subtitle={`${selectedAsset.asset_name} • ${selectedAsset.department}`}
          maxWidth="max-w-xl"
          footer={
            <button
              onClick={() => setSelectedAsset(null)}
              className="px-4 py-1.5 bg-[#002869] text-white text-xs font-mono font-bold rounded-lg"
            >
              Close Dossier
            </button>
          }
        >
          <div className="space-y-4 text-xs">
            <div className="p-3.5 bg-[#faf8ff] border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-[#002869]">{selectedAsset.asset_name}</h4>
                <p className="text-[#747783] font-mono">{selectedAsset.asset_type}</p>
              </div>
              <StatusBadge status={selectedAsset.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#747783] block">Health Index</span>
                <span className="text-base font-mono font-bold text-[#002869]">{selectedAsset.asset_health_score}%</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#747783] block">Criticality Tier</span>
                <span className="text-sm font-semibold text-slate-800">{selectedAsset.criticality}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#747783] block">Section</span>
                <span className="font-semibold text-slate-800">{selectedAsset.section_id}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#747783] block">Department</span>
                <span className="font-semibold text-[#005db7]">{selectedAsset.department}</span>
              </div>
            </div>

            {/* Active Tasks on this asset */}
            <div>
              <span className="font-mono font-bold text-xs text-[#002869] block mb-2">
                Active Maintenance Tasks on this Asset ({selectedAsset.tasks.length})
              </span>
              {selectedAsset.tasks.length === 0 ? (
                <p className="p-3 text-center text-slate-400 bg-slate-50 rounded-xl">
                  No active defect tasks recorded for this asset.
                </p>
              ) : (
                <div className="space-y-2">
                  {selectedAsset.tasks.map((t) => (
                    <div key={t.id} className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between">
                      <div>
                        <span className="font-mono font-bold text-[#002869] block text-[11px]">{t.id}</span>
                        <span className="text-slate-800 font-medium">{t.task_title}</span>
                      </div>
                      <StatusBadge status={t.status} size="sm" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
