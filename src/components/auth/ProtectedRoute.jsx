import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8ff] flex items-center justify-center">
        <div className="flex items-center gap-2 font-mono text-xs text-[#002869]">
          <span className="w-2 h-2 rounded-full bg-[#005db7] animate-ping" />
          Authenticating dispatch session...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div className="min-h-screen bg-[#faf8ff] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-[#ba1a1a]">Access Restricted</h2>
        <p className="text-xs text-slate-600 mt-2">
          Your role ({user?.role}) does not have permission to view this section.
        </p>
      </div>
    );
  }

  return children;
}
