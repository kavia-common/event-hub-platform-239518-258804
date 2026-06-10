export type Paginated<T> = { items: T[] };

export type UserMe = {
  id: string;
  email: string;
  display_name?: string | null;
  bio?: string | null;
  role?: "user" | "moderator" | "admin" | string;
};

export type EventSummary = {
  id: string;
  title: string;
  description: string;
  category?: string | null;
  start_time?: string | null;
  location_name?: string | null;
  like_count?: number;
  comment_count?: number;
  rsvp_counts?: { going?: number; interested?: number };
};

export type CommentItem = {
  id: string;
  body: string;
  author_display_name?: string | null;
  created_at?: string | null;
};

export type EventDetails = EventSummary & {
  viewer_has_liked?: boolean;
  comments?: CommentItem[];
};

export type NotificationItem = {
  id: string;
  type: string;
  title?: string | null;
  body: string;
  created_at?: string | null;
};

export type ChatMessage = {
  id: string;
  body: string;
  author_display_name?: string | null;
  created_at?: string | null;
};

export type ModerationReport = {
  id: string;
  target_type: string;
  target_id: string;
  reason: string;
  created_at?: string | null;
};
