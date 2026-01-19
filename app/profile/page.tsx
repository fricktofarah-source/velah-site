"use client";

import { useState } from "react";
import AuthModal from "@/components/AuthModal";
import ProfileForm from "@/components/ProfileForm";
import AppLoader from "@/components/AppLoader";
import { useAuth } from "@/components/AuthProvider";

type ProfileUser = {
  id: string;
  email?: string | null;
  full_name?: string | null;
};

export default function ProfilePage() {
  const { status, user, error, refresh } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signup" | "signin">("signin");
  const profileUser: ProfileUser | null = user
    ? {
        id: user.id,
        email: user.email,
        full_name: (user.user_metadata?.full_name as string) || null,
      }
    : null;

  return (
    <main className="container mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Profile</h1>
      <p className="mt-2 text-sm text-slate-500">Manage your contact details and reminders.</p>

      <div className="mt-8">
        {status === "loading" ? (
          <AppLoader label="Loading profile" />
        ) : status === "error" ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
            <p className="text-sm text-slate-600">Could not load your profile.</p>
            {error ? <p className="text-xs text-slate-500">{error}</p> : null}
            <button onClick={refresh} className="btn btn-primary h-10 rounded-full px-4">
              Retry
            </button>
          </div>
        ) : profileUser ? (
          <ProfileForm user={profileUser} />
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
            <p className="text-sm text-slate-600">Sign in to manage your profile.</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setAuthMode("signin");
                  setAuthOpen(true);
                }}
                className="btn btn-primary h-10 rounded-full px-4"
              >
                Sign in
              </button>
              <button
                onClick={() => {
                  setAuthMode("signup");
                  setAuthOpen(true);
                }}
                className="btn btn-ghost h-10 rounded-full px-4"
              >
                Create account
              </button>
            </div>
          </div>
        )}
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialMode={authMode} />
    </main>
  );
}
