import { Children, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import { useControllableState } from '../lib/hooks';
import './GlassCarousel.css';

export interface GlassCarouselProps {
  children: ReactNode;
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  /** Wrap around at the ends. @default true */
  loop?: boolean;
  /** Prev/next arrows. @default true */
  arrows?: boolean;
  /** Dot indicators. @default true */
  dots?: boolean;
  className?: string;
  'aria-label'?: string;
}

/** A one-slide-at-a-time carousel with arrows and dots. */
export function GlassCarousel({
  children,
  index,
  defaultIndex,
  onIndexChange,
  loop = true,
  arrows = true,
  dots = true,
  className,
  'aria-label': ariaLabel = 'Carousel',
}: GlassCarouselProps) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const [active, setActive] = useControllableState(index, defaultIndex ?? 0, onIndexChange);
  const at = Math.min(active, count - 1);

  const go = (next: number) => {
    if (next < 0) setActive(loop ? count - 1 : 0);
    else if (next >= count) setActive(loop ? 0 : count - 1);
    else setActive(next);
  };

  return (
    <div className={cn('ob-carousel', className)} role="group" aria-roledescription="carousel" aria-label={ariaLabel}>
      <div className="ob-carousel__viewport">
        <div className="ob-carousel__track" style={{ transform: `translateX(-${at * 100}%)` }}>
          {slides.map((slide, i) => (
            <div className="ob-carousel__slide" key={i} aria-hidden={i !== at} role="group" aria-roledescription="slide">
              {slide}
            </div>
          ))}
        </div>
      </div>

      {arrows && count > 1 ? (
        <>
          <button type="button" className="ob-carousel__arrow ob-carousel__arrow--prev" aria-label="Previous slide" onClick={() => go(at - 1)} disabled={!loop && at === 0}>‹</button>
          <button type="button" className="ob-carousel__arrow ob-carousel__arrow--next" aria-label="Next slide" onClick={() => go(at + 1)} disabled={!loop && at === count - 1}>›</button>
        </>
      ) : null}

      {dots && count > 1 ? (
        <div className="ob-carousel__dots">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              className="ob-carousel__dot"
              data-active={i === at}
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === at}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
