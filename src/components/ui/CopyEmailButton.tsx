"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { site } from "@/data/site";
import { copyWithToast } from "@/lib/clipboard";

/** Copies the contact email and confirms with an inline state plus a toast. */
export default function CopyEmailButton({ className, label = "Copy email" }: { className?: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const t = timer;
    return () => window.clearTimeout(t.current);
  }, []);

  const onClick = async () => {
    const ok = await copyWithToast(site.email, `Copied ${site.email}`);
    if (!ok) return;
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <button type="button" className={`copy-btn ${className ?? ""}`} onClick={onClick} data-cursor="copy" data-copied={copied || undefined}>
      {copied ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />}
      <span>{copied ? "Copied" : label}</span>
    </button>
  );
}
