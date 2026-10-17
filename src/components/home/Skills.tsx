"use client";

import { useState } from "react";
import { skillGroups, type SkillGroupId } from "@/data/portfolio";

type Filter = "all" | SkillGroupId;

export default function Skills() {
  const [filter, setFilter] = useState<Filter>("all");
  const total = skillGroups.reduce((n, g) => n + g.items.length, 0);
  const focus = filter !== "all" ? filter : null;

  return (
    <section className="skills section" id="skills" aria-labelledby="skills-title">
      <div className="wrap">
        <div className="section-heading" data-reveal>
          <div>
            <p className="eyebrow">
              <span className="eyebrow-line" /> 03 / My toolkit
            </p>
            <h2 id="skills-title" className="section-title">
              Tools are only
              <br />
              <span className="serif">the beginning.</span>
            </h2>
          </div>
          <p className="section-aside">
            A growing toolkit for building useful things — from the first sketch to the final interaction.
          </p>
        </div>

        <div className="filter-group skills-filters" role="group" aria-label="Highlight a skill area" data-reveal>
          <button type="button" className="filter-chip" aria-pressed={filter === "all"} onClick={() => setFilter("all")}>
            All <sup>{total}</sup>
          </button>
          {skillGroups.map((g) => (
            <button
              key={g.id}
              type="button"
              className="filter-chip"
              aria-pressed={filter === g.id}
              onClick={() => setFilter(filter === g.id ? "all" : g.id)}
            >
              {g.label} <sup>{g.items.length}</sup>
            </button>
          ))}
        </div>

        <div className="skills-grid" data-focus={focus ?? undefined} data-reveal>
          {skillGroups.map((g, i) => (
            <div
              key={g.id}
              className="skill-group"
              data-group={g.id}
              data-dimmed={focus !== null && focus !== g.id ? "true" : undefined}
            >
              <h3>
                <span>{String(i + 1).padStart(2, "0")}</span> {g.label}
              </h3>
              <ul>
                {g.items.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="footnote">
          A working snapshot of technologies I’ve used or explored. My experience continues to grow with each project.
        </p>
      </div>
    </section>
  );
}
