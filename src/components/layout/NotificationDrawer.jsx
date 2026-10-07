import React, { useState } from 'react';
import { X, CheckCheck, AlertTriangle, Sparkles, AlertCircle, Info, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';

export default function NotificationDrawer({
  isOpen,
  onClose,
  notifications = [],
  onMarkAllRead,
  onNotificationClick
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'critical' | 'ai' | 'unread'

  if (!isOpen) return null;

  const filtered = notifications.filter((item) => {
    if (filter === 'unread') return !item.read;
    if (filter === 'critical') return item.type === 'critical';
    if (filter === 'ai') return item.type === 'ai';
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'critical':
        return <AlertCircle className="w-4 h-4 text-[#ba1a1a]" />;
      case 'ai':
        return <Sparkles className="w-4 h-4 text-[#005db7]" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-[#d97706]" />;
      default:
        return <Info className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-[#001947]/40 backdrop-blur-xs transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white h-full shadow-level-3 border-l border-slate-200 z-10 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-[#faf8ff]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-[#002869] text-base">Network Telemetry Alerts</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#dae2ff] text-[#001947]">
                {notifications.filter((n) => !n.read).length} Unread
              </span>
            </div>
            <p className="text-xs text-[#747783] mt-0.5">Real-time defect and block updates</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills & Actions */}
        <div className="p-3 border-b border-slate-100 flex items-center justify-between gap-2 bg-[#f4f3fb]/60 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {['all', 'unread', 'critical', 'ai'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold uppercase transition-all cursor-pointer ${
                  filter === f
                    ? 'bg-[#002869] text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <button
            onClick={onMarkAllRead}
            className="text-[11px] font-mono text-[#005db7] hover:underline flex items-center gap-1 flex-shrink-0 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              <Info className="w-8 h-8 mx-auto mb-2 text-slate-300" />
              <p className="text-xs font-medium">No notifications in this filter view</p>
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => onNotificationClick && onNotificationClick(item)}
                className={`p-4 transition-colors hover:bg-[#faf8ff] cursor-pointer ${
                  !item.read ? 'bg-[#f4f3fb]/40' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 p-1.5 rounded-lg bg-white border border-slate-200 shadow-xs flex-shrink-0">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold uppercase text-[#005db7]">
                        {item.corridor || 'SYSTEM'}
                      </span>
                      <span className="text-[10px] font-mono text-[#747783]">{item.time}</span>
                    </div>
                    <h4 className="text-xs font-bold text-[#002869] leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-[#434652] mt-1 leading-relaxed">
                      {item.description}
                    </p>

                    {item.actionRoute && (
                      <Link
                        to={item.actionRoute}
                        onClick={onClose}
                        className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#002869] hover:text-[#005db7] mt-2.5"
                      >
                        {item.actionText || 'View Details'}
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-[#005db7] mt-1 flex-shrink-0" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
