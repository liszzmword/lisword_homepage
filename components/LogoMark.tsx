export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`relative inline-block h-7 w-7 bg-accent ${className}`}
      aria-hidden="true"
    >
      <span
        className="absolute inset-[6px] bg-bg"
        style={{
          clipPath:
            "polygon(0 0, 100% 0, 100% 60%, 60% 60%, 60% 100%, 0 100%)",
        }}
      />
    </span>
  );
}
