import { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  destructive?: boolean;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  destructive,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="alertdialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.45)' }}
        onClick={onCancel}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-md cpb-scale-in surface"
        style={{ boxShadow: 'var(--shadow-lg)' }}
      >
        <div className="flex items-start gap-3 p-5">
          <div
            className="flex items-center justify-center rounded-lg shrink-0"
            style={{
              width: 40,
              height: 40,
              background: destructive ? 'var(--orange-soft)' : 'var(--sage-soft)',
              color: destructive ? 'var(--orange-strong)' : 'var(--sage-strong)',
            }}
          >
            <AlertTriangle size={20} />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold" style={{ color: 'var(--text)' }}>
              {title}
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-soft)' }}>
              {message}
            </p>
          </div>
          <button
            className="btn-ghost btn !p-2 !min-h-0"
            style={{ width: 32, height: 32 }}
            onClick={onCancel}
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>
        <div
          className="flex justify-end gap-2 p-4 border-t"
          style={{ borderColor: 'var(--border)' }}
        >
          <button className="btn btn-outline" onClick={onCancel}>
            {cancelLabel}
          </button>
          <button
            className="btn"
            style={{
              background: destructive ? 'var(--error)' : 'var(--orange)',
              color: destructive ? '#fff' : 'var(--text)',
            }}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
