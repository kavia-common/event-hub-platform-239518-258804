"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import type { NotificationItem } from "@/lib/api/types";
import { EmptyState } from "@/components/ui/EmptyState";

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.notifications.list({ limit: 50 });
        if (!cancelled) setItems(res.items);
      } catch (e) {
        if (!cancelled) setError(api.getErrorMessage(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-xl font-semibold">Notifications</h1>
      <p className="mt-1 text-sm text-gray-600">Updates about events you follow.</p>

      {loading && <div className="mt-4 rounded-xl border bg-white p-4 text-sm">Loading…</div>}
      {error && (
        <div className="mt-4 rounded-lg border border-brand-error/40 bg-white p-4 text-sm text-brand-error">
          {error}
        </div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="mt-4">
          <EmptyState title="No notifications" description="You're all caught up." />
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-3">
          {items.map((n) => (
            <div key={n.id} className="rounded-xl border bg-white p-4">
              <div className="text-sm font-medium">{n.title ?? n.type}</div>
              <div className="mt-1 text-sm text-gray-700">{n.body}</div>
              <div className="mt-1 text-xs text-gray-500">
                {n.created_at ? new Date(n.created_at).toLocaleString() : ""}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
