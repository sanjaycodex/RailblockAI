import React from 'react';

export default function MetricCard({
  title,
  value,
  unit = '',
  delta,
  deltaType = 'positive', // 'positive' | 'negative' | 'neutral'
  subtitle,
  icon,
  iconBg = 'bg-[#e9edff] text-[#002869]',
  badgeText,
  onClick,
  className = ''
}) {
  const isClickable = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      className={`bg-white border border-gray-200 rounded-lg p-5 transition-all duration-200 ${
        isClickable ? 'cursor-pointer hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-600 mb-1">
            {title}
          </h3>
          {badgeText && (
            <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
              {badgeText}
            </span>
          )}
        </div>
      </div>

      <div className="mb-3 flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-900">
          {value}
        </span>
        {unit && <span className="text-base text-gray-500 font-medium">{unit}</span>}
      </div>

      {(delta || subtitle) && (
        <div className="flex items-center gap-2 text-sm">
          {delta && (
            <span
              className={`inline-flex items-center px-2 py-1 rounded-md font-medium ${
                deltaType === 'positive'
                  ? 'bg-green-50 text-green-700'
                  : deltaType === 'negative'
                  ? 'bg-red-50 text-red-700'
                  : 'bg-gray-50 text-gray-700'
              }`}
            >
              {delta}
            </span>
          )}
          {subtitle && <span className="text-gray-500">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
