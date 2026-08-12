import { useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn';
import { useControllableState } from '../lib/hooks';
import './GlassEditable.css';

export interface GlassEditableProps {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Fired when an edit is committed (Enter or blur). */
  onSubmit?: (value: string) => void;
  placeholder?: string;
  /** Multi-line editing. @default false */
  multiline?: boolean;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

/** Click-to-edit text — shows a label, swaps to an input on focus. Chakra-style. */
export function GlassEditable({
  value,
  defaultValue = '',
  onChange,
  onSubmit,
  placeholder = 'Click to edit',
  multiline = false,
  disabled = false,
  className,
  'aria-label': ariaLabel,
}: GlassEditableProps) {
  const [text, setText] = useControllableState(value, defaultValue, onChange);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(text);
  const ref = useRef<HTMLInputElement & HTMLTextAreaElement>(null);

  useEffect(() => {
    if (editing) {
      ref.current?.focus();
      ref.current?.select?.();
    }
  }, [editing]);

  const start = () => {
    if (disabled) return;
    setDraft(text);
    setEditing(true);
  };
  const commit = () => {
    setText(draft);
    onSubmit?.(draft);
    setEditing(false);
  };
  const cancel = () => {
    setDraft(text);
    setEditing(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      commit();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    }
  };

  if (editing) {
    const props = {
      ref,
      className: cn('ob-editable__input', className),
      value: draft,
      placeholder,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setDraft(e.target.value),
      onBlur: commit,
      onKeyDown,
      'aria-label': ariaLabel,
    };
    return multiline ? <textarea rows={3} {...props} /> : <input {...props} />;
  }

  return (
    <button
      type="button"
      className={cn('ob-editable__preview', !text && 'ob-editable__preview--empty', disabled && 'ob-editable__preview--disabled', className)}
      onClick={start}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {text || placeholder}
    </button>
  );
}
