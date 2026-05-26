"use client";

import { useState } from "react";

type FormState = { org: string; name: string; email: string; phone: string; message: string };
const INITIAL: FormState = { org: "", name: "", email: "", phone: "", message: "" };

export function ContactForm() {
  const [showModal, setShowModal] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState<FormState>(INITIAL);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      const res = await fetch("https://formsubmit.co/ajax/liszzm@lisword.co.kr", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          "기관·회사명": form.org,
          담당자: form.name,
          이메일: form.email,
          연락처: form.phone,
          문의내용: form.message,
          _subject: "[리즈워드] 교육 문의가 도착했습니다",
          _template: "table",
          _captcha: "false",
        }),
      });
      if (res.ok) {
        setShowModal(true);
        setForm(INITIAL);
      } else {
        alert("전송에 실패했습니다. 010-9973-0158로 연락 주세요.");
      }
    } catch {
      alert("네트워크 오류가 발생했습니다. 010-9973-0158로 연락 주세요.");
    } finally {
      setSending(false);
    }
  };

  const inputCls =
    "w-full border-0 border-b border-line bg-transparent px-0 py-4 text-base text-fg placeholder:text-fg-3 focus:border-accent-ink focus:outline-none";

  return (
    <>
      <form className="flex flex-col gap-6" onSubmit={submit}>
        <div className="grid gap-6 sm:grid-cols-2">
          <input
            className={inputCls}
            name="org"
            placeholder="기관 · 회사명"
            value={form.org}
            onChange={(e) => setForm({ ...form, org: e.target.value })}
            required
          />
          <input
            className={inputCls}
            name="name"
            placeholder="담당자 이름"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <input
            className={inputCls}
            type="email"
            name="email"
            placeholder="이메일"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            className={inputCls}
            type="tel"
            name="phone"
            placeholder="연락처 (예: 010-0000-0000)"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <textarea
          className={`${inputCls} min-h-[120px] resize-y`}
          name="message"
          placeholder="원하시는 교육과 일정, 인원수를 알려주세요."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
        <button
          type="submit"
          disabled={sending}
          className="mx-auto mt-4 inline-flex items-center gap-3 bg-accent-ink px-9 py-5 text-base font-bold text-accent transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
        >
          {sending ? "전송 중..." : "교육 문의하기 →"}
        </button>
      </form>

      {showModal && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-[rgba(20,8,10,0.6)] p-6 animate-modal-fade"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md border border-line-soft bg-bg p-12 pt-12 pb-9 text-center animate-modal-pop"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent text-3xl font-bold leading-none text-accent-ink">
              ✓
            </div>
            <h3 className="text-2xl font-bold tracking-tight">감사합니다 :)</h3>
            <p className="mt-3 text-[15px] leading-relaxed text-fg-2">
              1일 이내로 연락드리겠습니다.
              <br />
              빠른 연락을 원하시면 <strong className="text-fg">010-9973-0158</strong>로 연락 주세요.
            </p>
            <button
              className="mt-7 bg-accent-ink px-8 py-3 text-sm font-semibold text-accent transition-transform hover:-translate-y-0.5"
              onClick={() => setShowModal(false)}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </>
  );
}
