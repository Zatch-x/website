"use client";

import { useEffect, useRef, useState } from "react";

/** Listens for `app:toast` events (see lib/clipboard.ts) and announces them politely. */
export default function Toaster() {
  const [message, setMessage] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const t = timer;
    const onToast = (e: Event) => {
      const detail = (e as CustomEvent<string>).detail;
      setMessage(detail);
      setVisible(true);
      window.clearTimeout(t.current);
      t.current = window.setTimeout(() => setVisible(false), 2600);
    };
    window.addEventListener("app:toast", onToast);
    return () => {
      window.removeEventListener("app:toast", onToast);
      window.clearTimeout(t.current);
    };
  }, []);

  return (
    <div className="toast" data-visible={visible || undefined} role="status" aria-live="polite">
      {message && (
        <>
          <span className="toast-dot" aria-hidden />
          {message}
        </>
      )}
    </div>
  );
}
