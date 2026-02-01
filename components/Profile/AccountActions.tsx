// components/Profile/AccountActions.tsx
"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/components/AuthProvider";
import { useLanguage } from "@/components/LanguageProvider";

export default function AccountActions() {
  const router = useRouter();
  const { session } = useAuth();
  const { t } = useLanguage();
  const copy = t.app.profile;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/");
  };

  const handleLogoutAll = async () => {
    await supabase.auth.signOut({ scope: "global" });
    router.replace("/");
  };

  const handleDelete = async () => {
    const sure = window.confirm(copy.deleteConfirm);
    if (!sure) return;

    const token = session?.access_token;
    const res = await fetch("/api/account/delete", {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) {
      alert(copy.statusDeleteFail);
      return;
    }

    await supabase.auth.signOut();
    router.replace("/");
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-3">
      <button onClick={handleLogout} className="btn btn-ghost h-11 w-full rounded-full">
        {copy.logout}
      </button>
      <button onClick={handleLogoutAll} className="btn btn-ghost h-11 w-full rounded-full">
        Sign out everywhere
      </button>
      <button onClick={handleDelete} className="btn btn-ghost h-11 w-full rounded-full text-red-500">
        {copy.delete}
      </button>
    </div>
  );
}
