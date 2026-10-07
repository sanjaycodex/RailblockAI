import React, { useState } from 'react';
import {
  Menu,
  Bell,
  Sparkles,
  Radio,
  Database,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { isSupabaseConfigured } from '../../lib/supabase';

export default function TopHeader({
  onToggleMobileMenu,
  onOpenNotifications,
  unreadCount = 0,
  onOpenAIAssistant,
  onOpenProfile,
  searchQuery,
  onSearchChange,
  onRefreshData
}) {
  const { user, logout } = useAuth();
  const [seeding, setSeeding] = useState(false);

  const handleSeedReset = async () => {
    setSeeding(true);
    try {
      await api.resetAndSeedDatabase();
      if (onRefreshData) onRefreshData();
      alert('Tirunelveli - Madurai prototype dataset has been seeded/reset successfully!');
    } catch (e) {
      alert('Error seeding database: ' + e.message);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-[#e2e2e9] z-30 px-4 flex items-center justify-between shadow-xs">
      {/* Left: Mobile Toggle & Brand Indicator */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 text-[#434652] hover:bg-[#f4f3fb] rounded-lg md:hidden transition-colors cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-bold bg-[#e9edff] text-[#002869] border border-[#dae2ff]">
            <Radio className="w-3 h-3 text-[#005db7] animate-pulse" />
            TEN-MDU CORRIDOR LIVE
          </span>
          <span className="text-[10px] font-mono text-slate-500 hidden xl:inline">
            (Madurai Division • 157.1 KM)
          </span>
        </div>
      </div>

      {/* Center: spacer */}
      <div className="flex-1" />

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Seed Database Button */}
        <button
          onClick={handleSeedReset}
          disabled={seeding}
          className="hidden lg:flex px-2.5 py-1.5 rounded-xl border border-slate-200 hover:bg-[#f4f3fb] text-[#002869] text-xs font-mono font-bold items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
          title="Reset and Seed Prototype Database"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${seeding ? 'animate-spin' : ''}`} />
          <span>{seeding ? 'Seeding...' : 'Seed DB'}</span>
        </button>

        {/* AI Assistant Quick Trigger */}
        <button
          onClick={onOpenAIAssistant}
          className="px-3 py-1.5 rounded-xl ai-gradient text-white text-xs font-mono font-bold flex items-center gap-1.5 shadow-sm hover:opacity-95 transition-all cursor-pointer"
          title="RailBlock AI Assistant"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
          <span className="hidden md:inline">AI Copilot</span>
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-[#434652] hover:bg-[#f4f3fb] rounded-xl transition-colors cursor-pointer"
          title="System Alerts & Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#ba1a1a] text-white text-[10px] font-mono font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-bounce">
              {unreadCount}
            </span>
          )}
        </button>

        {/* User Profile Button */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-2 pl-2 pr-3 py-1 bg-[#f4f3fb] hover:bg-[#eeedf5] border border-[#e2e2e9] rounded-full transition-all cursor-pointer ml-1"
          title="User Profile & Role Settings"
        >
          <div className="w-7 h-7 rounded-full bg-[#002869] text-white flex items-center justify-center text-xs font-bold font-mono shadow-xs">
            {user?.full_name ? user.full_name.charAt(0) : 'U'}
          </div>
          <div className="text-left hidden lg:block">
            <p className="text-xs font-bold text-[#002869] leading-none truncate max-w-[120px]">
              {user?.full_name || 'Officer'}
            </p>
            <p className="text-[10px] font-mono text-[#747783] mt-0.5">
              {user?.role || 'Planner'}
            </p>
          </div>
        </button>
      </div>
    </header>
  );
}
