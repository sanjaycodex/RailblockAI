import React from 'react';
import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning', // 'warning' | 'danger' | 'info' | 'success'
  isPending = false
}) {
  const typeConfigs = {
    warning: {
      icon: <AlertTriangle className="w-6 h-6 text-amber-600" />,
      iconBg: 'bg-amber-100',
      btnBg: 'bg-amber-600 hover:bg-amber-700 text-white'
    },
    danger: {
      icon: <AlertCircle className="w-6 h-6 text-red-600" />,
      iconBg: 'bg-red-100',
      btnBg: 'bg-[#ba1a1a] hover:bg-red-800 text-white'
    },
    info: {
      icon: <AlertCircle className="w-6 h-6 text-[#005db7]" />,
      iconBg: 'bg-blue-100',
      btnBg: 'bg-[#002869] hover:bg-[#0b3d91] text-white'
    },
    success: {
      icon: <CheckCircle2 className="w-6 h-6 text-[#00a859]" />,
      iconBg: 'bg-emerald-100',
      btnBg: 'bg-[#00a859] hover:bg-emerald-700 text-white'
    }
  };

  const config = typeConfigs[type] || typeConfigs.warning;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="max-w-md"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2 text-xs font-mono font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              if (onConfirm) onConfirm();
            }}
            disabled={isPending}
            className={`px-4 py-2 text-xs font-mono font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 ${config.btnBg} disabled:opacity-50`}
          >
            {isPending ? 'Processing...' : confirmText}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        <div className={`p-2.5 rounded-xl flex-shrink-0 ${config.iconBg}`}>
          {config.icon}
        </div>
        <div className="flex-1 text-sm text-slate-600 leading-relaxed">
          {message}
        </div>
      </div>
    </Modal>
  );
}
