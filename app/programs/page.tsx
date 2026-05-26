import type { Metadata } from "next";
import { Nav } from "@/components/sections/Nav";
import { Programs } from "@/components/sections/Programs";
import { Skills } from "@/components/sections/Skills";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "프로그램 — AI 부트캠프와 스킬트레이닝",
  description:
    "기업·학교를 위한 AI 부트캠프(2-12주, 1학기)와 네 가지 트랙의 스킬트레이닝(AI 리터러시·데이터 리터러시·RAG·바이브 코딩).",
  alternates: { canonical: "/programs" },
};

export default function ProgramsPage() {
  return (
    <>
      <Nav />
      <main>
        <Programs />
        <Skills />
      </main>
      <Footer />
    </>
  );
}
