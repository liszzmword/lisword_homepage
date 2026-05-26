import { ContactForm } from "@/components/ContactForm";

export function Contact() {
  return (
    <section id="contact" className="bg-bg-2 py-24 md:py-32">
      <div className="mx-auto w-full max-w-[1440px] px-[var(--pad-x)]">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <div className="font-en text-xs uppercase tracking-[0.18em] text-fg-3">
              CONTACT / 07
            </div>
            <h2 className="mt-5 text-4xl font-bold leading-tight tracking-tight md:text-6xl">
              교육이 <em className="text-accent">필요하신가요?</em>
              <br />
              연락 주세요.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-fg-2">
              기관·회사명과 원하시는 교육, 일정·인원을 남겨주세요. 빠르게 회신드리겠습니다.
            </p>
          </div>

          <div className="mt-14">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
