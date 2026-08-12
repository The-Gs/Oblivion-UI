import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cn } from '../lib/cn';
import { useControllableState } from '../lib/hooks';
import { FieldLabel, FieldNote, useFieldIds } from './GlassField';
import './GlassInput.css';
import './GlassFileDrop.css';

/** Class names for each part of the control. */
export interface FileDropClasses {
  field?: string;
  label?: string;
  note?: string;
  /** The dashed drop target. */
  zone?: string;
  glyph?: string;
  prompt?: string;
  /** The "image/* · up to 2 MB" line. */
  terms?: string;
  list?: string;
  file?: string;
  name?: string;
  size?: string;
  remove?: string;
}

/** What {@link GlassFileDropProps.renderFile} is handed for each row. */
export interface FileRenderArgs {
  file: File;
  index: number;
  disabled: boolean;
  /** Drop this file from the selection. */
  remove: () => void;
  /** The active size formatter, so custom rows stay consistent. */
  formatSize: (bytes: number) => string;
}

export interface GlassFileDropProps {
  /** Files chosen so far. Omit for an uncontrolled field. */
  value?: readonly File[];
  /** Starting files when uncontrolled. @default [] */
  defaultValue?: readonly File[];
  onChange?: (files: File[]) => void;
  /** Comma-separated `accept` list — `image/*,.wav`. Also enforced on drop. */
  accept?: string;
  /** @default false */
  multiple?: boolean;
  /** Per-file ceiling, in bytes. */
  maxSize?: number;
  /** Cap the number of files. */
  maxFiles?: number;
  /** Called with a human-readable reason when files are refused. */
  onReject?: (reason: string, files: File[]) => void;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  /** Marker appended to the label when `required`. Pass `null` to drop it. */
  requiredMark?: ReactNode;
  disabled?: boolean;
  /** Copy inside the target. */
  prompt?: ReactNode;
  /** Replaces the auto-generated "accept · up to N" line. Pass `null` to hide it. */
  terms?: ReactNode;
  /** Glyphs. @default '↥' in the target and '✕' on each row */
  icons?: { upload?: ReactNode; remove?: ReactNode };
  /** Full control over a row in the file list — thumbnails, progress bars. */
  renderFile?: (args: FileRenderArgs) => ReactNode;
  /** Render sizes your own way. @default {@link formatBytes} */
  formatSize?: (bytes: number) => string;
  /** Hide the chosen-file list — for when the caller renders its own. @default false */
  hideList?: boolean;
  id?: string;
  name?: string;
  className?: string;
  classNames?: FileDropClasses;
  style?: CSSProperties;
}

const UNITS = ['B', 'KB', 'MB', 'GB'];

/** 1536 → "1.5 KB". */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const exp = Math.min(UNITS.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const n = bytes / 1024 ** exp;
  return `${n >= 10 || exp === 0 ? Math.round(n) : n.toFixed(1)} ${UNITS[exp]}`;
}

/** Match a File against one `accept` token — `.wav`, `audio/*` or an exact type. */
function matchesToken(file: File, token: string): boolean {
  const t = token.trim().toLowerCase();
  if (t === '') return true;
  if (t.startsWith('.')) return file.name.toLowerCase().endsWith(t);
  if (t.endsWith('/*')) return file.type.toLowerCase().startsWith(t.slice(0, -1));
  return file.type.toLowerCase() === t;
}

/**
 * A drop target and file list in one field.
 *
 * Click or press Enter to browse, or drag files onto it. `accept`, `maxSize`
 * and `maxFiles` are enforced on the dropped set too — the browser only
 * applies `accept` to the picker dialog, so dropping is otherwise a hole.
 */
