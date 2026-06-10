"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import type { ModerationReport } from "@/lib/api/types";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

export default function ModerationPage() {
  const [items, setItems] = useState<ModerationReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.moderation.listReports({ limit: 50 });
      setItems(res.items);
    } catch (e) {
      setError(api.getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function resolve(id: string) {
    try {
      await api.moderation.resolveReport(id, { action: "resolved" });
      await load();
    } catch (e) {
      setError(api.getErrorMessage(e));
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-xl font-semibold">Moderation</h1>
      <p className="mt-1 text-sm text-gray-600">Review user reports and take action.</p>

      {loading && <div className="mt-4 rounded-xl border bg-white p-4 text-sm">Loading…</div>}
      {error && (
        <div className="mt-4 rounded-lg border border-brand-error/40 bg-white p-4 text-sm text-brand-error">{error}</div>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="mt-4">
          <EmptyState title="No reports" description="There are no open reports right now." />
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-3">
          {items.map((r) => (
            <div key={r.id} className="rounded-xl border bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium">
                    {r.target_type}:{r.target_id}
                  </div>
                  <div className="mt-1 text-sm text-gray-700">{r.reason}</div>
                  <div className="mt-1 text-xs text-gray-500">
                    {r.created_at ? new Date(r.created_at).toLocaleString() : ""}
                  </div>
                </div>

                <Button variant="outline" onClick={() => resolve(r.id)}>
                  Mark resolved
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
