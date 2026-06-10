"use client";

import { TextInput } from "@/components/ui/TextInput";
import { Select } from "@/components/ui/Select";

export type FeedFilters = {
  query: string;
  category: string;
  dateRange: "any" | "today" | "week" | "month";
  distanceKm: number;
};

export function FiltersSidebar({
  value,
  onChange
}: {
  value: FeedFilters;
  onChange: (next: FeedFilters) => void;
}) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <h2 className="text-base font-semibold">Filters</h2>
      <p className="mt-1 text-sm text-gray-600">Refine the feed.</p>

      <label className="mt-4 block text-sm font-medium">Search</label>
      <div className="mt-1">
        <TextInput
          value={value.query}
          onChange={(e) => onChange({ ...value, query: e.target.value })}
          placeholder="e.g. music, tech, volunteering"
        />
      </div>

      <label className="mt-4 block text-sm font-medium">Category</label>
      <div className="mt-1">
        <Select
          value={value.category}
          onChange={(e) => onChange({ ...value, category: e.target.value })}
          options={[
            { value: "all", label: "All" },
            { value: "music", label: "Music" },
            { value: "tech", label: "Tech" },
            { value: "sports", label: "Sports" },
            { value: "community", label: "Community" }
          ]}
        />
      </div>

      <label className="mt-4 block text-sm font-medium">Date</label>
      <div className="mt-1">
        <Select
          value={value.dateRange}
          onChange={(e) => onChange({ ...value, dateRange: e.target.value as FeedFilters["dateRange"] })}
          options={[
            { value: "any", label: "Any time" },
            { value: "today", label: "Today" },
            { value: "week", label: "This week" },
            { value: "month", label: "This month" }
          ]}
        />
      </div>

      <label className="mt-4 block text-sm font-medium">Distance (km)</label>
      <div className="mt-1">
        <TextInput
          type="number"
          min={1}
          max={200}
          value={String(value.distanceKm)}
          onChange={(e) => onChange({ ...value, distanceKm: Number(e.target.value) })}
        />
      </div>

      <div className="mt-4 rounded-lg border bg-gray-50 p-3 text-xs text-gray-600">
        Distance/date filters require backend support; the UI passes these as query params.
      </div>
    </div>
  );
}
