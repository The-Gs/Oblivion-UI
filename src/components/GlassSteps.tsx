import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import './GlassSteps.css';

export interface StepItem {
  label: ReactNode;
  description?: ReactNode;
  /** Overrides the auto number/check with your own glyph. */
  icon?: ReactNode;
}

/** Class names for each part of a step. */
export interface StepsSlots {
  step?: string;
  marker?: string;
  label?: string;
  description?: string;
}

export interface GlassStepsProps {
  steps: StepItem[];
  /** Zero-based index of the active step. Earlier steps read as complete. */
  current: number;
  /** @default 'horizontal' */
  orientation?: 'horizontal' | 'vertical';
  /** Makes markers clickable (e.g. to jump back). */
  onStepClick?: (index: number) => void;
  className?: string;
  classNames?: StepsSlots;
}

/** A progress stepper — complete / active / upcoming states with connectors. */
export function GlassSteps({
  steps,
  current,
  orientation = 'horizontal',
  onStepClick,
  className,
  classNames: slots,
}: GlassStepsProps) {
  return (
    <ol className={cn('ob-steps', `ob-steps--${orientation}`, className)}>
      {steps.map((step, i) => {
        const state = i < current ? 'done' : i === current ? 'active' : 'upcoming';
        const clickable = Boolean(onStepClick);
        return (
          <li key={i} className={cn('ob-steps__step', slots?.step)} data-state={state}>
            <div className="ob-steps__rail">
              <button
                type="button"
                className={cn('ob-steps__marker', slots?.marker)}
                disabled={!clickable}
                aria-current={state === 'active' ? 'step' : undefined}
                onClick={clickable ? () => onStepClick!(i) : undefined}
              >
                {step.icon ?? (state === 'done' ? '✓' : i + 1)}
              </button>
              {i < steps.length - 1 ? <span className="ob-steps__line" aria-hidden="true" /> : null}
            </div>
            <div className="ob-steps__text">
              <span className={cn('ob-steps__label', slots?.label)}>{step.label}</span>
              {step.description ? (
                <span className={cn('ob-steps__desc', slots?.description)}>{step.description}</span>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
