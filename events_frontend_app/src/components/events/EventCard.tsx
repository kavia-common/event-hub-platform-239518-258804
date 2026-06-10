import Link from "next/link";
import type { EventSummary } from "@/lib/api/types";

export function EventCard({ event }: { event: EventSummary }) {
  return (
    <Link href={`/events/${event.id}`} className="rounded-xl border bg-white p-4 hover:bg-gray-50">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-base font-semibold">{event.title}</div>
          <div className="mt-1 text-sm text-gray-600 line-clamp-2">{event.description}</div>
          <div className="mt-2 text-xs text-gray-500">
            {event.start_time ? new Date(event.start_time).toLocaleString() : "TBD"}
            {event.location_name ? ` • ${event.location_name}` : ""}
          </div>
        </div>
        <div className="rounded-md bg-gray-100 px-2 py-1 text-xs text-gray-700">{event.category ?? "Event"}</div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-600">
        <span className="rounded-full bg-gray-100 px-2 py-1">Likes: {event.like_count ?? 0}</span>
        <span className="rounded-full bg-gray-100 px-2 py-1">Comments: {event.comment_count ?? 0}</span>
        <span className="rounded-full bg-gray-100 px-2 py-1">Going: {event.rsvp_counts?.going ?? 0}</span>
      </div>
    </Link>
  );
}
