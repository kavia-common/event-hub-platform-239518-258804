"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";

type AdminStats = {
  user_count?: number;
  event_count?: number;
  report_count?: number;
};

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setError(null);
      try {
        const res = await api.admin.stats();
        if (!cancelled) setStats(res);
      } catch (e) {
        if (!cancelled) setError(api.getErrorMessage(e));
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-xl font-semibold">Admin</h1>
      <p className="mt-1 text-sm text-gray-600">Platform overview and management.</p>

      {error && (
        <div className="mt-4 rounded-lg border border-brand-error/40 bg-white p-4 text-sm text-brand-error">
          {error}
        </div>
      )}

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-4">
          <div className="text-xs text-gray-500">Users</div>
          <div className="mt-1 text-2xl font-semibold">{stats?.user_count ?? "—"}</div>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <div className="text-xs text-gray-500">Events</div>
          <div className="mt-1 text-2xl font-semibold">{stats?.event_count ?? "—"}</div>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <div className="text-xs text-gray-500">Open reports</div>
          <div className="mt-1 text-2xl font-semibold">{stats?.report_count ?? "—"}</div>
        </div>
      </div>

      <div className="mt-6 rounded-xl border bg-white p-4 text-sm text-gray-700">
        Admin management screens can be extended here (user management, event takedowns, audits).
      </div>
    </div>
  );
}