export const GlassFileDrop = forwardRef<HTMLDivElement, GlassFileDropProps>(
  function GlassFileDrop(
    {
      value: valueProp,
      defaultValue = [],
      onChange,
      accept,
      multiple = false,
      maxSize,
      maxFiles,
      onReject,
      label,
      hint,
      error,
      required,
      requiredMark,
      disabled = false,
      prompt,
      terms,
      icons,
      renderFile,
      formatSize = formatBytes,
      hideList = false,
      id,
      name,
      className,
      classNames,
      style,
    },
    ref,
  ) {
    const inputRef = useRef<HTMLInputElement>(null);
    const zoneRef = useRef<HTMLDivElement>(null);
    const [over, setOver] = useState(false);
    const [refusal, setRefusal] = useState<string | null>(null);
    // dragenter/dragleave fire for every child element; counting keeps the
    // highlight from flickering as the pointer crosses the file list.
    const depth = useRef(0);

    const [value, setValue] = useControllableState<readonly File[]>(
      valueProp,
      defaultValue,
      onChange as ((v: readonly File[]) => void) | undefined,
    );

    useImperativeHandle(ref, () => zoneRef.current as HTMLDivElement, []);

    const { id: fieldId, hintId, errorId, describedBy } = useFieldIds(id, hint, error ?? refusal);

    const refuse = useCallback(
      (reason: string, files: File[]) => {
        setRefusal(reason);
        onReject?.(reason, files);
      },
      [onReject],
    );

    const accepted = useCallback(
      (incoming: File[]): File[] => {
        const tokens = accept?.split(',').filter(Boolean);
        const wrongType: File[] = [];
        const tooBig: File[] = [];

        const kept = incoming.filter((file) => {
          if (tokens && !tokens.some((t) => matchesToken(file, t))) {
            wrongType.push(file);
            return false;
          }
          if (maxSize !== undefined && file.size > maxSize) {
            tooBig.push(file);
            return false;
          }
          return true;
        });

        if (wrongType.length > 0) {
          refuse(
            `${wrongType.length === 1 ? `“${wrongType[0]!.name}” is` : `${wrongType.length} files are`} not an accepted type.`,
            wrongType,
          );
          return kept;
        }
        if (tooBig.length > 0) {
          refuse(`Each file must be under ${formatSize(maxSize!)}.`, tooBig);
          return kept;
        }
        return kept;
      },
      [accept, maxSize, refuse, formatSize],
    );

    const take = useCallback(
      (incoming: File[]) => {
        if (disabled || incoming.length === 0) return;
        setRefusal(null);

        const kept = accepted(incoming);
        if (kept.length === 0) return;

        let next = multiple ? [...value, ...kept] : kept.slice(0, 1);
        if (maxFiles !== undefined && next.length > maxFiles) {
          next = next.slice(0, maxFiles);
          refuse(`At most ${maxFiles} ${maxFiles === 1 ? 'file' : 'files'}.`, kept);
        }
        setValue(next);
      },
      [disabled, accepted, multiple, value, maxFiles, refuse, setValue],
    );

    const removeAt = (index: number) => {
      setRefusal(null);
      setValue(value.filter((_, i) => i !== index));
    };

    const browse = () => {
      if (disabled) return;
      inputRef.current?.click();
    };

    const autoTerms =
      accept || maxSize !== undefined
        ? [accept, maxSize !== undefined && `up to ${formatSize(maxSize)}`]
            .filter(Boolean)
            .join(' · ')
        : null;
    const termsText = terms === undefined ? autoTerms : terms;

    return (
      <div
        className={cn(
          'ob-field',
          (error ?? refusal) && 'ob-field--invalid',
          className,
          classNames?.field,
        )}
        style={style}
      >
        {label ? (
          <FieldLabel
            id={fieldId}
            label={label}
            required={required}
            requiredMark={requiredMark}
            className={classNames?.label}
          />
        ) : null}

        <div
          ref={zoneRef}
          id={fieldId}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-disabled={disabled || undefined}
          aria-describedby={describedBy}
          className={cn(
            'ob-drop',
            over && 'ob-drop--over',
            (error ?? refusal) && 'ob-drop--invalid',
            disabled && 'ob-drop--disabled',
            classNames?.zone,
          )}
          onClick={browse}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              browse();
            }
          }}
          onDragEnter={(e) => {
            e.preventDefault();
            depth.current += 1;
            if (!disabled) setOver(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            // Without this the cursor shows "copy" only intermittently.
            e.dataTransfer.dropEffect = disabled ? 'none' : 'copy';
          }}
          onDragLeave={() => {
            depth.current -= 1;
            if (depth.current <= 0) {
              depth.current = 0;
              setOver(false);
            }
          }}
          onDrop={(e) => {
            e.preventDefault();
            depth.current = 0;
            setOver(false);
            take(Array.from(e.dataTransfer.files));
          }}
        >
          <span className={cn('ob-drop__glyph', classNames?.glyph)} aria-hidden="true">
            {icons?.upload ?? '↥'}
          </span>
          <span className={cn('ob-drop__prompt', classNames?.prompt)}>
            {prompt ?? (
              <>
                <strong>Drop {multiple ? 'files' : 'a file'}</strong> or click to browse
              </>
            )}
          </span>
          {termsText ? (
            <span className={cn('ob-drop__terms', classNames?.terms)}>{termsText}</span>
          ) : null}

          <input
            ref={inputRef}
            type="file"
            name={name}
            className="ob-vh"
            tabIndex={-1}
            accept={accept}
            multiple={multiple}
            disabled={disabled}
            required={required && value.length === 0}
            onChange={(e) => {
              take(Array.from(e.target.files ?? []));
              // Reset so re-picking the same file still fires a change.
              e.target.value = '';
            }}
          />
        </div>

        {!hideList && value.length > 0 ? (
          <ul className={cn('ob-drop__files', classNames?.list)}>
            {value.map((file, i) => (
              <li
                key={`${file.name}-${file.lastModified}-${i}`}
                className={cn('ob-drop__file', classNames?.file)}
              >
                {renderFile ? (
                  renderFile({
                    file,
                    index: i,
                    disabled,
                    remove: () => removeAt(i),
                    formatSize,
                  })
                ) : (
                  <>
                    <span className={cn('ob-drop__name', classNames?.name)}>{file.name}</span>
                    <span className={cn('ob-drop__size', classNames?.size)}>
                      {formatSize(file.size)}
                    </span>
                    <button
                      type="button"
                      className={cn('ob-drop__x', 'ob-reset-button', classNames?.remove)}
                      aria-label={`Remove ${file.name}`}
                      disabled={disabled}
                      onClick={() => removeAt(i)}
                    >
                      {icons?.remove ?? '✕'}
                    </button>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : null}

        <FieldNote
          error={error ?? refusal}
          hint={hint}
          errorId={errorId}
          hintId={hintId}
          className={classNames?.note}
        />
      </div>
    );
  },
);
