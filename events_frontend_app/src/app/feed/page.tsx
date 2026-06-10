"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/api/client";
import { EventCard } from "@/components/events/EventCard";
import { FiltersSidebar, type FeedFilters } from "@/components/feed/FiltersSidebar";
import { Tabs } from "@/components/ui/Tabs";
import { EmptyState } from "@/components/ui/EmptyState";
import type { EventSummary } from "@/lib/api/types";

export default function FeedPage() {
  const [filters, setFilters] = useState<FeedFilters>({
    query: "",
    category: "all",
    dateRange: "any",
    distanceKm: 25
  });
  const [activeTab, setActiveTab] = useState<"list" | "map">("list");
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [error, setError] = useState<string | null>(null);

  const params = useMemo(() => {
    return {
      q: filters.query || undefined,
      category: filters.category !== "all" ? filters.category : undefined,
      date_range: filters.dateRange !== "any" ? filters.dateRange : undefined,
      distance_km: filters.distanceKm
    };
  }, [filters]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.events.list(params);
        if (!cancelled) setEvents(res.items);
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
  }, [params]);

  return (
    <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-4 py-4 md:grid-cols-[280px_1fr]">
      <aside className="md:sticky md:top-16 md:h-[calc(100vh-5rem)]">
        <FiltersSidebar value={filters} onChange={setFilters} />
      </aside>

      <main className="flex min-h-[70vh] flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold">Event Feed</h1>
            <p className="text-sm text-gray-600">Browse events near you.</p>
          </div>

          <Link
            href="/events/new"
            className="rounded-md bg-brand-primary px-3 py-2 text-sm font-medium text-white hover:opacity-95"
          >
            Create event
          </Link>
        </div>

        <Tabs
          value={activeTab}
          onChange={setActiveTab}
          tabs={[
            { value: "list", label: "List" },
            { value: "map", label: "Map" }
          ]}
        />

        {loading && <div className="rounded-lg border bg-white p-4 text-sm">Loading events…</div>}

        {error && (
          <div className="rounded-lg border border-brand-error/40 bg-white p-4 text-sm text-brand-error">
            {error}
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <EmptyState title="No events found" description="Try adjusting your filters or creating a new event." />
        )}

        {!loading && !error && activeTab === "list" && (
          <div className="grid grid-cols-1 gap-3">
            {events.map((ev) => (
              <EventCard key={ev.id} event={ev} />
            ))}
          </div>
        )}

        {!loading && !error && activeTab === "map" && (
          <div className="rounded-xl border bg-white p-6">
            <h2 className="text-base font-semibold">Map view</h2>
            <p className="mt-1 text-sm text-gray-600">
              Map provider integration is pending. For now, use the list view to open event details.
            </p>

            <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {events.slice(0, 6).map((ev) => (
                <Link
                  key={ev.id}
                  href={`/events/${ev.id}`}
                  className="rounded-lg border p-3 text-sm hover:bg-gray-50"
                >
                  <div className="font-medium">{ev.title}</div>
                  <div className="text-gray-600">{ev.start_time ? new Date(ev.start_time).toLocaleString() : ""}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
