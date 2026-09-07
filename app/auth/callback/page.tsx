"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { insforge } from "@/lib/insforge";
import { useAuth } from "@/lib/auth-context";
import { Loader2, AlertCircle } from "lucide-react";

export default function AuthCallbackPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    async function handleAuth() {
      try {
        const { data, error: userError } = await insforge.auth.getCurrentUser();

        if (userError || !data?.user) {
          setError("Authentication could not be completed. Please try again.");
          return;
        }

        // Save newly logged in Google user to public.users table
        try {
          await insforge.database.from("users").insert([
            {
              id: data.user.id,
              email: data.user.email,
              name: (data.user.profile as { name?: string })?.name || data.user.email?.split("@")[0],
              avatar_url: (data.user.profile as { avatar_url?: string })?.avatar_url,
            },
          ]);
        } catch {
          // Handled by DB trigger or duplicate conflict
        }

        await refreshUser();
        router.replace("/");
      } catch (err: unknown) {
        setError((err as Error)?.message || "OAuth exchange failed.");
      }
    }

    handleAuth();
  }, [router, refreshUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafc] px-4">
      <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-slate-100 max-w-sm w-full">
        {error ? (
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-sm font-semibold text-rose-700">{error}</p>
            <button
              onClick={() => router.push("/login")}
              className="mt-4 px-5 py-2 rounded-full bg-slate-900 text-white text-xs font-semibold"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              Completing authentication...
            </h3>
            <p className="text-xs text-slate-500">
              Please wait while we log you into Pixora.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
