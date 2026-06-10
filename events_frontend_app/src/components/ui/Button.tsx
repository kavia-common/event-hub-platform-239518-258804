"use client";

import * as React from "react";
import { cn } from "@/lib/ui/cn";

export function Button({
  className,
  variant = "default",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variant === "default" && "bg-brand-primary text-white hover:opacity-95",
        variant === "outline" && "border bg-white hover:bg-gray-50",
        variant === "ghost" && "bg-transparent hover:bg-gray-100",
        className
      )}
      {...props}
    />
  );
}
