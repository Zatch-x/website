"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Pause, Play } from "lucide-react";
import { processSteps } from "@/data/portfolio";
import { prefersReducedMotion } from "@/lib/gsap";

const STEP_MS = 4500;

/**
 * "How I work" — four steps as tabs. Auto-advances with a progress bar (pausable,
 * pauses on hover/focus, off under reduced motion). Arrow keys move between steps.
 */
export default function ProcessStepper() {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [hold, setHold] = useState(false);
  const [inView, setInView] = useState(false);
  const root = useRef<HTMLElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    setPlaying(!prefersReducedMotion());
    const el = root.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const running = playing && !hold && inView;

  useEffect(() => {
    if (!running) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % processSteps.length), STEP_MS);
    return () => window.clearTimeout(id);
  }, [running, index]);

  const select = (i: number) => {
    setIndex(i);
    tabRefs.current[i]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const n = processSteps.length;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") select((index + 1) % n);
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") select((index - 1 + n) % n);
    else if (e.key === "Home") select(0);
    else if (e.key === "End") select(n - 1);
    else return;
    e.preventDefault();
  };

  const step = processSteps[index];

  return (
    <section
      ref={root}
      className="process-stepper"
      aria-labelledby="process-title"
      onFocus={() => setHold(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHold(false);
      }}
    >
      <div className="wrap ps-grid">
        <div className="ps-head" data-reveal>
          <p className="eyebrow">
            <span className="eyebrow-line" /> How I work
          </p>
          <h2 id="process-title" className="section-title">
            Good work is
            <br />a series of <span className="serif">good decisions.</span>
          </h2>
          <button type="button" className="ps-play" onClick={() => setPlaying((p) => !p)} aria-pressed={!playing}>
            {playing ? <Pause size={14} aria-hidden /> : <Play size={14} aria-hidden />}
            {playing ? "Pause autoplay" : "Play steps"}
          </button>
        </div>

        <div className="ps-body" onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)}>
          <div className="ps-tabs" role="tablist" aria-orientation="vertical" aria-label="Process steps" onKeyDown={onKeyDown}>
            {processSteps.map((s, i) => (
              <button
                key={s.n}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                id={`ps-tab-${s.n}`}
                aria-selected={i === index}
                aria-controls="ps-panel"
                tabIndex={i === index ? 0 : -1}
                className="ps-tab"
                onClick={() => setIndex(i)}
              >
                <span className="ps-tab-n">{s.n}</span>
                <span className="ps-tab-title">{s.title}</span>
                <span className="ps-tab-bar" aria-hidden>
                  {i === index && (
                    <span
                      key={`${index}-${running}`}
                      className="ps-tab-fill"
                      data-running={running || undefined}
                      style={{ animationDuration: `${STEP_MS}ms` }}
                    />
                  )}
                </span>
              </button>
            ))}
          </div>

          <div className="ps-panel" id="ps-panel" role="tabpanel" aria-labelledby={`ps-tab-${step.n}`} aria-live="polite">
            <span className="ps-panel-n" aria-hidden key={`n-${step.n}`}>
              {step.n}
            </span>
            <div className="ps-panel-copy" key={`c-${step.n}`}>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
