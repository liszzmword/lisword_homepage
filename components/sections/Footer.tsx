import { LogoMark } from "@/components/LogoMark";

export function Footer() {
  return (
    <footer className="mx-auto w-full max-w-[1440px] px-[var(--pad-x)] border-t border-line-soft py-10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 font-bold tracking-tight">
          <LogoMark />
          <span>LISWORD · 리즈워드</span>
        </div>
        <div className="font-en text-xs uppercase tracking-[0.18em] text-fg-3">
          © {new Date().getFullYear()} LISWORD. ALL RIGHTS RESERVED · LISWORD.CO.KR
        </div>
      </div>
    </footer>
  );
}
