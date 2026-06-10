"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api/client";
import type { ChatMessage } from "@/lib/api/types";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { useAuth } from "@/components/auth/AuthProvider";

export default function EventChatPage() {
  const params = useParams<{ id: string }>();
  const eventId = params.id;
  const { user } = useAuth();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [body, setBody] = useState("");

  async function load() {
    try {
      const res = await api.chat.list(eventId, { limit: 50 });
      setMessages(res.items);
    } catch (e) {
      setError(api.getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    load();

    // Basic polling; can be upgraded to WebSocket/SSE when backend supports it.
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  async function send() {
    if (!body.trim()) return;
    setError(null);
    try {
      await api.chat.send(eventId, { body: body.trim() });
      setBody("");
      await load();
    } catch (e) {
      setError(api.getErrorMessage(e));
    }
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 px-4 py-6">
      <div>
        <h1 className="text-xl font-semibold">Event chat</h1>
        <p className="text-sm text-gray-600">Messages refresh every few seconds.</p>
      </div>

      {loading && <div className="rounded-xl border bg-white p-4 text-sm">Loading…</div>}
      {error && (
        <div className="rounded-lg border border-brand-error/40 bg-white p-4 text-sm text-brand-error">{error}</div>
      )}

      <div className="flex flex-col gap-2 rounded-xl border bg-white p-4">
        {messages.map((m) => (
          <div key={m.id} className="rounded-lg border p-3">
            <div className="text-sm font-medium">{m.author_display_name ?? "User"}</div>
            <div className="mt-1 text-sm text-gray-700">{m.body}</div>
            <div className="mt-1 text-xs text-gray-500">
              {m.created_at ? new Date(m.created_at).toLocaleString() : ""}
            </div>
          </div>
        ))}
        {messages.length === 0 && <div className="text-sm text-gray-600">No messages yet.</div>}
      </div>

      <div className="rounded-xl border bg-white p-4">
        {!user ? (
          <div className="text-sm text-gray-600">Login to send messages.</div>
        ) : (
          <div className="flex gap-2">
            <TextInput value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write a message…" />
            <Button onClick={send} disabled={!body.trim()}>
              Send
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
