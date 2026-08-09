import { cn } from '../src/lib/cn';

/** Shared ObsidianUI lockup — glyph tile plus wordmark. */
export function Wordmark({ large = false }: { large?: boolean }) {
  return (
    <div className="pg-mark">
      <div className={cn('pg-mark__glyph', large && 'pg-mark__glyph--lg')} aria-hidden="true">
        O
      </div>
      {!large ? (
        <strong className="pg-mark__text">
          Obsidian<em>UI</em>
        </strong>
      ) : null}
    </div>
  );
}
