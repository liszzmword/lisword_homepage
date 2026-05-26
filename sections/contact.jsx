/* global React */
const { useState: useStateContact } = React;

function Contact() {
  const [sent, setSent] = useStateContact(false);
  const [form, setForm] = useStateContact({ org: "", name: "", email: "", phone: "", message: "" });

  const submit = (e) => {
    // 데모/미리보기에서는 실제 전송을 막고 성공 UI만 보여줌 (preview 환경 한정).
    // 실제 배포된 도메인에서는 그대로 FormSubmit 으로 POST 됨.
    const isPreview = typeof window !== "undefined" &&
      (window.location.protocol === "blob:" || window.location.hostname === "" || window.location.hostname.includes("localhost"));
    if (isPreview) {
      e.preventDefault();
      setSent(true);
      setTimeout(() => setSent(false), 4000);
    }
  };

  return (
    <section className="section contact" id="contact">
      <div className="wrap">
        <div className="contact-inner">
          <div className="reveal contact-head">
            <div className="eyebrow mono">CONTACT / 07</div>
            <h2 className="contact-big">
              교육이 <em>필요하신가요?</em><br/>
              연락 주세요.
            </h2>
            <p className="contact-sub">
              기관·회사명과 원하시는 교육, 일정·인원을 남겨주세요. 빠르게 회신드리겠습니다.
            </p>
          </div>

          <form
            className="contact-form reveal"
            style={{ "--reveal-delay": "120ms" }}
            action="https://formsubmit.co/liszzm@lisword.co.kr"
            method="POST"
            onSubmit={submit}
          >
            {/* FormSubmit 설정: 이메일 알림, 자동 답장 차단, 스팸 필드 */}
            <input type="hidden" name="_subject" value="[리즈워드] 교육 문의가 도착했습니다" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_captcha" value="false" />
            <input type="text" name="_honey" style={{ display: "none" }} />

            <div className="contact-row-2">
              <input
                className="contact-input"
                name="기관·회사명"
                placeholder="기관 · 회사명"
                value={form.org}
                onChange={(e) => setForm({ ...form, org: e.target.value })}
                required
              />
              <input
                className="contact-input"
                name="담당자"
                placeholder="담당자 이름"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div className="contact-row-2">
              <input
                className="contact-input"
                type="email"
                name="이메일"
                placeholder="이메일"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <input
                className="contact-input"
                type="tel"
                name="연락처"
                placeholder="연락처 (예: 010-0000-0000)"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <textarea
              className="contact-textarea"
              name="문의내용"
              placeholder="원하시는 교육과 일정, 인원수를 알려주세요."
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              required
            ></textarea>
            <button className={`contact-submit ${sent ? "sent" : ""}`} type="submit">
              {sent ? "접수되었습니다 ✓" : "교육 문의하기 →"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
window.Contact = Contact;
