"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api/client";
import type { UserMe } from "@/lib/api/types";
import { tokenStore } from "@/lib/auth/tokenStore";

type AuthContextValue = {
  user: UserMe | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserMe | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const token = tokenStore.get();
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const me = await api.users.me();
      setUser(me);
    } catch {
      // Token may be invalid/expired; clear local token to avoid loops.
      tokenStore.clear();
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    tokenStore.clear();
    setUser(null);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      refresh,
      logout
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
