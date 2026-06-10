"use client";

import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { TextArea } from "@/components/ui/TextArea";
import { Select } from "@/components/ui/Select";

const schema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  category: z.string().min(1),
  start_time: z.string().optional(),
  location_name: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional()
});

export type EventFormValues = z.infer<typeof schema>;

export function EventForm({
  mode,
  loading,
  initialValues,
  onSubmit
}: {
  mode: "create" | "edit";
  loading?: boolean;
  initialValues?: Partial<EventFormValues>;
  onSubmit: (values: EventFormValues) => void | Promise<void>;
}) {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [category, setCategory] = useState(initialValues?.category ?? "community");
  const [startTime, setStartTime] = useState(initialValues?.start_time ?? "");
  const [locationName, setLocationName] = useState(initialValues?.location_name ?? "");
  const [lat, setLat] = useState<string>(initialValues?.latitude?.toString() ?? "");
  const [lng, setLng] = useState<string>(initialValues?.longitude?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = schema.safeParse({
      title,
      description,
      category,
      start_time: startTime || undefined,
      location_name: locationName || undefined,
      latitude: lat ? Number(lat) : undefined,
      longitude: lng ? Number(lng) : undefined
    });

    if (!parsed.success) {
      setError("Please fill out required fields (title/description) and check your inputs.");
      return;
    }

    await onSubmit(parsed.data);
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      {error && <div className="rounded-lg border border-brand-error/40 bg-white p-3 text-sm text-brand-error">{error}</div>}

      <div>
        <label className="text-sm font-medium">Title</label>
        <div className="mt-1">
          <TextInput value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Description</label>
        <div className="mt-1">
          <TextArea value={description} onChange={(e) => setDescription(e.target.value)} required />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Category</label>
        <div className="mt-1">
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={[
              { value: "community", label: "Community" },
              { value: "music", label: "Music" },
              { value: "tech", label: "Tech" },
              { value: "sports", label: "Sports" }
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Start time (ISO / optional)</label>
          <div className="mt-1">
            <TextInput value={startTime} onChange={(e) => setStartTime(e.target.value)} placeholder="2026-06-10T18:00:00Z" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Location name (optional)</label>
          <div className="mt-1">
            <TextInput value={locationName} onChange={(e) => setLocationName(e.target.value)} placeholder="Downtown Park" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Latitude (optional)</label>
          <div className="mt-1">
            <TextInput value={lat} onChange={(e) => setLat(e.target.value)} placeholder="37.7749" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium">Longitude (optional)</label>
          <div className="mt-1">
            <TextInput value={lng} onChange={(e) => setLng(e.target.value)} placeholder="-122.4194" />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : mode === "create" ? "Create event" : "Save changes"}
      </Button>
    </form>
  );
}
