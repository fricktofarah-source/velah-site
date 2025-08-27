// app/confirm/success/page.tsx
export const dynamic = "force-static";

export const metadata = {
  title: "You're confirmed | Velah",
  description: "Thanks for confirming your email. You’re officially on the Velah waitlist.",
};

export default function Page() {
  const titleId = "confirm-success-title";
  const descId = "confirm-success-desc";

  return (
    <main className="section">
      <div className="mx-auto max-w-md px-4 sm:px-6">
        <div className="card p-6 sm:p-7 text-center">
          <div className="flex justify-center mb-3">
            <div className="success-check" aria-hidden />
          </div>

          <h1 id={titleId} className="text-2xl font-semibold tracking-tight">
            You’re confirmed 🎉
          </h1>
          <p id={descId} className="mt-2 text-slate-600">
            Thanks for confirming your email. You’re officially on the Velah waitlist.
          </p>

          <div className="mt-6 grid gap-3">
            <a href="/subscription" className="btn btn-primary h-10 w-full rounded-full">
              Explore subscription
            </a>
            <a href="/" className="btn btn-ghost h-10 w-full rounded-full">
              Back to home
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
