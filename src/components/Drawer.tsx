
import { useEffect, useLayoutEffect, useRef, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  width?: number;
  resetKey?: string | number | null;
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  width = 560,
  resetKey = null,
}: DrawerProps) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  useLayoutEffect(() => {
    if (open && bodyRef.current) {
      bodyRef.current.scrollTop = 0;
    }
  }, [open, resetKey]);

  if (!open || typeof document === 'undefined') return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Concept details'}
    >
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.45)' }}
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="relative flex min-h-0 flex-col overflow-hidden cpb-scale-in"
        style={{
          width: `min(100vw, ${width}px)`,
          height: '100dvh',
          maxHeight: '100dvh',
          background: 'var(--surface)',
          borderLeft: '1px solid var(--border)',
          boxShadow: 'var(--shadow-lg)',
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="shrink-0 flex items-center justify-between px-5 py-4 border-b"
          style={{
            background: 'var(--surface)',
            borderColor: 'var(--border)',
          }}
        >
          <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
            {title}
          </h2>

          <button
            className="btn-ghost btn !p-2 !min-h-0"
            style={{ width: 36, height: 36 }}
            onClick={onClose}
            aria-label="Close panel"
            type="button"
          >
            <X size={18} />
          </button>
        </div>

        <div
          ref={bodyRef}
          className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
