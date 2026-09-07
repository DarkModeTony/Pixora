"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { insforge } from "@/lib/insforge";
import { useAuth } from "@/lib/auth-context";
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  RefreshCw,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");

  const [step, setStep] = useState<"signup" | "verify">("signup");
  const [loading, setLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Step 1: Handle User Sign Up
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const redirectOrigin =
        typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

      const { data, error } = await insforge.auth.signUp({
        email,
        password,
        name,
        redirectTo: `${redirectOrigin}/login`,
      });

      if (error) {
        setErrorMessage(error.message || "Sign up failed. Please try again.");
        setLoading(false);
        return;
      }

      // Check email verification method
      if (data?.requireEmailVerification) {
        setStep("verify");
        setSuccessMessage(
          "Verification code sent! Please check your email inbox and enter the 6-digit code below."
        );
      } else if (data?.user) {
        // Automatically save extended user info into public.users
        try {
          await insforge.database.from("users").insert([
            {
              id: data.user.id,
              email: data.user.email,
              name: name || data.user.email?.split("@")[0],
              avatar_url: null,
            },
          ]);
        } catch {
          // Handled by DB trigger or already exists
        }

        await refreshUser();
        setSuccessMessage("Account created successfully! Redirecting...");
        setTimeout(() => {
          router.push("/");
        }, 800);
      }
    } catch (err: unknown) {
      setErrorMessage((err as Error)?.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify 6-digit Email Code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setVerifyLoading(true);

    try {
      const { data, error } = await insforge.auth.verifyEmail({
        email,
        otp: otpCode.trim(),
      });

      if (error) {
        setErrorMessage(error.message || "Invalid verification code. Please check and try again.");
        setVerifyLoading(false);
        return;
      }

      if (data?.user) {
        // Save user to public.users table in database
        try {
          await insforge.database.from("users").insert([
            {
              id: data.user.id,
              email: data.user.email,
              name: name || data.user.email?.split("@")[0],
              avatar_url: null,
            },
          ]);
        } catch {
          // Handled by DB trigger
        }

        await refreshUser();
        setSuccessMessage("Email verified! Welcome to Pixora. Redirecting...");
        setTimeout(() => {
          router.push("/");
        }, 800);
      }
    } catch (err: unknown) {
      setErrorMessage((err as Error)?.message || "Failed to verify code.");
    } finally {
      setVerifyLoading(false);
    }
  };

  // Resend Verification Code
  const handleResendCode = async () => {
    setErrorMessage("");
    setResendLoading(true);
    try {
      const { error } = await insforge.auth.resendVerificationEmail({
        email,
      });
      if (error) {
        setErrorMessage(error.message || "Failed to resend verification code.");
      } else {
        setSuccessMessage("A fresh verification code has been sent to your email.");
      }
    } catch {
      setErrorMessage("Could not resend verification email.");
    } finally {
      setResendLoading(false);
    }
  };

  // Google OAuth Sign Up
  const handleGoogleSignUp = async () => {
    setErrorMessage("");
    setGoogleLoading(true);
    try {
      const redirectOrigin =
        typeof window !== "undefined" ? window.location.origin : "http://localhost:3000";

      await insforge.auth.signInWithOAuth("google", {
        redirectTo: `${redirectOrigin}/auth/callback`,
      });
    } catch (err: unknown) {
      setErrorMessage((err as Error)?.message || "Google authentication failed.");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-[#fafafc] relative overflow-hidden">
      {/* Background ambient gradient glow */}
      <div className="absolute top-0 right-1/4 -z-10 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 -z-10 w-80 h-80 bg-pink-200/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header / Brand */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-pink-500 via-purple-500 to-indigo-500 flex items-center justify-center text-white font-black text-2xl shadow-md shadow-purple-500/20 group-hover:scale-105 transition-transform">
            P
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Pixora
          </span>
        </Link>

        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          {step === "signup" ? "Create your account" : "Verify your email"}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          {step === "signup" ? (
            <>
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-purple-600 hover:text-purple-500 underline underline-offset-4"
              >
                Sign in
              </Link>
            </>
          ) : (
            `Enter the 6-digit verification code sent to ${email}`
          )}
        </p>
      </div>

      {/* Sign Up / Verification Card */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl shadow-slate-900/5 rounded-3xl border border-slate-100">
          {/* Error Message */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-5 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs sm:text-sm flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {step === "signup" ? (
            <>
              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={googleLoading || loading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm shadow-xs hover:shadow-sm transition-all disabled:opacity-60 cursor-pointer"
              >
                {googleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-600" />
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                )}
                <span>Sign up with Google</span>
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-3 text-slate-400 font-semibold tracking-wider">
                    Or with email
                  </span>
                </div>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSignUp} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Morgan"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-full bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-full bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
                  >
                    Password (min. 6 characters)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm rounded-full bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || googleLoading}
                  className="w-full mt-2 py-3 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Email Verification Code Step */
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 text-center"
                >
                  6-Digit Verification Code
                </label>
                <div className="relative mt-2">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    id="otp"
                    type="text"
                    required
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full pl-10 pr-4 py-3 text-center tracking-[0.4em] font-mono text-lg rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-hidden focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={verifyLoading || otpCode.length < 6}
                className="w-full mt-3 py-3 px-4 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {verifyLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>Verify & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                <button
                  type="button"
                  onClick={() => setStep("signup")}
                  className="hover:text-slate-800 underline cursor-pointer"
                >
                  Change email
                </button>
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={resendLoading}
                  className="inline-flex items-center gap-1 text-purple-600 hover:text-purple-700 font-medium cursor-pointer"
                >
                  {resendLoading && <RefreshCw className="w-3 h-3 animate-spin" />}
                  <span>Resend code</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
