import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, AlertCircle } from 'lucide-react';

/**
 * RoleProtectedRoute - Protects routes based on user roles
 * @param {string[]} allowedRoles - Array of roles allowed to access the route
 * @param {React.ReactNode} children - Child components to render if authorized
 */
export default function RoleProtectedRoute({ allowedRoles, children }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = user?.role?.toLowerCase();
  const hasAccess = allowedRoles.some(role => role.toLowerCase() === userRole);

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full border border-red-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-red-50 rounded-lg">
              <ShieldAlert className="w-8 h-8 text-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Access Denied</h2>
              <p className="text-sm text-slate-600">Insufficient Permissions</p>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-800">
                <p className="font-semibold mb-1">Authorization Required</p>
                <p>
                  You need <span className="font-bold">{allowedRoles.join(' or ')}</span> role to access this page.
                </p>
                <p className="mt-2">
                  Your current role: <span className="font-bold">{user?.role || 'Unknown'}</span>
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-sm text-slate-600">
            <p><strong>Your Details:</strong></p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Name: {user?.full_name}</li>
              <li>Department: {user?.department}</li>
              <li>Division: {user?.division}</li>
            </ul>
          </div>

          <button
            onClick={() => window.history.back()}
            className="mt-6 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
