interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageHeader({ title, subtitle, icon, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6">
      <div className="flex items-start gap-3">
        {icon && (
          <div
            className="flex items-center justify-center rounded-xl shrink-0"
            style={{
              width: 44,
              height: 44,
              background: 'var(--sage-soft)',
              color: 'var(--sage-strong)',
            }}
            aria-hidden="true"
          >
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text)' }}>
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm sm:text-base" style={{ color: 'var(--text-soft)' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}
