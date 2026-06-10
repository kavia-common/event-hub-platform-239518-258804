"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "@/lib/api/client";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { useAuth } from "@/components/auth/AuthProvider";

export default function RegisterPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.auth.register({ email, password, display_name: displayName || undefined });
      await refresh();
      router.push("/feed");
    } catch (err) {
      setError(api.getErrorMessage(err));
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-xl font-semibold">Create account</h1>
      <p className="mt-1 text-sm text-gray-600">Join your community.</p>

      {error && (
        <div className="mt-4 rounded-lg border border-brand-error/40 bg-white p-4 text-sm text-brand-error">
          {error}
        </div>
      )}

      <form onSubmit={onSubmit} className="mt-4 rounded-xl border bg-white p-5">
        <label className="text-sm font-medium">Email</label>
        <div className="mt-1">
          <TextInput value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </div>

        <label className="mt-4 block text-sm font-medium">Display name (optional)</label>
        <div className="mt-1">
          <TextInput value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
        </div>

        <label className="mt-4 block text-sm font-medium">Password</label>
        <div className="mt-1">
          <TextInput value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </div>

        <Button className="mt-5 w-full" type="submit" disabled={loading}>
          {loading ? "Creating…" : "Create account"}
        </Button>
      </form>
    </div>
  );
}
