"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api/client";
import type { EventDetails } from "@/lib/api/types";
import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/TextArea";
import { useAuth } from "@/components/auth/AuthProvider";

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>();
  const eventId = params.id;
  const router = useRouter();
  const { user } = useAuth();

  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionError, setActionError] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await api.events.get(eventId);
      setEvent(res);
    } catch (e) {
      setActionError(api.getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  async function rsvp(status: "going" | "interested" | "not_going") {
    setActionError(null);
    try {
      await api.rsvp.set(eventId, { status });
      await load();
    } catch (e) {
      setActionError(api.getErrorMessage(e));
    }
  }

  async function toggleLike() {
    if (!event) return;
    setActionError(null);
    try {
      if (event.viewer_has_liked) {
        await api.engagement.unlike(eventId);
      } else {
        await api.engagement.like(eventId);
      }
      await load();
    } catch (e) {
      setActionError(api.getErrorMessage(e));
    }
  }

  async function postComment() {
    if (!comment.trim()) return;
    setActionError(null);
    try {
      await api.engagement.comment(eventId, { body: comment.trim() });
      setComment("");
      await load();
    } catch (e) {
      setActionError(api.getErrorMessage(e));
    }
  }

  async function reportEvent() {
    setActionError(null);
    try {
      await api.moderation.report({ target_type: "event", target_id: eventId, reason: "User report from UI" });
      router.push("/moderation");
    } catch (e) {
      setActionError(api.getErrorMessage(e));
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      {loading && <div className="rounded-xl border bg-white p-4 text-sm">Loading…</div>}
      {actionError && (
        <div className="mt-4 rounded-lg border border-brand-error/40 bg-white p-4 text-sm text-brand-error">
          {actionError}
        </div>
      )}

      {event && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_320px]">
          <div className="rounded-xl border bg-white p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-xl font-semibold">{event.title}</h1>
                <p className="mt-1 text-sm text-gray-600">{event.description}</p>
                <div className="mt-3 text-sm text-gray-700">
                  <div>
                    <span className="font-medium">When: </span>
                    {event.start_time ? new Date(event.start_time).toLocaleString() : "TBD"}
                  </div>
                  <div className="mt-1">
                    <span className="font-medium">Where: </span>
                    {event.location_name || "TBD"}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <Button variant="outline" onClick={toggleLike}>
                  {event.viewer_has_liked ? "Unlike" : "Like"} ({event.like_count})
                </Button>

                <Link className="text-sm text-brand-primary hover:underline" href={`/events/${eventId}/chat`}>
                  Open chat
                </Link>
              </div>
            </div>

            <div className="mt-5 border-t pt-4">
              <h2 className="text-base font-semibold">Comments ({event.comment_count})</h2>

              <div className="mt-3 flex flex-col gap-3">
                {(event.comments ?? []).slice(0, 10).map((c) => (
                  <div key={c.id} className="rounded-lg border p-3">
                    <div className="text-sm font-medium">{c.author_display_name ?? "User"}</div>
                    <div className="mt-1 text-sm text-gray-700">{c.body}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <TextArea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={user ? "Write a comment…" : "Login to comment"}
                  disabled={!user}
                />
                <div className="flex justify-end">
                  <Button onClick={postComment} disabled={!user || !comment.trim()}>
                    Post comment
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-xl border bg-white p-5">
            <h2 className="text-base font-semibold">Your RSVP</h2>
            <p className="mt-1 text-sm text-gray-600">Choose your attendance status.</p>

            <div className="mt-4 grid grid-cols-1 gap-2">
              <Button onClick={() => rsvp("going")}>Going</Button>
              <Button variant="outline" onClick={() => rsvp("interested")}>
                Interested
              </Button>
              <Button variant="ghost" onClick={() => rsvp("not_going")}>
                Not going
              </Button>
            </div>

            <div className="mt-6 rounded-lg border bg-gray-50 p-3 text-sm text-gray-700">
              <div>
                <span className="font-medium">Going:</span> {event.rsvp_counts?.going ?? 0}
              </div>
              <div className="mt-1">
                <span className="font-medium">Interested:</span> {event.rsvp_counts?.interested ?? 0}
              </div>
            </div>

            <div className="mt-6 border-t pt-4">
              <h3 className="text-sm font-semibold">Safety</h3>
              <p className="mt-1 text-sm text-gray-600">Report inappropriate events to moderators.</p>
              <Button variant="outline" className="mt-3 w-full" onClick={reportEvent}>
                Report event
              </Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
