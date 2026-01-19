"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppLoader from "@/components/app/AppLoader";

export default function ProfilePage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/app/profile");
  }, [router]);

  return (
    <main className="container mx-auto max-w-2xl px-4 py-12">
      <AppLoader label="Redirecting to your profile" />
    </main>
  );
}
