export function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border px-2 py-0.5 text-xs font-medium">
      {children}
    </span>
  );
}
