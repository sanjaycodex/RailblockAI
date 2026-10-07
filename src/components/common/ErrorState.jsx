import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function ErrorState({
  title = 'Failed to load railway telemetry',
  message = 'An error occurred while communicating with the central dispatch and maintenance feed.',
  onRetry
}) {
  return (
    <div className="bg-red-50/50 border border-red-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center max-w-md mx-auto">
      <div className="w-12 h-12 rounded-xl bg-red-100 text-[#ba1a1a] flex items-center justify-center mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h4 className="text-base font-bold text-[#ba1a1a] mb-1">{title}</h4>
      <p className="text-xs text-slate-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-4 py-2 bg-[#ba1a1a] hover:bg-red-800 text-white text-xs font-mono font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Connection
        </button>
      )}
    </div>
  );
}
