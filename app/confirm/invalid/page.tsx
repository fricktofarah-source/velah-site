export const dynamic = "force-static";

export default function Page() {
  return (
    <main className="container mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-semibold">Link not valid</h1>
      <p className="mt-2 text-slate-600">
        This confirmation link is invalid or expired. You can request another email below.
      </p>

      {/* Plain HTML form posts directly to the API (works without JS) */}
      <form
        className="mt-6 flex gap-3"
        method="post"
        action="/api/resend-confirmation"
      >
        <input
          type="email"
          name="email"
          required
          placeholder="your@email.com"
          className="flex-1 rounded-2xl border px-3 py-2"
        />
        <button className="rounded-full border px-5 py-2">Resend</button>
      </form>

      <a href="/" className="mt-6 inline-block rounded-full px-5 py-3 border">
        Back to home
      </a>
    </main>
  );
}
