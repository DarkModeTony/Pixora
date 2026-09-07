"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { insforge } from "@/lib/insforge";

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  credits?: number;
  plan?: "free" | "basic" | "pro";
  plan_expires_at?: string | null;
  plan_credits_per_month?: number;
}

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchUser = async () => {
    try {
      const { data, error } = await insforge.auth.getCurrentUser();
      if (error || !data?.user) {
        setUser(null);
      } else {
        const u = data.user;
        let credits = 50;
        let plan: "free" | "basic" | "pro" = "free";
        let plan_expires_at: string | null = null;
        let plan_credits_per_month = 25;

        try {
          const { data: dbUser } = await insforge.database
            .from("users")
            .select("credits, name, avatar_url, plan, plan_expires_at, plan_credits_per_month")
            .eq("id", u.id)
            .single();

          if (dbUser) {
            if (dbUser.credits !== undefined) credits = dbUser.credits;
            if (dbUser.plan) plan = dbUser.plan as "free" | "basic" | "pro";
            if (dbUser.plan_expires_at) plan_expires_at = dbUser.plan_expires_at;
            if (dbUser.plan_credits_per_month) plan_credits_per_month = dbUser.plan_credits_per_month;
          }
        } catch {
          // fallback default
        }

        setUser({
          id: u.id,
          email: u.email || "",
          name: (u.profile as { name?: string })?.name || u.email?.split("@")[0],
          avatar_url: (u.profile as { avatar_url?: string })?.avatar_url,
          credits,
          plan,
          plan_expires_at,
          plan_credits_per_month,
        });
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const signOut = async () => {
    await insforge.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signOut,
        refreshUser: fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
