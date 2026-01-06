"use client";

import AppHeader from "@/components/app/AppHeader";
import RequireAuth from "@/components/app/RequireAuth";
import ProfileForm from "@/components/app/ProfileForm";
import { useLanguage } from "@/components/LanguageProvider";

export default function ProfilePage() {
  const { t } = useLanguage();
  const copy = t.app.profile;
  return (
    <RequireAuth>
      <div className="space-y-6">
        <AppHeader title={copy.title} subtitle={copy.subtitle} />
        <ProfileForm />
      </div>
    </RequireAuth>
  );
}
