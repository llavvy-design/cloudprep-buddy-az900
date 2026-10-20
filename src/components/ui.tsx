interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ReactNode;
  accent?: 'sage' | 'orange' | 'neutral';
}

export function StatCard({ label, value, hint, icon, accent = 'neutral' }: StatCardProps) {
  const accentBg =
    accent === 'sage'
      ? 'var(--sage-soft)'
      : accent === 'orange'
      ? 'var(--orange-soft)'
      : 'var(--surface-2)';
  const accentColor =
    accent === 'sage'
      ? 'var(--sage-strong)'
      : accent === 'orange'
      ? 'var(--orange-strong)'
      : 'var(--text-soft)';

  return (
    <div className="surface card-hover p-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          {label}
        </span>
        {icon && (
          <span
            className="flex items-center justify-center rounded-lg"
            style={{ width: 28, height: 28, background: accentBg, color: accentColor }}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
      </div>
      <div className="mt-2 text-2xl font-extrabold" style={{ color: 'var(--text)' }}>
        {value}
      </div>
      {hint && (
        <div className="mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
          {hint}
        </div>
      )}
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  color?: 'orange' | 'sage';
}

export function ProgressBar({ value, max = 1, showLabel, color = 'orange' }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(1, value / max)) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="progress-track flex-1" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="progress-fill"
          style={{ width: pct + '%', background: color === 'sage' ? 'var(--sage)' : 'var(--orange)' }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-semibold tabular-nums" style={{ color: 'var(--text-soft)' }}>
          {Math.round(pct)}%
        </span>
      )}
    </div>
  );
}

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  message: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div
      className="flex flex-col items-center text-center px-6 py-12 rounded-xl"
      style={{ background: 'var(--surface-2)', border: '1px dashed var(--border-strong)' }}
    >
      <div
        className="flex items-center justify-center rounded-2xl mb-4"
        style={{ width: 56, height: 56, background: 'var(--surface)', color: 'var(--sage)', border: '1px solid var(--border)' }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <h3 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
        {title}
      </h3>
      <p className="mt-1.5 max-w-md text-sm" style={{ color: 'var(--text-soft)' }}>
        {message}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
