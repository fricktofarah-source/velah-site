"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/lib/supabaseClient";

type Mode = "signup" | "signin" | "reset";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
  initialMode: "signup" | "signin";
};

const inputClass =
  "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-velah sm:text-sm sm:leading-6";
const linkClass = "font-semibold leading-6 text-velah transition-all hover:brightness-90";
const PASSWORD_RULE = "Password must be at least 8 characters and include uppercase, lowercase, and a number.";

function isStrongPassword(value: string) {
  return value.length >= 8 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value);
}

function normalizeError(msg?: string) {
  if (!msg) return "Something went wrong. Please try again.";
  const m = msg.toLowerCase();
  if (m.includes("invalid login credentials")) return "Incorrect email or password.";
  if (m.includes("email not confirmed")) return "Please confirm your email, then sign in.";
  if (m.includes("failed to fetch") || m.includes("network")) return "Network error. Check your connection and try again.";
  return msg;
}

async function postJson(url: string, body: Record<string, unknown>) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string } | null;
  if (!res.ok || !data?.ok) throw new Error(data?.error || "Something went wrong. Please try again.");
}

export default function AuthModal({ open, onClose, initialMode }: AuthModalProps) {
  const { refresh: refreshAuth } = useAuth();
  const [mode, setMode] = useState<Mode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [joinList, setJoinList] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // Pick up the requested mode each time the modal opens
  useEffect(() => {
    if (open) setMode(initialMode);
  }, [open, initialMode]);

  const isSignup = mode === "signup";
  const isReset = mode === "reset";

  const switchMode = (next: Mode) => {
    setMode(next);
    setError(null);
    setNotice(null);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const em = email.trim().toLowerCase();
    if (!/\S+@\S+\.\S+/.test(em)) return setError("Please enter a valid email.");
    if (isSignup && !isStrongPassword(password)) return setError(PASSWORD_RULE);

    setLoading(true);
    try {
      if (isSignup) {
        const name = `${firstName.trim()} ${lastName.trim()}`.trim();
        // Server route creates the user and sends the confirmation email via Resend
        await postJson("/api/auth-signup", { email: em, password, name, joinList });
        setNotice("Account created. Check your email for the confirmation link, then sign in.");
      } else if (isReset) {
        await postJson("/api/auth-reset", { email: em });
        setNotice("If an account exists for that email, we've sent a password reset link.");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email: em, password });
        if (signInError) throw signInError;
        onClose();
        refreshAuth();
      }
    } catch (err: unknown) {
      setError(normalizeError(err instanceof Error ? err.message : undefined));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-[999]"
        initialFocus={emailRef}
        onClose={() => {
          if (!loading) {
            onClose();
            setEmail("");
            setPassword("");
            setFirstName("");
            setLastName("");
            setJoinList(false);
            setError(null);
            setNotice(null);
            setMode(initialMode);
          }
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <form onSubmit={handleAuth} noValidate className="space-y-4">
                  <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                    {isSignup ? "Sign Up" : isReset ? "Reset Password" : "Sign In"}
                  </Dialog.Title>

                  {error && (
                    <div className="text-red-500 text-sm" role="alert">
                      {error}
                    </div>
                  )}
                  {notice && (
                    <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700" role="status">
                      {notice}
                    </div>
                  )}
                  {isSignup && (
                    <>
                      <div>
                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                          First Name
                        </label>
                        <div className="mt-1">
                          <input
                            id="first-name"
                            name="first-name"
                            type="text"
                            autoComplete="given-name"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className={inputClass}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                          Last Name
                        </label>
                        <div className="mt-1">
                          <input
                            id="last-name"
                            name="last-name"
                            type="text"
                            autoComplete="family-name"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        ref={emailRef}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {!isReset && (
                    <div>
                      <div className="flex items-center justify-between">
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                          Password
                        </label>
                        {!isSignup && (
                          <button type="button" className={`text-sm ${linkClass}`} onClick={() => switchMode("reset")}>
                            Forgot password?
                          </button>
                        )}
                      </div>
                      <div className="mt-1">
                        <input
                          id="password"
                          name="password"
                          type="password"
                          autoComplete={isSignup ? "new-password" : "current-password"}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className={inputClass}
                        />
                      </div>
                      {isSignup && <p className="mt-1 text-xs text-gray-500">{PASSWORD_RULE}</p>}
                    </div>
                  )}

                  {isSignup && (
                    <label className="flex items-center gap-2 text-sm text-gray-700 select-none">
                      <input
                        type="checkbox"
                        className="accent-velah"
                        checked={joinList}
                        onChange={(e) => setJoinList(e.target.checked)}
                      />
                      Also join the Velah newsletter
                    </label>
                  )}

                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 justify-center rounded-md bg-velah px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm transition-all hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-velah"
                    >
                      {loading ? "Loading..." : isSignup ? "Sign Up" : isReset ? "Send reset link" : "Sign In"}
                    </button>
                  </div>

                  <div className="text-center text-sm text-gray-500">
                    {isSignup ? (
                      <>
                        Already have an account?{" "}
                        <button type="button" className={linkClass} onClick={() => switchMode("signin")}>
                          Sign In
                        </button>
                      </>
                    ) : isReset ? (
                      <button type="button" className={linkClass} onClick={() => switchMode("signin")}>
                        Back to Sign In
                      </button>
                    ) : (
                      <>
                        Don&apos;t have an account?{" "}
                        <button type="button" className={linkClass} onClick={() => switchMode("signup")}>
                          Sign Up
                        </button>
                      </>
                    )}
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
