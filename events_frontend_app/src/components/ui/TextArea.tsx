"use client";

import * as React from "react";
import { cn } from "@/lib/ui/cn";

export function TextArea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-[96px] w-full rounded-md border px-3 py-2 text-sm outline-none",
        "focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20",
        className
      )}
      {...props}
    />
  );
}
