import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  BrainCircuit,
  Activity,
  Zap,
  Layers,
  Sparkles,
  Calendar,
  CalendarRange,
  Network,
  RefreshCw,
  Sliders,
  BarChart3,
  Settings,
  Plus,
  TrainTrack,
  Shield,
  Wrench,
  Eye
} from 'lucide-react';

export const getNavSections = (userRole) => {
  const role = userRole?.toLowerCase();
  const isAdmin   = role === 'admin';
  const isPlanner = role === 'planner';
  const isViewer  = role === 'viewer';

  if (isAdmin) {
    return [
      {
        group: 'ADMIN CONTROL',
        items: [
          { path: '/admin-panel',   label: 'Admin Control Panel',       icon: Shield,       badge: 'Admin' },
          { path: '/dashboard',     label: 'Orchestration Dashboard',   icon: LayoutDashboard, badge: null },
        ]
      },
      {
        group: 'CORE INTELLIGENCE',
        items: [
          { path: '/maintenance-intelligence', label: 'Maintenance Intelligence', icon: BrainCircuit, badge: 'AI' },
          { path: '/asset-health',             label: 'Asset Health',             icon: Activity,    badge: '6 IMR' },
          { path: '/ai-priority-engine',       label: 'AI Priority Engine',       icon: Zap,         badge: null },
        ]
      },
      {
        group: 'PLANNING & OPTIMIZATION',
        items: [
          { path: '/smart-block-bundling', label: 'Smart Block Bundling', icon: Layers,      badge: '2 New' },
          { path: '/ai-block-optimizer',   label: 'AI Block Optimizer',   icon: Sparkles,    badge: 'Auto' },
          { path: '/weekly-planner',       label: 'Weekly Planner',       icon: Calendar,    badge: null },
          { path: '/monthly-planner',      label: 'Monthly Planner',      icon: CalendarRange, badge: null },
        ]
      },
      {
        group: 'DIGITAL TWIN & SIMULATION',
        items: [
          { path: '/railway-digital-twin', label: 'Railway Digital Twin', icon: Network,   badge: 'Live' },
          { path: '/dynamic-replanning',   label: 'Dynamic Replanning',   icon: RefreshCw, badge: 'Alert' },
          { path: '/what-if-simulator',    label: 'What-If Simulator',    icon: Sliders,   badge: null },
        ]
      },
      {
        group: 'ANALYTICS & CONTROL',
        items: [
          { path: '/reports-analytics', label: 'Reports & Analytics', icon: BarChart3, badge: null },
          { path: '/settings',          label: 'Settings',            icon: Settings,  badge: null },
        ]
      },
    ];
  }

  if (isPlanner) {
    return [
      {
        group: 'PLANNER PANEL',
        items: [
          { path: '/planner-panel', label: 'Planner Dashboard', icon: Wrench, badge: 'Plan' },
        ]
      },
      {
        group: 'INTELLIGENCE',
        items: [
          { path: '/maintenance-intelligence', label: 'Maintenance Intelligence', icon: BrainCircuit, badge: 'AI' },
          { path: '/asset-health',             label: 'Asset Health',             icon: Activity,     badge: '6 IMR' },
          { path: '/ai-priority-engine',       label: 'AI Priority Engine',       icon: Zap,          badge: null },
        ]
      },
      {
        group: 'PLANNING & OPTIMIZATION',
        items: [
          { path: '/smart-block-bundling', label: 'Smart Block Bundling', icon: Layers,      badge: '2 New' },
          { path: '/ai-block-optimizer',   label: 'AI Block Optimizer',   icon: Sparkles,    badge: 'Auto' },
          { path: '/weekly-planner',       label: 'Weekly Planner',       icon: Calendar,    badge: null },
          { path: '/monthly-planner',      label: 'Monthly Planner',      icon: CalendarRange, badge: null },
        ]
      },
      {
        group: 'DIGITAL TWIN & SIMULATION',
        items: [
          { path: '/railway-digital-twin', label: 'Railway Digital Twin', icon: Network,   badge: 'Live' },
          { path: '/dynamic-replanning',   label: 'Dynamic Replanning',   icon: RefreshCw, badge: 'Alert' },
          { path: '/what-if-simulator',    label: 'What-If Simulator',    icon: Sliders,   badge: null },
        ]
      },
      {
        group: 'ANALYTICS',
        items: [
          { path: '/reports-analytics', label: 'Reports & Analytics', icon: BarChart3, badge: null },
          { path: '/settings',          label: 'Settings',            icon: Settings,  badge: null },
        ]
      },
    ];
  }

  // Viewer — read-only, minimal sidebar
  return [
    {
      group: 'MONITORING',
      items: [
        { path: '/viewer-panel', label: 'Monitoring Panel', icon: Eye, badge: 'View' },
      ]
    },
    {
      group: 'TRACK & ASSETS',
      items: [
        { path: '/railway-digital-twin', label: 'Railway Digital Twin', icon: Network,   badge: 'Live' },
        { path: '/asset-health',         label: 'Asset Health',         icon: Activity,  badge: null },
      ]
    },
    {
      group: 'REPORTS',
      items: [
        { path: '/reports-analytics', label: 'Reports & Analytics', icon: BarChart3, badge: null },
        { path: '/settings',          label: 'Settings',            icon: Settings,  badge: null },
      ]
    },
  ];
};

