"use client";

import { cn } from "@/lib/ui/cn";

export function Tabs<T extends string>({
  value,
  onChange,
  tabs
}: {
  value: T;
  onChange: (v: T) => void;
  tabs: { value: T; label: string }[];
}) {
  return (
    <div className="flex w-full gap-2 rounded-lg border bg-white p-1">
      {tabs.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={cn(
            "flex-1 rounded-md px-3 py-2 text-sm font-medium transition",
            value === t.value ? "bg-gray-100" : "hover:bg-gray-50"
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
