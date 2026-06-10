"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api/client";
import { EventForm, type EventFormValues } from "@/components/events/EventForm";

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(values: EventFormValues) {
    setLoading(true);
    setError(null);
    try {
      const created = await api.events.create(values);
      router.push(`/events/${created.id}`);
    } catch (e) {
      setError(api.getErrorMessage(e));
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-xl font-semibold">Create event</h1>
      <p className="mt-1 text-sm text-gray-600">Share an event with your community.</p>

      {error && (
        <div className="mt-4 rounded-lg border border-brand-error/40 bg-white p-4 text-sm text-brand-error">
          {error}
        </div>
      )}

      <div className="mt-4 rounded-xl border bg-white p-4">
        <EventForm mode="create" loading={loading} onSubmit={onSubmit} />
      </div>
    </div>
  );
}
