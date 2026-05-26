/* global React */
function Reviews() {
  const reviews = [
    {
      body: "이론 위주 강의를 예상했는데, 첫 시간부터 우리 회사의 실제 문제를 들고 와 풀게 했습니다. 교육이 끝난 다음 주부터 결과물이 업무에 적용됐어요.",
      name: "기업 인사·교육 담당자",
      role: "도미노피자 · AI 리터러시 과정",
    },
    {
      body: "학생들이 단순히 AI를 배우는 게 아니라, AI로 자기 문제를 정의하고 푸는 경험을 하게 됐습니다. 창업까지 이어진 팀도 있었어요.",
      name: "대학 산학협력 담당 교수",
      role: "성균관대학교 · 부트캠프",
    },
    {
      body: "비개발자였는데, 마지막 날엔 제가 직접 RAG 데모를 돌리고 있었어요. 어렵지 않게, 그러나 얕지 않게 가르치는 방식이 인상적이었습니다.",
      name: "마케팅팀 매니저",
      role: "플렌티넷 · 스킬트레이닝",
    },
  ];
  return (
    <section className="wrap section" id="reviews">
      <div className="section-head reveal">
        <div>
          <div className="eyebrow mono">REVIEWS / 05</div>
          <h2 className="section-title">수강생들의 <em className="accent">이야기</em>.</h2>
        </div>
        <p className="section-lead">
          교육을 받은 분들이 직접 들려주는 이야기입니다.
        </p>
      </div>

      <div className="reviews-grid reveal">
        {reviews.map((r, i) => (
          <article className="review" key={i}>
            <div className="review-quote-mark">"</div>
            <p className="review-body">{r.body}</p>
            <div className="review-author">
              <div className="review-author-name">{r.name}</div>
              <div className="review-author-role">{r.role}</div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
window.Reviews = Reviews;
