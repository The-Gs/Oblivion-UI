import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '../lib/cn';
import './GlassTerminal.css';

export interface TerminalLine {
  /** Command text, shown after the prompt. */
  cmd?: string;
  /** Output text under the command. */
  out?: ReactNode;
}

export interface GlassTerminalProps {
  lines: TerminalLine[];
  /** Prompt shown before each command. @default '❯' */
  prompt?: string;
  title?: string;
  /** Type the commands out character by character. @default false */
  typing?: boolean;
  /** Chars per second when `typing`. @default 32 */
  speed?: number;
  className?: string;
}

/** A terminal window with a prompt, command lines, and an optional type-on. */
export function GlassTerminal({
  lines,
  prompt = '❯',
  title,
  typing = false,
  speed = 32,
  className,
}: GlassTerminalProps) {
  // How many lines are fully revealed, and chars typed on the current one.
  const [revealed, setRevealed] = useState(typing ? 0 : lines.length);
  const [typed, setTyped] = useState(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (!typing) {
      setRevealed(lines.length);
      return;
    }
    setRevealed(0);
    setTyped(0);
  }, [typing, lines]);

  useEffect(() => {
    if (!typing || revealed >= lines.length) return;
    const line = lines[revealed]!;
    const cmd = line.cmd ?? '';
    if (typed < cmd.length) {
      timer.current = setTimeout(() => setTyped((n) => n + 1), 1000 / speed);
    } else {
      // Command done: pause, then reveal its output and advance.
      timer.current = setTimeout(() => {
        setRevealed((n) => n + 1);
        setTyped(0);
      }, 350);
    }
    return () => clearTimeout(timer.current);
  }, [typing, revealed, typed, lines, speed]);

  return (
    <div className={cn('ob-term', className)}>
      <div className="ob-term__bar">
        <span className="ob-term__dots" aria-hidden="true">
          <i className="ob-term__d ob-term__d--r" />
          <i className="ob-term__d ob-term__d--y" />
          <i className="ob-term__d ob-term__d--g" />
        </span>
        {title ? <span className="ob-term__title">{title}</span> : null}
      </div>
      <pre className="ob-term__body">
        {lines.map((line, i) => {
          if (typing && i > revealed) return null;
          const isCurrent = typing && i === revealed;
          const cmd = line.cmd ?? '';
          const shown = isCurrent ? cmd.slice(0, typed) : cmd;
          return (
            <div key={i} className="ob-term__line">
              {line.cmd != null ? (
                <div className="ob-term__cmd">
                  <span className="ob-term__prompt">{prompt}</span> {shown}
                  {isCurrent ? <span className="ob-term__cursor" /> : null}
                </div>
              ) : null}
              {line.out != null && (!typing || i < revealed) ? (
                <div className="ob-term__out">{line.out}</div>
              ) : null}
            </div>
          );
        })}
        {!typing || revealed >= lines.length ? (
          <div className="ob-term__cmd">
            <span className="ob-term__prompt">{prompt}</span> <span className="ob-term__cursor" />
          </div>
        ) : null}
      </pre>
    </div>
  );
}
