"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

type AuthError = { message: string };

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<AuthError | null>;
  signUp: (email: string, password: string) => Promise<AuthError | null>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<AuthError | null>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const supabase = createClient();

  const checkAdmin = async (currentUser: User | null) => {
    if (!currentUser) { setIsAdmin(false); return; }
    try {
      const res = await fetch("/api/user/check-admin");
      const data = await res.json();
      setIsAdmin(data.isAdmin);
    } catch { setIsAdmin(false); }
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      checkAdmin(user);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const u = session?.user ?? null;
        setUser(u);
        checkAdmin(u);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) throw error;
  };

  const signInWithEmail = async (email: string, password: string): Promise<AuthError | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { message: error.message };
    return null;
  };

  const signUp = async (email: string, password: string): Promise<AuthError | null> => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) return { message: error.message };
    return null;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const resetPassword = async (email: string): Promise<AuthError | null> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/recuperar?redirected=true`,
    });
    if (error) return { message: error.message };
    return null;
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signInWithGoogle, signInWithEmail, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
