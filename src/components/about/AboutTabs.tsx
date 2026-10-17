"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { aboutTabs } from "@/data/portfolio";

type TabId = (typeof aboutTabs)[number]["id"];

/** Now / Exploring / Approach tabs — WAI-ARIA tabs with arrow-key navigation. */
export default function AboutTabs() {
  const [tab, setTab] = useState<TabId>(aboutTabs[0].id);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeIndex = aboutTabs.findIndex((t) => t.id === tab);

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next: number | null = null;
    if (e.key in keys) next = (activeIndex + keys[e.key] + aboutTabs.length) % aboutTabs.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = aboutTabs.length - 1;
    if (next === null) return;
    e.preventDefault();
    setTab(aboutTabs[next].id);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="about-tabs">
      <div className="tablist" role="tablist" aria-label="More about me" onKeyDown={onKeyDown}>
        <span
          className="tab-indicator"
          aria-hidden
          style={{ transform: `translateX(${activeIndex * 100}%)`, width: `${100 / aboutTabs.length}%` }}
        />
        {aboutTabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`about-tab-${t.id}`}
            aria-selected={tab === t.id}
            aria-controls={`about-panel-${t.id}`}
            tabIndex={tab === t.id ? 0 : -1}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {aboutTabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`about-panel-${t.id}`}
          aria-labelledby={`about-tab-${t.id}`}
          hidden={tab !== t.id}
          className="tabpanel"
          tabIndex={0}
        >
          <p>{t.body}</p>
        </div>
      ))}
    </div>
  );
}
