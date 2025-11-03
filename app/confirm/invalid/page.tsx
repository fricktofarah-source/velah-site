// app/confirm/invalid/page.tsx
import Link from "next/link";

export const dynamic = "force-static";

export const metadata = {
  title: "Confirmation link invalid | Velah",
  description:
    "This confirmation link is invalid or expired. Request a new confirmation email.",
};

export default function Page() {
  const titleId = "invalid-title";
  const descId = "invalid-desc";

  return (
    <main className="section">
      <div className="mx-auto max-w-md px-4 sm:px-6">
        <div className="card p-6 sm:p-7">
          <h1 id={titleId} className="text-2xl font-semibold tracking-tight">
            Link not valid
          </h1>
          <p id={descId} className="mt-2 text-slate-600">
            This confirmation link is invalid or expired. Request another email below.
          </p>

          {/* Plain HTML form posts directly to the API (works without JS) */}
          <form
            className="mt-5 space-y-3"
            method="post"
            action="/api/resend-confirmation"
            aria-labelledby={titleId}
            aria-describedby={descId}
          >
            <label className="text-sm" htmlFor="email">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="you@example.com"
              className="w-full rounded-2xl border px-3 py-2 focus-ring"
              autoComplete="email"
            />

            <button className="btn btn-primary h-10 w-full rounded-full" type="submit">
              Resend confirmation
            </button>
          </form>

          <Link href="/" className="link-underline inline-flex justify-center mt-4 text-sm font-medium">
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
