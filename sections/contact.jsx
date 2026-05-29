/* global React */
const { useState: useStateContact } = React;

function Contact() {
  const [showModal, setShowModal] = useStateContact(false);
  const [sending, setSending] = useStateContact(false);
  const [form, setForm] = useStateContact({ org: "", name: "", email: "", phone: "", message: "" });

  const submit = async (e) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    try {
      const res = await fetch("https://formsubmit.co/ajax/liszzm@lisword.co.kr", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          "기관·회사명": form.org,
          "담당자": form.name,
          "이메일": form.email,
          "연락처": form.phone,
          "문의내용": form.message,
          "_subject": "[리즈워드] 교육 문의가 도착했습니다",
          "_template": "table",
          "_captcha": "false",
        }),
      });
      if (res.ok) {
        if (window.gtag) window.gtag("event", "contact_form_submit", { method: "formsubmit" });
        setShowModal(true);
        setForm({ org: "", name: "", email: "", phone: "", message: "" });
      } else {
        alert("전송에 실패했습니다. 010-9973-0158로 연락 주세요.");
      }
    } catch {
      alert("네트워크 오류가 발생했습니다. 010-9973-0158로 연락 주세요.");
    } finally {
      setSending(false);
    }
  };

  return (
    <React.Fragment>
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
              onSubmit={submit}
            >
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
              <button className="contact-submit" type="submit" disabled={sending}>
                {sending ? "전송 중..." : "교육 문의하기 →"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon">✓</div>
            <h3 className="modal-title">감사합니다 :)</h3>
            <p className="modal-body">
              1일 이내로 연락드리겠습니다.<br/>
              빠른 연락을 원하시면 <strong>010-9973-0158</strong>로 연락 주세요.
            </p>
            <button className="modal-close" onClick={() => setShowModal(false)}>닫기</button>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
window.Contact = Contact;
