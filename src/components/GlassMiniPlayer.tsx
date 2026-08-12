import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import './GlassMiniPlayer.css';

export interface GlassMiniPlayerProps {
  title: ReactNode;
  artist?: ReactNode;
  /** Artwork node — an <img>, an emoji, a coloured block. */
  artwork?: ReactNode;
  /** Playback position 0…1. */
  progress?: number;
  /** Elapsed / total labels. */
  elapsed?: string;
  duration?: string;
  playing?: boolean;
  onPlayPause?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  /** Called with 0…1 when the scrubber is clicked. */
  onSeek?: (t: number) => void;
  className?: string;
}

/** A compact music player card — artwork, scrubber, transport controls. */
export function GlassMiniPlayer({
  title,
  artist,
  artwork,
  progress = 0,
  elapsed,
  duration,
  playing = false,
  onPlayPause,
  onPrev,
  onNext,
  onSeek,
  className,
}: GlassMiniPlayerProps) {
  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek) return;
    const r = e.currentTarget.getBoundingClientRect();
    onSeek(Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)));
  };

  return (
    <div className={cn('ob-player', className)}>
      <div className="ob-player__top">
        <div className="ob-player__art">{artwork}</div>
        <div className="ob-player__meta">
          <div className="ob-player__title">{title}</div>
          {artist ? <div className="ob-player__artist">{artist}</div> : null}
        </div>
      </div>

      <div className="ob-player__scrub" onClick={seek}>
        <div className="ob-player__scrub-track" />
        <div className="ob-player__scrub-fill" style={{ width: `${Math.min(1, Math.max(0, progress)) * 100}%` }} />
        <div className="ob-player__scrub-knob" style={{ left: `${Math.min(1, Math.max(0, progress)) * 100}%` }} />
      </div>
      {elapsed || duration ? (
        <div className="ob-player__times">
          <span>{elapsed}</span>
          <span>{duration}</span>
        </div>
      ) : null}

      <div className="ob-player__controls">
        <button type="button" className="ob-player__btn" onClick={onPrev} aria-label="Previous">⏮</button>
        <button type="button" className="ob-player__btn ob-player__btn--play" onClick={onPlayPause} aria-label={playing ? 'Pause' : 'Play'}>
          {playing ? '❚❚' : '►'}
        </button>
        <button type="button" className="ob-player__btn" onClick={onNext} aria-label="Next">⏭</button>
      </div>
    </div>
  );
}
