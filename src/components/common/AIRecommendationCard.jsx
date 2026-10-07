import React, { useState } from 'react';
import { Sparkles, CheckCircle2, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function AIRecommendationCard({
  recommendation,
  onApply,
  onDismiss,
  className = ''
}) {
  const [applied, setApplied] = useState(false);

  const handleApply = () => {
    setApplied(true);
    if (onApply) onApply(recommendation);
  };

  return (
    <div
      className={`relative bg-white border border-slate-200 rounded-xl p-5 shadow-level-1 overflow-hidden transition-all hover:border-[#005db7]/40 hover:shadow-level-2 ${
        applied ? 'border-emerald-300 bg-emerald-50/20' : ''
      } ${className}`}
    >
      {/* Accent left stripe */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1.5 ${
          applied ? 'bg-[#00a859]' : 'bg-gradient-to-b from-[#002869] to-[#00a859]'
        }`}
      />

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div className="flex-1 pl-1">
          <div className="flex items-center gap-2 flex-wrap mb-1.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-[#dae2ff] text-[#001947]">
              <Sparkles className="w-3 h-3 text-[#005db7]" />
              AI OPTIMIZATION
            </span>
            <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
              {recommendation.confidenceScore}% Confidence
            </span>
            <StatusBadge status={recommendation.status || 'Ready to Apply'} size="sm" />
          </div>

          <h4 className="text-base font-semibold text-[#002869] leading-snug">
            {recommendation.title}
          </h4>

          <p className="text-xs text-[#434652] mt-1.5 leading-relaxed">
            {recommendation.description}
          </p>

          {recommendation.impactComparison && (
            <div className="mt-3.5 grid grid-cols-3 gap-2 p-2.5 bg-[#f4f3fb] border border-slate-100 rounded-lg text-xs">
              <div>
                <span className="text-[10px] uppercase font-mono text-[#747783] block">Delay Avoided</span>
                <span className="font-mono font-bold text-[#ba1a1a] line-through mr-1">
                  {recommendation.impactComparison.originalDelayMinutes}m
                </span>
                <span className="font-mono font-bold text-emerald-600">
                  {recommendation.impactComparison.optimizedDelayMinutes}m
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#747783] block">Punctuality Gain</span>
                <span className="font-mono font-bold text-[#005db7]">
                  {recommendation.projectedPunctualityGain || '+2.4%'}
                </span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-mono text-[#747783] block">Estimated Savings</span>
                <span className="font-mono font-bold text-emerald-700">
                  {recommendation.impactComparison.costSavings || '₹4.5L'}
                </span>
              </div>
            </div>
          )}

          {recommendation.suggestedTime && (
            <div className="mt-2 flex items-center gap-1.5 text-xs text-[#002869] font-mono font-medium">
              <Clock className="w-3.5 h-3.5 text-[#005db7]" />
              <span>Suggested Slot: {recommendation.suggestedTime}</span>
            </div>
          )}
        </div>

        <div className="flex md:flex-col items-center gap-2 flex-shrink-0 justify-end">
          {applied ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700 bg-emerald-100 px-3 py-2 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
              Applied & Scheduled
            </span>
          ) : (
            <>
              <button
                onClick={handleApply}
                className="w-full md:w-auto px-4 py-2 bg-[#002869] hover:bg-[#0b3d91] text-white text-xs font-mono font-semibold rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Approve & Apply
              </button>
              {onDismiss && (
                <button
                  onClick={() => onDismiss(recommendation)}
                  className="px-3 py-2 text-xs font-mono text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
