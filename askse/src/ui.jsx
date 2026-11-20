import { useEffect, useRef } from "react";

const PATHS = {
  chat: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  list: "M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01",
  lock: "M5 11h14v10H5zM8 11V7a4 4 0 0 1 8 0v4",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  info: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zM12 16v-4M12 8h.01",
  send: "M22 2 11 13M22 2l-7 20-4-9-9-4z",
  moon: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z",
  sun: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4",
  trash: "M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14",
  up: "M7 10v11H3V10zM7 10l4-8a3 3 0 0 1 3 3v4h6a2 2 0 0 1 2 2l-1.5 8a2 2 0 0 1-2 1.7H7",
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3",
  reset: "M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5",
  plus: "M12 5v14M5 12h14",
};

export function Icon({ name, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      <path d={PATHS[name]} />
    </svg>
  );
}

// AskSE logo: a speech bubble with a highlighted line of text.
export function Logo({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="AskSE logo">
      <rect width="64" height="64" rx="14" fill="#0b5d4f" />
      <path d="M14 18h36a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H30l-10 9v-9h-6a4 4 0 0 1-4-4V22a4 4 0 0 1 4-4z" fill="#fff" />
      <rect x="18" y="26" width="28" height="6" rx="3" fill="#ffe14d" />
      <rect x="18" y="35" width="16" height="3" rx="1.5" fill="#0b5d4f" />
    </svg>
  );
}

export function ConfirmDialog({ title, body, confirmLabel, onConfirm, onCancel }) {
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.focus();
    const onKey = (e) => e.key === "Escape" && onCancel();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);
  return (
    <div className="overlay" onClick={onCancel}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="dlg-title" onClick={(e) => e.stopPropagation()}>
        <h2 id="dlg-title">{title}</h2>
        {body && <p>{body}</p>}
        <div className="dialog-actions">
          <button ref={ref} className="btn ghost" onClick={onCancel}>Cancel</button>
          <button className="btn danger" onClick={onConfirm}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
