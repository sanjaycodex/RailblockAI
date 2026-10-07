import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingSpinner({ message = 'Loading...', size = 'default' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className={`${sizeClasses[size]} text-[#002869] animate-spin mb-3`} />
      <p className="text-sm font-mono text-slate-600">{message}</p>
    </div>
  );
}

export function PageLoadingSpinner({ message = 'Loading data...' }) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-[#002869] animate-spin mx-auto mb-4" />
        <p className="text-base font-mono font-bold text-slate-700 mb-1">{message}</p>
        <p className="text-xs text-slate-500">Please wait while we fetch the latest data</p>
      </div>
    </div>
  );
}

export function SkeletonLoader() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
      <div className="h-4 bg-slate-200 rounded w-1/2"></div>
      <div className="h-4 bg-slate-200 rounded w-5/6"></div>
    </div>
  );
}
