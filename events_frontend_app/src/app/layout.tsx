import "./globals.css";
import type { Metadata } from "next";
import { AppShell } from "@/components/shell/AppShell";
import { AuthProvider } from "@/components/auth/AuthProvider";

export const metadata: Metadata = {
  title: "Event Hub",
  description: "Discover, create, and engage with local events."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppShell>{children}</AppShell>
        </AuthProvider>
      </body>
    </html>
  );
}
