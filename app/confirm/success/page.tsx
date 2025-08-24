export const dynamic = "force-static";

export default function Page() {
  return (
    <main className="container mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-2xl font-semibold">You’re confirmed 🎉</h1>
      <p className="mt-2 text-slate-600">
        Thanks for confirming your email. You’re officially on the Velah waitlist.
      </p>
      <a href="/" className="mt-6 inline-block rounded-full px-5 py-3 border">
        Back to home
      </a>
    </main>
  );
}
