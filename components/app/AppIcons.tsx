export function HomeIcon({ active: _active }: { active?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
    >
      <path d="M4 11.5 12 5l8 6.5" />
      <path d="M6.5 10.5V19a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-8.5" />
      <path d="M10 19v-5h4v5" stroke={active ? "currentColor" : "currentColor"} />
    </svg>
  );
}

export function DropletIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 3C8.5 8 6 10.8 6 14a6 6 0 0 0 12 0c0-3.2-2.5-6-6-11Z" />
    </svg>
  );
}

export function BoxIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3.5 7.5 12 3l8.5 4.5-8.5 4.5-8.5-4.5Z" />
      <path d="M3.5 7.5V16.5L12 21l8.5-4.5V7.5" />
      <path d="M12 12v9" />
    </svg>
  );
}

export function LoopIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 8a6 6 0 0 1 10.4-3.9" />
      <path d="M18 6V3h-3" />
      <path d="M18 16a6 6 0 0 1-10.4 3.9" />
      <path d="M6 18v3h3" />
    </svg>
  );
}

export function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </svg>
  );
}
