import { tokenStore } from "@/lib/auth/tokenStore";
import type {
  ChatMessage,
  EventDetails,
  EventSummary,
  ModerationReport,
  NotificationItem,
  Paginated,
  UserMe
} from "@/lib/api/types";

function getBaseUrl() {
  const v = process.env.NEXT_PUBLIC_API_BASE_URL;
  // Default to localhost for dev; deployment should set env.
  return v ?? "http://localhost:8000";
}

async function request<T>(
  path: string,
  init?: RequestInit & { json?: unknown; auth?: boolean }
): Promise<T> {
  const url = `${getBaseUrl()}${path}`;
  const headers: Record<string, string> = {
    Accept: "application/json"
  };

  if (init?.json !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const auth = init?.auth ?? true;
  if (auth) {
    const token = tokenStore.get();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    ...init,
    headers: {
      ...headers,
      ...(init?.headers ?? {})
    },
    body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
    cache: "no-store"
  });

  if (!res.ok) {
    // Try to extract structured error
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      msg = data?.detail ?? data?.message ?? msg;
    } catch {
      // ignore
    }
    const err = new Error(msg);
    (err as any).status = res.status;
    throw err;
  }

  // Some endpoints may return no content
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

export const api = {
  getErrorMessage(e: unknown): string {
    if (e instanceof Error) return e.message;
    return "Unexpected error";
  },

  auth: {
    async login(input: { email: string; password: string }) {
      // Expected backend: POST /auth/login -> { access_token }
      const res = await request<{ access_token: string }>("/auth/login", { method: "POST", json: input, auth: false });
      tokenStore.set(res.access_token);
      return res;
    },
    async register(input: { email: string; password: string; display_name?: string }) {
      // Expected backend: POST /auth/register -> { access_token }
      const res = await request<{ access_token: string }>("/auth/register", {
        method: "POST",
        json: input,
        auth: false
      });
      tokenStore.set(res.access_token);
      return res;
    }
  },

  users: {
    async me() {
      // Expected: GET /users/me -> UserMe
      return request<UserMe>("/users/me");
    },
    async updateMe(input: { display_name?: string | null; bio?: string | null }) {
      // Expected: PATCH /users/me -> UserMe
      return request<UserMe>("/users/me", { method: "PATCH", json: input });
    }
  },

  events: {
    async list(params?: Record<string, string | number | undefined>) {
      const qs = new URLSearchParams();
      Object.entries(params ?? {}).forEach(([k, v]) => {
        if (v === undefined) return;
        qs.set(k, String(v));
      });
      const suffix = qs.size ? `?${qs.toString()}` : "";
      // Expected: GET /events -> { items: EventSummary[] }
      return request<Paginated<EventSummary>>(`/events${suffix}`);
    },
    async get(id: string) {
      // Expected: GET /events/{id} -> EventDetails
      return request<EventDetails>(`/events/${id}`);
    },
    async create(input: {
      title: string;
      description: string;
      category: string;
      start_time?: string;
      location_name?: string;
      latitude?: number;
      longitude?: number;
    }) {
      // Expected: POST /events -> { id, ... }
      return request<{ id: string } & EventSummary>("/events", { method: "POST", json: input });
    }
  },

  rsvp: {
    async set(eventId: string, input: { status: "going" | "interested" | "not_going" }) {
      // Expected: PUT /events/{id}/rsvp
      return request<void>(`/events/${eventId}/rsvp`, { method: "PUT", json: input });
    }
  },

  engagement: {
    async like(eventId: string) {
      // Expected: POST /events/{id}/like
      return request<void>(`/events/${eventId}/like`, { method: "POST" });
    },
    async unlike(eventId: string) {
      // Expected: DELETE /events/{id}/like
      return request<void>(`/events/${eventId}/like`, { method: "DELETE" });
    },
    async comment(eventId: string, input: { body: string }) {
      // Expected: POST /events/{id}/comments
      return request<void>(`/events/${eventId}/comments`, { method: "POST", json: input });
    }
  },

  chat: {
    async list(eventId: string, input?: { limit?: number }) {
      const qs = new URLSearchParams();
      if (input?.limit) qs.set("limit", String(input.limit));
      const suffix = qs.size ? `?${qs.toString()}` : "";
      // Expected: GET /events/{id}/chat/messages
      return request<Paginated<ChatMessage>>(`/events/${eventId}/chat/messages${suffix}`);
    },
    async send(eventId: string, input: { body: string }) {
      // Expected: POST /events/{id}/chat/messages
      return request<void>(`/events/${eventId}/chat/messages`, { method: "POST", json: input });
    }
  },

  notifications: {
    async list(input?: { limit?: number }) {
      const qs = new URLSearchParams();
      if (input?.limit) qs.set("limit", String(input.limit));
      const suffix = qs.size ? `?${qs.toString()}` : "";
      // Expected: GET /notifications
      return request<Paginated<NotificationItem>>(`/notifications${suffix}`);
    }
  },

  moderation: {
    async report(input: { target_type: string; target_id: string; reason: string }) {
      // Expected: POST /moderation/reports
      return request<void>("/moderation/reports", { method: "POST", json: input });
    },
    async listReports(input?: { limit?: number }) {
      const qs = new URLSearchParams();
      if (input?.limit) qs.set("limit", String(input.limit));
      const suffix = qs.size ? `?${qs.toString()}` : "";
      // Expected: GET /moderation/reports
      return request<Paginated<ModerationReport>>(`/moderation/reports${suffix}`);
    },
    async resolveReport(reportId: string, input: { action: "resolved" | "dismissed" | string }) {
      // Expected: POST /moderation/reports/{id}/resolve
      return request<void>(`/moderation/reports/${reportId}/resolve`, { method: "POST", json: input });
    }
  },

  admin: {
    async stats() {
      // Expected: GET /admin/stats -> { user_count, event_count, report_count }
      return request<{ user_count: number; event_count: number; report_count: number }>("/admin/stats");
    }
  }
};
