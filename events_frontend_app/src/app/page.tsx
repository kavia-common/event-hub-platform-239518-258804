import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10">
      <div className="rounded-xl border bg-white p-6">
        <h1 className="text-2xl font-semibold">Event Hub</h1>
        <p className="mt-2 text-sm text-gray-600">
          Discover events, RSVP, join event chats, and stay in the loop with notifications.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            className="rounded-md bg-brand-primary px-4 py-2 text-sm font-medium text-white hover:opacity-95"
            href="/feed"
          >
            Open Feed
          </Link>
          <Link
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            href="/auth/login"
          >
            Login
          </Link>
          <Link
            className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            href="/auth/register"
          >
            Create account
          </Link>
        </div>
      </div>
    </main>
  );
}
