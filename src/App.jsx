import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { SimulationProvider } from './context/SimulationContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RoleProtectedRoute from './components/auth/RoleProtectedRoute';
import AppLayout from './components/layout/AppLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MaintenanceIntelligence from './pages/MaintenanceIntelligence';
import AssetHealth from './pages/AssetHealth';
import AIPriorityEngine from './pages/AIPriorityEngine';
import SmartBlockBundling from './pages/SmartBlockBundling';
import AIBlockOptimizer from './pages/AIBlockOptimizer';
import WeeklyPlanner from './pages/WeeklyPlanner';
import MonthlyPlanner from './pages/MonthlyPlanner';
import RailwayDigitalTwin from './pages/RailwayDigitalTwin';
import DynamicReplanning from './pages/DynamicReplanning';
import WhatIfSimulator from './pages/WhatIfSimulator';
import ReportsAnalytics from './pages/ReportsAnalytics';
import Settings from './pages/Settings';

// Role-Based Panels
import AdminPanel from './pages/AdminPanel';
import PlannerPanel from './pages/PlannerPanel';
import ViewerPanel from './pages/ViewerPanel';

// Role-aware index redirect (reads user from localStorage)
import { useAuth, getDefaultRedirectForRole } from './context/AuthContext';

function RoleRedirect() {
  const { user } = useAuth();
  return <Navigate to={getDefaultRedirectForRole(user?.role)} replace />;
}

export default function App() {
  return (
    <AuthProvider>
      <SimulationProvider>
        <HashRouter>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#fff',
                color: '#002869',
                border: '1px solid #dae2ff',
                padding: '12px 16px',
                fontSize: '14px',
                fontFamily: 'monospace',
              },
              success: {
                iconTheme: {
                  primary: '#00a859',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ba1a1a',
                  secondary: '#fff',
                },
              },
            }}
          />
          <Routes>
            {/* Public Login Route */}
            <Route path="/login" element={<Login />} />

            {/* Protected Application Routes */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }
            >
              {/* Role-based default redirect — each role lands on their own panel */}
              <Route index element={<RoleRedirect />} />
              
              {/* Role-Based Panel Routes */}
              <Route 
                path="admin-panel" 
                element={
                  <RoleProtectedRoute allowedRoles={['Admin']}>
                    <AdminPanel />
                  </RoleProtectedRoute>
                } 
              />
              <Route 
                path="planner-panel" 
                element={
                  <RoleProtectedRoute allowedRoles={['Admin', 'Planner']}>
                    <PlannerPanel />
                  </RoleProtectedRoute>
                } 
              />
              <Route 
                path="viewer-panel" 
                element={
                  <RoleProtectedRoute allowedRoles={['Admin', 'Planner', 'Viewer']}>
                    <ViewerPanel />
                  </RoleProtectedRoute>
                } 
              />
              
              {/* ADMIN-ONLY: full orchestration dashboard */}
              <Route path="dashboard" element={
                <RoleProtectedRoute allowedRoles={['Admin']}>
                  <Dashboard />
                </RoleProtectedRoute>
              } />
              
              {/* Shared Routes */}
              <Route path="asset-health" element={<AssetHealth />} />
              <Route path="railway-digital-twin" element={<RailwayDigitalTwin />} />
              <Route path="reports-analytics" element={<ReportsAnalytics />} />
              <Route path="settings" element={<Settings />} />
              
              {/* Planner & Admin Only Routes */}
              <Route 
                path="maintenance-intelligence" 
                element={
                  <RoleProtectedRoute allowedRoles={['Admin', 'Planner']}>
                    <MaintenanceIntelligence />
                  </RoleProtectedRoute>
                } 
              />
              <Route 
                path="ai-priority-engine" 
                element={
                  <RoleProtectedRoute allowedRoles={['Admin', 'Planner']}>
                    <AIPriorityEngine />
                  </RoleProtectedRoute>
                } 
              />
              <Route 
                path="smart-block-bundling" 
                element={
                  <RoleProtectedRoute allowedRoles={['Admin', 'Planner']}>
                    <SmartBlockBundling />
                  </RoleProtectedRoute>
                } 
              />
              <Route 
                path="ai-block-optimizer" 
                element={
                  <RoleProtectedRoute allowedRoles={['Admin', 'Planner']}>
                    <AIBlockOptimizer />
                  </RoleProtectedRoute>
                } 
              />
              <Route 
                path="weekly-planner" 
                element={
                  <RoleProtectedRoute allowedRoles={['Admin', 'Planner']}>
                    <WeeklyPlanner />
                  </RoleProtectedRoute>
                } 
              />
              <Route 
                path="monthly-planner" 
                element={
                  <RoleProtectedRoute allowedRoles={['Admin', 'Planner']}>
                    <MonthlyPlanner />
                  </RoleProtectedRoute>
                } 
              />
              <Route 
                path="dynamic-replanning" 
                element={
                  <RoleProtectedRoute allowedRoles={['Admin', 'Planner']}>
                    <DynamicReplanning />
                  </RoleProtectedRoute>
                } 
              />
              <Route 
                path="what-if-simulator" 
                element={
                  <RoleProtectedRoute allowedRoles={['Admin', 'Planner']}>
                    <WhatIfSimulator />
                  </RoleProtectedRoute>
                } 
              />
              
              <Route path="*" element={<RoleRedirect />} />
            </Route>
          </Routes>
        </HashRouter>
      </SimulationProvider>
    </AuthProvider>
  );
}
