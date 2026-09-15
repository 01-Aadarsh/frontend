export function LogoBadge({ className = "h-14 w-14" }: { className?: string }) {
  return (
    <img
      src="/logo.png"
      alt="IP-SAKTI Sahayak"
      className={`shrink-0 object-contain ${className}`}
    />
  );
}
