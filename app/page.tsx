import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Programs } from "@/components/sections/Programs";
import { Skills } from "@/components/sections/Skills";
import { Youtube } from "@/components/sections/Youtube";
import { Portfolio } from "@/components/sections/Portfolio";
import { Companies } from "@/components/sections/Companies";
import { Reviews } from "@/components/sections/Reviews";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "리즈워드 LISWORD",
  alternateName: ["LISWORD", "리즈워드"],
  url: "https://lisword.co.kr",
  logo: "https://lisword.co.kr/favicon.svg",
  description:
    "기업·학교 대상 AI 교육 회사. 부트캠프와 스킬트레이닝(AI 리터러시, 데이터 리터러시, RAG, 바이브 코딩)을 운영합니다.",
  email: "liszzm@lisword.co.kr",
  telephone: "+82-10-9973-0158",
  sameAs: ["https://www.youtube.com/@lisword"],
  founder: {
    "@type": "Person",
    name: "이인섭",
    alternateName: "Lee Inseop",
    jobTitle: "AI 교육 강사 · 서비스디자인 박사",
    alumniOf: { "@type": "CollegeOrUniversity", name: "성균관대학교" },
  },
};

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
      />
      <Nav />
      <main>
        <Hero />
        <Programs />
        <Skills />
        <Youtube />
        <Portfolio />
        <Companies />
        <Reviews />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
