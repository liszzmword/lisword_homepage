import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-en",
  display: "swap",
});

const SITE_URL = "https://lisword.co.kr";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "리즈워드 LISWORD · 기업·학교 AI 교육",
    template: "%s | 리즈워드 LISWORD",
  },
  description:
    "AI 부트캠프와 스킬트레이닝으로 임직원·학생이 실제 문제를 AI로 해결합니다. RAG·데이터 리터러시·바이브 코딩.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: "리즈워드 LISWORD",
    title: "리즈워드 LISWORD · 기업·학교 AI 교육",
    description:
      "AI 부트캠프와 스킬트레이닝으로 임직원·학생이 실제 문제를 AI로 해결합니다.",
  },
  twitter: { card: "summary_large_image" },
  verification: {
    google: "ub7LGK-HluYi5lUNuCj12mv4FHHJSk6V6eFfujHzGT8",
    other: { "naver-site-verification": "691cfe6b9edab1367a8e7f1a8e481181e3a931e8" },
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={spaceGrotesk.variable}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
