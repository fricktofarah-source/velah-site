// components/JoinWaitlistButton.tsx
"use client";

export default function JoinWaitlistButton({
  className = "btn btn-primary h-11 rounded-full",
  children = "Join the waitlist",
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <button
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent("velah:open-waitlist"))}
    >
      {children}
    </button>
  );
}
