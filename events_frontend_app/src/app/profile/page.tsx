"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api/client";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/TextInput";
import { useAuth } from "@/components/auth/AuthProvider";

export default function ProfilePage() {
  const { user, refresh } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setDisplayName(user.display_name ?? "");
      setBio(user.bio ?? "");
    }
  }, [user]);

  async function save() {
    setSaving(true);
    setError(null);
    try {
      await api.users.updateMe({ display_name: displayName || null, bio: bio || null });
      await refresh();
    } catch (e) {
      setError(api.getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-6">
      <h1 className="text-xl font-semibold">Profile</h1>
      <p className="mt-1 text-sm text-gray-600">Manage your account details.</p>

      {!user && (
        <div className="mt-4 rounded-xl border bg-white p-4 text-sm text-gray-600">Please login to edit your profile.</div>
      )}

      {user && (
        <div className="mt-4 rounded-xl border bg-white p-5">
          {error && (
            <div className="mb-4 rounded-lg border border-brand-error/40 bg-white p-4 text-sm text-brand-error">
              {error}
            </div>
          )}

          <label className="text-sm font-medium">Display name</label>
          <div className="mt-1">
            <TextInput value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>

          <label className="mt-4 block text-sm font-medium">Bio</label>
          <div className="mt-1">
            <TextInput value={bio} onChange={(e) => setBio(e.target.value)} />
          </div>

          <Button className="mt-5" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      )}
    </div>
  );
}
