"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/ui/cn";
import { useAuth } from "@/components/auth/AuthProvider";
import { Button } from "@/components/ui/Button";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const nav = [
    { href: "/feed", label: "Feed" },
    { href: "/notifications", label: "Notifications" },
    { href: "/moderation", label: "Moderation" },
    { href: "/admin", label: "Admin" }
  ];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/feed" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-brand-primary" />
            <span className="text-sm font-semibold">Event Hub</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => {
              const active = pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-50",
                    active && "bg-gray-100"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <Link href="/profile" className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50">
                  {user.display_name ?? "Profile"}
                </Link>
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50" href="/auth/login">
                  Login
                </Link>
                <Link className="rounded-md bg-brand-primary px-3 py-2 text-sm font-medium text-white" href="/auth/register">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {children}

      <footer className="mt-10 border-t bg-white">
        <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-gray-500">
          Event Hub Platform — frontend scaffold. Map + realtime notifications can be upgraded once backend supports it.
        </div>
      </footer>
    </div>
  );
}
