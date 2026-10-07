import React from 'react';

export function LoadingSkeleton({ lines = 3, type = 'card' }) {
  if (type === 'card') {
    return (
      <div className="card-base animate-pulse space-y-3">
        <div className="flex justify-between items-center">
          <div className="h-4 bg-slate-200 rounded w-1/3" />
          <div className="h-8 w-8 bg-slate-200 rounded-lg" />
        </div>
        <div className="h-8 bg-slate-200 rounded w-1/2" />
        <div className="h-3 bg-slate-200 rounded w-3/4" />
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-4 animate-pulse space-y-4">
        <div className="flex justify-between items-center mb-4">
          <div className="h-5 bg-slate-200 rounded w-48" />
          <div className="h-8 bg-slate-200 rounded w-64" />
        </div>
        {[...Array(lines)].map((_, i) => (
          <div key={i} className="flex gap-4 py-2 border-b border-slate-100">
            <div className="h-4 bg-slate-200 rounded flex-1" />
            <div className="h-4 bg-slate-200 rounded flex-1" />
            <div className="h-4 bg-slate-200 rounded flex-1" />
            <div className="h-4 bg-slate-200 rounded w-20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2 animate-pulse">
      {[...Array(lines)].map((_, i) => (
        <div key={i} className="h-4 bg-slate-200 rounded w-full" />
      ))}
    </div>
  );
}

export default LoadingSkeleton;
