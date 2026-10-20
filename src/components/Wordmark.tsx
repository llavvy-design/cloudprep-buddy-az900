import { Cloud } from 'lucide-react';

export function Wordmark({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const iconSize = size === 'lg' ? 28 : size === 'sm' ? 20 : 24;
  const titleSize =
    size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-base' : 'text-lg';
  const subSize = size === 'lg' ? 'text-sm' : 'text-xs';

  return (
    <div className="flex items-center gap-2.5">
      <div
        className="relative flex items-center justify-center rounded-xl shrink-0"
        style={{
          width: iconSize + 14,
          height: iconSize + 14,
          background: 'var(--text)',
          color: 'var(--bg)',
        }}
        aria-hidden="true"
      >
        <Cloud size={iconSize} strokeWidth={2.25} style={{ color: 'var(--orange)' }} />
        <span
          className="absolute"
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            background: 'var(--sage)',
            bottom: 4,
            right: 5,
          }}
        />
      </div>
      <div className="leading-tight">
        <div
          className={`font-extrabold tracking-tight ${titleSize}`}
          style={{ color: 'var(--text)' }}
        >
          CloudPrep<span style={{ color: 'var(--orange)' }}> Buddy</span>
        </div>
        <div
          className={`font-medium ${subSize}`}
          style={{ color: 'var(--text-muted)' }}
        >
          Understand cloud. Practise with purpose.
        </div>
      </div>
    </div>
  );
}
