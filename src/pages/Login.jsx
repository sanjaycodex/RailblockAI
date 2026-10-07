import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TrainTrack, ShieldCheck, Shield, Wrench, Eye, Lock, ArrowRight, User, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth, DEMO_USERS, getDefaultRedirectForRole } from '../context/AuthContext';
import { isSupabaseConfigured } from '../lib/supabase';

const ROLE_PORTALS = {
  admin: {
    key: 'admin',
    title: 'Admin Command Portal',
    badge: 'Chief Controller / Approver',
    icon: Shield,
    color: 'from-purple-600 to-indigo-700',
    borderColor: 'border-purple-300',
    activeBg: 'bg-purple-50 text-purple-900 border-purple-600',
    email: 'admin@railblock.ai',
    password: 'demo1234',
    scope: 'Inspect maintenance plans, verify train conflict de-conflicting, and issue official approvals/rejections.',
    rights: ['✅ Full Plan Inspection', '✅ Exclusive Approval & Rejection', '✅ System Audit Control'],
    landingPath: '/admin-panel'
  },
  planner: {
    key: 'planner',
    title: 'Planner Assignment Portal',
    badge: 'Section Planning Engineer',
    icon: Wrench,
    color: 'from-blue-600 to-cyan-600',
    borderColor: 'border-blue-300',
    activeBg: 'bg-blue-50 text-blue-900 border-blue-600',
    email: 'planner@railblock.ai',
    password: 'demo1234',
    scope: 'View maintenance plans, check real-time viewer/staff availability, and assign approved plans to respective departments (Civil, Electrical, S&T, Mechanical).',
    rights: ['✅ View Corridor Plans', '✅ Live Viewer/Staff Availability Hub', '✅ Assign to Departments & Supervisors', '❌ Cannot Approve Plans (Admin Only)'],
    landingPath: '/planner-panel'
  },
  viewer: {
    key: 'viewer',
    title: 'Viewer Monitoring Portal',
    badge: 'Station Master / Field Operations',
    icon: Eye,
    color: 'from-teal-600 to-emerald-600',
    borderColor: 'border-teal-300',
    activeBg: 'bg-teal-50 text-teal-900 border-teal-600',
    email: 'viewer@railblock.ai',
    password: 'demo1234',
    scope: 'Real-time observation of approved maintenance windows, track possessions, and asset safety status. Strictly read-only monitoring.',
    rights: ['✅ Monitor All Corridor Plans', '✅ Track Possession Real-Time View', '❌ No Approval Authority', '❌ No Assignment Rights'],
    landingPath: '/viewer-panel'
  }
};

export default function Login() {
  const { login, loginWithDemoRole } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedRole, setSelectedRole] = useState('admin');
  const [email, setEmail] = useState(ROLE_PORTALS.admin.email);
  const [password, setPassword] = useState(ROLE_PORTALS.admin.password);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    setEmail(ROLE_PORTALS[roleKey].email);
    setPassword(ROLE_PORTALS[roleKey].password);
    setErrorMsg('');
  };

  const handleCustomLogin = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await login(email, password || 'demo1234');
      const targetRole = res?.user?.role || selectedRole;
      const targetPath = getDefaultRedirectForRole(targetRole);
      navigate(targetPath, { replace: true });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to authenticate');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFastLogin = (roleKey) => {
    loginWithDemoRole(roleKey);
    const targetPath = ROLE_PORTALS[roleKey]?.landingPath || '/dashboard';
    navigate(targetPath, { replace: true });
  };

  const activePortal = ROLE_PORTALS[selectedRole];
  const PortalIcon = activePortal.icon;

  return (
    <div className="min-h-screen bg-[#faf8ff] flex flex-col justify-center items-center p-4 selection:bg-[#dae2ff]">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-xl p-8">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#002869] text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <TrainTrack className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-[#002869] tracking-tight">RailBlockAI Command Access</h1>
          <p className="text-xs text-[#747783] mt-1 font-mono">
            Tirunelveli - Madurai Mainline (TEN-MDU) • Southern Railway
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#dae2ff] text-[#001947]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#005db7]" />
            Role-Based Access Control (RBAC) System Active
          </div>
        </div>

        {/* 3 Separate Role Selector Tabs */}
        <div className="mb-6">
          <label className="block text-[11px] font-mono font-bold uppercase text-slate-500 mb-2 text-center">
            Select Your Role Login Portal
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.values(ROLE_PORTALS).map((portal) => {
              const Icon = portal.icon;
              const isSelected = selectedRole === portal.key;
              return (
                <button
                  key={portal.key}
                  type="button"
                  onClick={() => handleRoleSelect(portal.key)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? portal.activeBg + ' shadow-md'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-xl text-white bg-gradient-to-br ${portal.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    {isSelected && (
                      <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-white/80 border border-current">
                        SELECTED
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold capitalize">{portal.key}</h3>
                    <p className="text-[10px] font-mono text-slate-500 leading-tight mt-0.5">
                      {portal.badge}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Role Portal Details Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-start gap-3">
            <div className={`p-2.5 rounded-xl text-white bg-gradient-to-br ${activePortal.color} flex-shrink-0 mt-0.5`}>
              <PortalIcon className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-900 text-sm">{activePortal.title}</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 bg-slate-200 text-slate-700 rounded-md font-semibold">
                  Routes to: {activePortal.landingPath}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{activePortal.scope}</p>
              
              <div className="mt-3 pt-2.5 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px] font-mono">
                {activePortal.rights.map((right, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-slate-700">
                    <span>{right}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 1-Click Fast Instant Login Button */}
          <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500 font-mono">
              Fast Demo Credentials: <strong>{activePortal.email}</strong>
            </span>
            <button
              type="button"
              onClick={() => handleFastLogin(selectedRole)}
              className={`px-4 py-2 text-white font-mono font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer bg-gradient-to-r ${activePortal.color} hover:opacity-90 flex items-center gap-1.5`}
            >
              <span>Instant {selectedRole.toUpperCase()} Login</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="relative flex py-1 items-center mb-4">
          <div className="flex-grow border-t border-slate-200" />
          <span className="flex-shrink mx-3 text-[10px] font-mono text-slate-400 uppercase">
            Or Sign In With Credentials
          </span>
          <div className="flex-grow border-t border-slate-200" />
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-[#ba1a1a] flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Credentials Form */}
        <form onSubmit={handleCustomLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-[#002869] mb-1 font-mono uppercase">
              Official Railway Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="controller@railblock.ai"
                required
                className="w-full pl-9 pr-3 py-2.5 bg-[#f4f3fb] border border-slate-200 rounded-xl focus:bg-white focus:border-[#005db7] outline-none transition-all font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-[#002869] mb-1 font-mono uppercase">
              Password / Security Token
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-[#f4f3fb] border border-slate-200 rounded-xl focus:bg-white focus:border-[#005db7] outline-none transition-all font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 text-white font-mono font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 bg-gradient-to-r ${activePortal.color}`}
          >
            {isSubmitting ? 'Authenticating...' : `Enter ${activePortal.title}`}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
