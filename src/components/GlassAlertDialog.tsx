import type { ReactNode } from 'react';
import { GlassModal } from './GlassModal';
import { GlassButton } from './GlassButton';

export interface GlassAlertDialogProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  description?: ReactNode;
  /** Extra content between the description and the buttons. */
  children?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  /** Colours the confirm button. @default 'danger' */
  tone?: 'danger' | 'accent' | 'warning' | 'success';
  /** Disable buttons + show a spinner on confirm while an async action runs. */
  loading?: boolean;
  className?: string;
}

/**
 * A confirmation dialog — a focused modal with a cancel + confirm pair. Built on
 * {@link GlassModal}, so it inherits focus-trapping, scroll-lock, and Escape.
 */
export function GlassAlertDialog({
  open,
  onClose,
  title,
  description,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  tone = 'danger',
  loading = false,
  className,
}: GlassAlertDialogProps) {
  return (
    <GlassModal
      open={open}
      onClose={onClose}
      size="sm"
      title={title}
      description={description}
      showClose={false}
      closeOnScrim={!loading}
      closeOnEscape={!loading}
      className={className}
      footer={
        <>
          <GlassButton variant="ghost" size="sm" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </GlassButton>
          <GlassButton variant="primary" size="sm" tone={tone} loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </GlassButton>
        </>
      }
    >
      {children}
    </GlassModal>
  );
}
