"use client";

import AppHeader from "@/components/app/AppHeader";
import RequireAuth from "@/components/app/RequireAuth";
import ProfileForm from "@/components/app/ProfileForm";

export default function ProfilePage() {
  return (
    <RequireAuth>
      <div className="space-y-6">
        <AppHeader title="Profile" subtitle="Keep your details up to date." />
        <ProfileForm />
      </div>
    </RequireAuth>
  );
}
