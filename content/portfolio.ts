export type PortfolioItem = {
  id: string;
  num: string;
  title: string;
  client: string;
  date: string;
  image: string;
};

export const PORTFOLIO: PortfolioItem[] = [
  {
    id: "skku",
    num: "01",
    title: "AI 부트캠프 — 창업·문제해결 트랙",
    client: "성균관대학교",
    date: "2025",
    image: "/images/skku-ai-bootcamp.jpeg",
  },
  {
    id: "domino",
    num: "02",
    title: "임직원 AI 리터러시 · RAG 워크숍",
    client: "도미노피자",
    date: "2025",
    image: "/images/dominos-rag.jpg",
  },
  {
    id: "plentyn",
    num: "03",
    title: "데이터 리터러시 사내 교육",
    client: "플렌티넷",
    date: "2024",
    image: "/images/plantynet-data-literacy.jpg",
  },
  {
    id: "tjmedia",
    num: "04",
    title: "서비스디자인 부트캠프",
    client: "TJ미디어",
    date: "2025",
    image: "/images/tjmedia-service-design.jpg",
  },
];
