export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-xl border bg-white p-8 text-center">
      <div className="text-base font-semibold">{title}</div>
      {description && <div className="mt-2 text-sm text-gray-600">{description}</div>}
    </div>
  );
}
