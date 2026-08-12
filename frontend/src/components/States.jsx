import React from 'react';

export const DbErrorState = ({
  title = 'Graph database unavailable',
  message = 'Please check the connection and try again. The application will resume once CognoDB is reconnected.',
  onRetry,
}) => {
  return (
    <div className="min-h-[320px] flex items-center justify-center p-4">
      <div className="max-w-sm w-full panel p-5 text-left">
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">connection error</p>
        <h3 className="font-display text-lg font-semibold text-neutral-100 mb-1">{title}</h3>
        <p className="text-xs text-muted leading-relaxed mb-4">{message}</p>

        {onRetry && (
          <button onClick={onRetry} className="btn-primary w-full">
            Retry connection
          </button>
        )}
      </div>
    </div>
  );
};

export const SkeletonCard = () => (
  <div className="panel p-3 animate-pulse space-y-2">
    <div className="h-3 bg-neutral-800 w-1/2" />
    <div className="h-2 bg-neutral-800/60 w-full" />
    <div className="h-2 bg-neutral-800/60 w-4/5" />
    <div className="flex gap-2 pt-1">
      <div className="h-4 w-12 bg-neutral-800" />
      <div className="h-4 w-12 bg-neutral-800" />
    </div>
  </div>
);

export const EmptyState = ({
  title,
  description,
}) => (
  <div className="panel p-6 text-left">
    <p className="font-mono text-[10px] uppercase tracking-widest text-muted mb-2">empty</p>
    <h4 className="font-display text-sm font-semibold text-neutral-300 mb-1">{title}</h4>
    <p className="text-xs text-muted max-w-md leading-relaxed">{description}</p>
  </div>
);
