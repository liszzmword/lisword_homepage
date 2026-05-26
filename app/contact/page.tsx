import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Footer } from "@/components/sections/Footer";
import { Contact } from "@/components/sections/Contact";

export const metadata: Metadata = {
  title: "교육 문의 — 리즈워드 LISWORD",
  description:
    "AI 부트캠프·스킬트레이닝 교육 문의. 기관·회사명, 원하시는 교육, 일정·인원을 남겨주시면 1일 이내로 회신드립니다.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <Contact />
      <Footer />
    </>
  );
}
