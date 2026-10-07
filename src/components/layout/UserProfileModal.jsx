import React from 'react';
import { User, ShieldCheck, MapPin, Award, CheckCircle2, Clock, Phone, Mail, LogOut } from 'lucide-react';
import Modal from '../common/Modal';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function UserProfileModal({ isOpen, onClose }) {
  const { user, logout, loginWithDemoRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    onClose();
    navigate('/login');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Profile & Dispatch Credentials"
      subtitle="Authorized Southern Railway / Madurai Division Control"
      maxWidth="max-w-md"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            onClick={handleLogout}
            className="px-3 py-2 text-xs font-mono font-semibold text-[#ba1a1a] hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#002869] text-white text-xs font-mono font-semibold rounded-lg hover:bg-[#0b3d91] transition-all cursor-pointer"
          >
            Done
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Profile Card */}
        <div className="flex items-center gap-3.5 p-3.5 bg-[#f4f3fb] border border-slate-200 rounded-xl">
          <div className="w-14 h-14 rounded-full bg-[#002869] text-white flex items-center justify-center text-xl font-bold font-mono shadow-md">
            {user?.full_name ? user.full_name.charAt(0) : 'U'}
          </div>
          <div>
            <h4 className="font-bold text-[#002869] text-base leading-snug">
              {user?.full_name || 'Railway Operations Officer'}
            </h4>
            <p className="text-xs text-[#747783] font-mono">{user?.department || 'Operations'}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                {user?.role || 'Planner'} Role
              </span>
            </div>
          </div>
        </div>

        {/* Quick Role Switcher (Prototype helper) */}
        <div className="p-3 bg-[#e9edff]/40 border border-[#dae2ff] rounded-xl">
          <span className="text-[10px] font-mono font-bold uppercase text-[#002869] block mb-2">
            Switch Active Prototype Role
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            {['admin', 'planner', 'viewer'].map((roleKey) => (
              <button
                key={roleKey}
                onClick={() => loginWithDemoRole(roleKey)}
                className={`py-1.5 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer capitalize ${
                  user?.role?.toLowerCase() === roleKey
                    ? 'bg-[#002869] text-white border-[#002869]'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {roleKey}
              </button>
            ))}
          </div>
        </div>

        {/* Details List */}
        <div className="space-y-2 text-xs">
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-[#747783]">Email</span>
            <span className="font-mono font-semibold text-[#002869]">{user?.email || 'N/A'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-[#747783]">Division / Zone</span>
            <span className="font-mono font-semibold text-[#002869]">Southern Railway (Madurai Division)</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-[#747783]">Assigned Corridor</span>
            <span className="font-mono font-semibold text-[#002869]">Tirunelveli - Madurai Mainline</span>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-100">
            <span className="text-[#747783]">Authentication Mode</span>
            <span className="font-mono text-emerald-600 font-semibold">Supabase Auth Session</span>
          </div>
        </div>
      </div>
    </Modal>
  );
}