export default function Sidebar({ onNewOptimization, mobileOpen, onCloseMobile }) {
  const { user } = useAuth();
  const navSections = getNavSections(user?.role);
  const isPlannerOrAdmin = user?.role?.toLowerCase() === 'admin' || user?.role?.toLowerCase() === 'planner';

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-[#001947]/50 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed left-0 top-16 h-[calc(100vh-64px)] w-68 bg-[#f4f3fb] border-r border-[#e2e2e9] flex flex-col p-3 z-40 overflow-y-auto transition-transform duration-200 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="mb-4 px-2 py-1.5 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#002869] text-white flex items-center justify-center shadow-md flex-shrink-0">
            <TrainTrack className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-black text-[#002869] tracking-tight leading-none">
                RailBlockAI
              </h2>
              <span className="text-[9px] font-mono font-extrabold uppercase px-1 py-0.5 rounded bg-[#dae2ff] text-[#001947]">
                v1.0
              </span>
            </div>
            <p className="text-[11px] font-mono text-[#747783] mt-0.5">
              Command Center
            </p>
          </div>
        </div>

        {/* Quick CTA - Only for Planner & Admin */}
        {isPlannerOrAdmin && (
          <button
            onClick={onNewOptimization}
            className="w-full mb-4 bg-gradient-to-r from-[#002869] to-[#005db7] hover:from-[#0b3d91] hover:to-[#00468c] text-white py-2.5 px-3.5 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-level-1 hover:shadow-level-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            New Optimization
          </button>
        )}

        {/* Role Badge */}
        <div className="mb-3 px-2 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <p className="text-[10px] font-mono font-bold text-slate-600 uppercase tracking-wide">Current Role</p>
          <p className="text-sm font-bold text-blue-900 mt-0.5">{user?.role || 'User'}</p>
        </div>

        {/* Navigation Link Groups */}
        <nav className="flex-1 space-y-4">
          {navSections.map((section) => (
            <div key={section.group} className="space-y-1">
              <span className="px-2 text-[10px] font-mono font-bold tracking-wider text-[#747783] block mb-1">
                {section.group}
              </span>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-[#002869] text-white font-semibold shadow-xs'
                          : 'text-[#434652] hover:bg-[#e8e7ef] hover:text-[#002869]'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-2.5 min-w-0">
                          <Icon
                            className={`w-4 h-4 flex-shrink-0 ${
                              isActive ? 'text-[#8dadff]' : 'text-[#747783] group-hover:text-[#002869]'
                            }`}
                          />
                          <span className="truncate">{item.label}</span>
                        </div>
                        {item.badge && (
                          <span
                            className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md font-bold ${
                              isActive
                                ? 'bg-white/20 text-white'
                                : 'bg-[#e2e2e9] text-[#002869] group-hover:bg-[#dae2ff]'
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Status Footer */}
        <div className="mt-4 pt-3 border-t border-[#e2e2e9] px-2 flex items-center justify-between text-[11px] font-mono text-[#747783]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#00a859] animate-pulse" />
            <span>Telemetry Live</span>
          </div>
          <span className="text-[10px] font-mono text-[#002869] font-bold bg-[#dae2ff] px-1.5 py-0.5 rounded">
            SR / MDU Div
          </span>
        </div>
      </aside>
    </>
  );
}
