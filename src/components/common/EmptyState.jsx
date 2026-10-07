import React from 'react';
import { Inbox, Plus } from 'lucide-react';

export default function EmptyState({
  title = 'No records found',
  description = 'There are no active railway records or items to display at this moment.',
  actionText,
  onAction,
  icon: Icon = Inbox
}) {
  return (
    <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-10 text-center flex flex-col items-center justify-center max-w-lg mx-auto">
      <div className="w-14 h-14 rounded-2xl bg-[#faf8ff] border border-slate-200 flex items-center justify-center text-[#002869] mb-4 shadow-xs">
        <Icon className="w-7 h-7 stroke-[1.5]" />
      </div>
      <h4 className="text-base font-bold text-[#002869] mb-1">{title}</h4>
      <p className="text-xs text-[#747783] max-w-sm mb-5 leading-relaxed">{description}</p>
      {actionText && (
        <button
          onClick={onAction}
          className="px-4 py-2 bg-[#002869] hover:bg-[#0b3d91] text-white text-xs font-mono font-semibold rounded-lg shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {actionText}
        </button>
      )}
    </div>
  );
}
