"use client";

import { useEffect, useState } from "react";
import { site } from "@/data/site";

const formatter = () =>
  new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: site.timeZone });

/** Live local time in India. Renders a stable placeholder on the server to avoid hydration mismatches. */
export default function LocalTime({ className, srLabel = true }: { className?: string; srLabel?: boolean }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const f = formatter();
    const update = () => setTime(f.format(new Date()));
    update();
    const id = window.setInterval(update, 20_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={className} aria-hidden={srLabel ? undefined : true} suppressHydrationWarning>
      {srLabel && <span className="sr-only">Local time in {site.location}: </span>}
      <time aria-hidden={time === null}>{time ?? "--:--"}</time> {site.timeZoneLabel}
    </span>
  );
}
