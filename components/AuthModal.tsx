"use client";

import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { useAuth } from "./AuthProvider";
import { supabase } from "@/lib/supabaseClient";

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
  initialMode: "signup" | "signin";
};

export default function AuthModal({ open, onClose, initialMode }: AuthModalProps) {
  const { refresh: refreshAuth } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const isSignup = mode === "signup";

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignup) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
            },
          },
        });
        if (signUpError) throw signUpError;
        alert("Check your email for the confirmation link!");
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
      }
      onClose();
      refreshAuth();
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
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
            setError(null);
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
                <form onSubmit={handleAuth} className="space-y-4">
                  <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                    {isSignup ? "Sign Up" : "Sign In"}
                  </Dialog.Title>

                  {error && (
                    <div className="text-red-500 text-sm">
                      {error}
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
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-velah sm:text-sm sm:leading-6"
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
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-velah sm:text-sm sm:leading-6"
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
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-velah sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete={isSignup ? "new-password" : "current-password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-velah sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 justify-center rounded-md bg-velah px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm transition-all hover:brightness-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-velah"
                    >
                      {loading ? "Loading..." : isSignup ? "Sign Up" : "Sign In"}
                    </button>
                  </div>

                  <div className="text-center text-sm text-gray-500">
                    {isSignup ? (
                      <>
                        Already have an account?{" "}
                        <button
                          type="button"
                          className="font-semibold leading-6 text-velah transition-all hover:brightness-90"
                          onClick={() => setMode("signin")}
                        >
                          Sign In
                        </button>
                      </>
                    ) : (
                      <>
                        Don't have an account?{" "}
                        <button
                          type="button"
                          className="font-semibold leading-6 text-velah transition-all hover:brightness-90"
                          onClick={() => setMode("signup")}
                        >
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
