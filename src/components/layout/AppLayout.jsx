import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopHeader from './TopHeader';
import NotificationDrawer from './NotificationDrawer';
import AIAssistantDrawer from './AIAssistantDrawer';
import UserProfileModal from './UserProfileModal';
import NewOptimizationModal from './NewOptimizationModal';
import { RECENT_NOTIFICATIONS } from '../../data/railwayData';

export default function AppLayout() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [optimizationModalOpen, setOptimizationModalOpen] = useState(false);
  const [notifications, setNotifications] = useState(RECENT_NOTIFICATIONS);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (item) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
  };

  const handleLaunchOptimization = (data) => {
    // Add success notification
    const newNotif = {
      id: `notif-${Date.now()}`,
      type: 'ai',
      title: `AI Optimization Launched for ${data.corridor}`,
      description: `Targeting ${data.duration} min window on ${data.targetDate}. Solver running in background.`,
      time: 'Just now',
      read: false,
      corridor: data.corridor,
      actionRoute: '/ai-block-optimizer'
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header */}
      <TopHeader
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
        onOpenNotifications={() => setNotifOpen(true)}
        unreadCount={unreadCount}
        onOpenAIAssistant={() => setAiOpen(true)}
        onOpenProfile={() => setProfileOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="flex flex-1 pt-16">
        {/* Sidebar Navigation */}
        <Sidebar
          onNewOptimization={() => setOptimizationModalOpen(true)}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Routed Content Area */}
        <main className="flex-1 md:pl-72 px-6 py-8 md:px-10 md:py-10 min-h-[calc(100vh-64px)] w-full overflow-x-hidden max-w-[1920px]">
          <Outlet context={{ searchQuery, onOpenAI: () => setAiOpen(true), onNewOptimization: () => setOptimizationModalOpen(true) }} />
        </main>
      </div>

      {/* Drawers and Modals */}
      <NotificationDrawer
        isOpen={notifOpen}
        onClose={() => setNotifOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onNotificationClick={handleNotificationClick}
      />

      <AIAssistantDrawer
        isOpen={aiOpen}
        onClose={() => setAiOpen(false)}
      />

      <UserProfileModal
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
      />

      <NewOptimizationModal
        isOpen={optimizationModalOpen}
        onClose={() => setOptimizationModalOpen(false)}
        onLaunch={handleLaunchOptimization}
      />
    </div>
  );
}
