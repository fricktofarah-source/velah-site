"use client";

import ProfileForm from "@/components/app/ProfileForm";

export default function ProfilePage() {
  return (
    <main className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Profile</h1>
      <p className="mt-2 text-sm text-slate-500">Manage your contact details and reminders.</p>
      <div className="mt-8">
        <ProfileForm />
      </div>
    </main>
  );
}
