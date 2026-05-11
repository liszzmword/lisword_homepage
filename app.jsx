/* global React */
const { useState, useEffect, useRef } = React;

// ====== Tagline options (used by Tweaks) ======
const TAGLINES = [
  { id: "solve", main: ["AI로 푸는", "진짜 문제."], desc: "이론 말고 현장. 부트캠프와 스킬트레이닝으로 기업·학교의 실제 문제를 AI로 해결합니다." },
  { id: "field", main: ["현장에서 쓰는", "AI 교육."], desc: "도입이 아닌 활용. 강의실을 나서면 바로 적용 가능한 실무 중심 AI 교육." },
  { id: "now",   main: ["AI, 배워서", "바로 쓴다."], desc: "리터러시부터 RAG, 바이브 코딩까지 — 실무자가 오늘 써먹을 수 있는 AI 교육." },
  { id: "build", main: ["문제를 발견하고", "AI로 만든다."], desc: "AI 부트캠프와 스킬트레이닝, 두 갈래로 조직과 개인의 문제 해결력을 끌어올립니다." },
];

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "tagline": "solve",
  "accent": "#FF6B1A"
}/*EDITMODE-END*/;

// ====== Reveal-on-scroll hook ======
function useReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll(".reveal"));
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!("IntersectionObserver" in window) || reduce) {
      els.forEach((el) => el.classList.add("in"));
      return;
    }
    document.documentElement.classList.add("has-reveal");
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -5% 0px" });
    els.forEach((el) => io.observe(el));
    // Fallback: if nothing has revealed within 600ms, force-show everything.
    const fallback = setTimeout(() => {
      els.forEach((el) => el.classList.add("in"));
    }, 600);
    return () => { io.disconnect(); clearTimeout(fallback); };
  }, []);
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", t.theme === "dark" ? "dark" : "light");
  }, [t.theme]);

  // Apply accent color
  useEffect(() => {
    if (t.accent) document.documentElement.style.setProperty("--accent", t.accent);
  }, [t.accent]);

  useReveal();

  const tagline = TAGLINES.find((x) => x.id === t.tagline) || TAGLINES[0];

  return (
    <>
      <Nav />
      <Hero tagline={tagline} />
      <Programs />
      <Skills />
      <YouTube />
      <Portfolio />
      <Companies />
      <Reviews />
      <Contact />
      <Footer />

      <TweaksPanel title="Tweaks">
        <TweakSection title="테마">
          <TweakRadio
            label="모드"
            value={t.theme}
            onChange={(v) => setTweak("theme", v)}
            options={[
              { value: "light", label: "라이트" },
              { value: "dark", label: "다크" },
            ]}
          />
          <TweakColor
            label="포인트 컬러"
            value={t.accent}
            onChange={(v) => setTweak("accent", v)}
            options={["#FF6B1A", "#F97316", "#EA580C", "#FF8C42"]}
          />
        </TweakSection>
        <TweakSection title="히어로 카피">
          <TweakSelect
            label="태그라인"
            value={t.tagline}
            onChange={(v) => setTweak("tagline", v)}
            options={TAGLINES.map((x) => ({ value: x.id, label: x.main.join(" ") }))}
          />
        </TweakSection>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
