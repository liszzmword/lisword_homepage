export type SkillTrack = {
  slug: string;
  num: string;
  title: string;
  shortDesc: string;
  longDesc: string;
  audience: string;
  bullets: string[];
  faqs: { q: string; a: string }[];
  meta: { title: string; description: string };
};

export const SKILL_TRACKS: SkillTrack[] = [
  {
    slug: "ai-literacy",
    num: "01",
    title: "AI 리터러시",
    shortDesc: "비개발자도 AI를 도구로 쓸 수 있게. 개념부터 실습까지.",
    longDesc:
      "AI 리터러시 트랙은 비개발자 임직원이 ChatGPT, Claude 같은 LLM을 일상 업무 도구로 자유롭게 쓸 수 있도록 합니다. 개념 이해부터 프롬프트 설계, 실무 적용까지 단기 집중형으로 다룹니다.",
    audience: "FOR EVERYONE",
    bullets: [
      "LLM의 동작 원리를 비개발자 눈높이로 이해합니다",
      "프롬프트 엔지니어링 기본 원칙과 패턴을 익힙니다",
      "자기 업무를 AI로 자동화·가속하는 워크플로를 만듭니다",
      "사내 활용 가이드라인을 함께 설계합니다",
    ],
    faqs: [
      {
        q: "비개발자도 따라갈 수 있나요?",
        a: "네. 이 트랙은 비개발자를 정확히 타겟합니다. 코드 한 줄 없이 진행됩니다.",
      },
      {
        q: "교육은 어디서 진행되나요?",
        a: "사내 출강이 기본이며, 온라인·하이브리드도 가능합니다.",
      },
    ],
    meta: {
      title: "AI 리터러시 교육 — 비개발자 임직원용",
      description:
        "비개발자도 ChatGPT·Claude 같은 LLM을 업무에 쓸 수 있게 만드는 단기 집중 교육.",
    },
  },
  {
    slug: "data-literacy",
    num: "02",
    title: "데이터 리터러시",
    shortDesc: "데이터를 읽고, 묻고, 의사결정에 쓰는 법.",
    longDesc:
      "데이터 리터러시 트랙은 의사결정자가 데이터를 읽고, 질문하고, 가설을 검증하는 능력을 키웁니다. 통계 지식이 부족해도 OK — 실제 회사 데이터로 실습합니다.",
    audience: "FOR DECISION MAKERS",
    bullets: [
      "지표를 정의하고 가설을 세우는 방법",
      "데이터 시각화 읽기·만들기 기본",
      "AI 도구로 데이터 분석을 빠르게 하는 법",
      "데이터 기반 의사결정 사례 분석",
    ],
    faqs: [
      {
        q: "통계나 수학을 잘 몰라도 되나요?",
        a: "기본기부터 시작합니다. 수학적 깊이보다 비즈니스 활용에 초점을 둡니다.",
      },
      {
        q: "실습은 어떤 도구로 하나요?",
        a: "엑셀, ChatGPT/Claude의 데이터 분석 기능, 그리고 회사에서 이미 쓰는 BI 도구가 있다면 그것까지 활용합니다.",
      },
    ],
    meta: {
      title: "데이터 리터러시 교육 — 의사결정자용",
      description:
        "의사결정자가 데이터를 읽고 가설을 검증하고 의사결정에 쓰는 법. 통계 기초부터 AI 분석까지.",
    },
  },
  {
    slug: "rag-development",
    num: "03",
    title: "RAG 개발",
    shortDesc: "사내 문서와 LLM을 연결하는 실전 RAG 시스템 구축.",
    longDesc:
      "RAG(Retrieval-Augmented Generation) 트랙은 사내 문서를 LLM과 연결해 동작하는 챗봇·검색 시스템을 만듭니다. 비개발자 매니저부터 개발자까지, 짧은 워크숍 안에 동작하는 RAG를 손에 쥐고 갑니다.",
    audience: "FOR BUILDERS",
    bullets: [
      "임베딩과 벡터 DB의 개념을 실습으로 익힙니다",
      "사내 문서를 청킹·임베딩하는 파이프라인을 만듭니다",
      "Retrieval 품질을 개선하는 패턴(reranking, hybrid search)",
      "운영 단계의 평가·모니터링 기본",
    ],
    faqs: [
      {
        q: "개발 경험이 없어도 되나요?",
        a: "기본 워크숍은 비개발자 매니저도 따라올 수 있도록 설계했습니다. 더 깊은 트랙은 개발자 대상으로 별도 운영합니다.",
      },
      {
        q: "어떤 LLM을 사용하나요?",
        a: "회사가 선호하는 LLM(GPT, Claude, 자체 모델 등)에 맞춰 진행합니다.",
      },
    ],
    meta: {
      title: "RAG 워크숍 — 사내 문서 챗봇 구축",
      description:
        "사내 문서를 LLM과 연결해 동작하는 RAG 챗봇·검색 시스템을 짧은 워크숍으로 만듭니다.",
    },
  },
  {
    slug: "vibe-coding",
    num: "04",
    title: "바이브 코딩",
    shortDesc: "AI와 대화하며 제품을 만든다. 비개발자도 가능합니다.",
    longDesc:
      "바이브 코딩 트랙은 Cursor·Claude Code 같은 AI 코딩 에이전트와 대화하며 실제 제품을 만드는 방법을 다룹니다. 코드 경험이 없어도 AI와 협업해 동작하는 결과물을 만들 수 있습니다.",
    audience: "FOR MAKERS",
    bullets: [
      "AI 코딩 에이전트 사용법과 협업 원칙",
      "아이디어를 동작하는 프로토타입으로 만드는 흐름",
      "디버깅·리팩터링을 AI에게 위임하는 방법",
      "비개발자가 직접 사내 도구를 만든 사례",
    ],
    faqs: [
      {
        q: "프로그래밍 경험이 전혀 없어도 되나요?",
        a: "네. 이 트랙은 비개발자도 동작하는 결과물을 손에 쥐고 가는 것을 목표로 합니다.",
      },
      {
        q: "어떤 결과물을 만들 수 있나요?",
        a: "사내 자동화 도구, 데이터 처리 스크립트, 간단한 웹앱·랜딩페이지 등. 회사 상황에 맞춰 설계합니다.",
      },
    ],
    meta: {
      title: "바이브 코딩 교육 — AI와 함께 만든다",
      description:
        "Cursor·Claude Code 같은 AI 에이전트와 대화하며 실제 제품을 만드는 비개발자 친화 교육.",
    },
  },
];
