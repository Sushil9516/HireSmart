import React from 'react';

export const MatchRing = ({
  percentage,
  size = 28,
  showLabel = true,
  className = '',
}) => {
  const stroke = 2;
  const radius = (size - stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <svg width={size} height={size} className="shrink-0 -rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#262626"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#0d9488"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="butt"
        />
      </svg>
      {showLabel && (
        <span className="font-display text-sm font-semibold tabular-nums text-neutral-200 border-b border-accent/50 leading-none pb-0.5">
          {percentage}
          <span className="text-[10px] font-normal text-muted ml-px">%</span>
        </span>
      )}
    </div>
  );
};
