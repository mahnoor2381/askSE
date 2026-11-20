import { useEffect, useRef, useState } from "react";
import { MSG, LIMITS, SUGGESTIONS } from "./config";
import { askSE } from "./llm";
import { Icon, ConfirmDialog } from "./ui";
import { fmtTime, uid } from "./utils";

export default function Chat({ faqs, messages, urdu, setUrdu, onExchange, onFeedback, onClear, onCite }) {
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(null); // question currently being answered
  const [error, setError] = useState("");
  const [confirmClear, setConfirmClear] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, pending]);

  const len = input.length;
  const tooLong = len > LIMITS.msgMax;

  async function send(override) {
    if (pending) return;
    const text = typeof override === "string" ? override : input;
    const trimmed = text.trim();
    if (trimmed.length < 1 || text.length > LIMITS.msgMax) {
      setError(MSG.badLength); // M2: nothing is sent
      return;
    }
    setError("");
    setPending(trimmed);
    try {
      const r = await askSE(trimmed, faqs, urdu);
      const now = Date.now();
      onExchange(
        { id: uid(), role: "user", text: trimmed, ts: now },
        { id: uid(), role: "bot", text: r.found ? r.answer : MSG.notFound, found: r.found, ids: r.ids, ts: Date.now(), feedback: null }
      );
      setInput("");
    } catch {
      setError(MSG.aiFailure); // M8: typed message stays in the box, chat stays visible
    } finally {
      setPending(null);
    }
  }

  function onKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  return (
    <section className="chat">
      <div className="chat-top">
        <p className="notice"><Icon name="info" size={16} /> <span>{MSG.notice}</span></p>
        <div className="chat-tools">
          <label className="switch" title="Reply in Urdu script when the question is in Urdu">
            <input type="checkbox" checked={urdu} onChange={(e) => setUrdu(e.target.checked)} />
            <span className="track" aria-hidden="true" />
            <span>Urdu script replies</span>
          </label>
          <button className="btn ghost small" onClick={() => setConfirmClear(true)}>
            <Icon name="trash" size={16} /> Clear chat
          </button>
        </div>
      </div>

      <div className="messages" aria-live="polite">
        {messages.length === 0 && !pending && (
          <div className="welcome">
            <h2>Ask the department office, minus the queue.</h2>
            <p>Lab hours, attendance, retakes, fees, buses. I only answer from the department FAQ, and I tell you when I can't. Urdu ya Roman Urdu mein bhi poochh sakte hain.</p>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`msg ${m.role}`}>
            <div className={`bubble ${m.role === "bot" && !m.found ? "nf" : ""}`}>
              <p dir="auto">
                {m.text}
                {m.role === "bot" && m.found && m.ids?.map((id) => (
                  <button key={id} className="cite" onClick={() => onCite(id)} title={`Open ${id}`}>[{id}]</button>
                ))}
              </p>
            </div>
            <div className="meta">
              <time>{fmtTime(m.ts)}</time>
              {m.role === "bot" && (
                <span className="fb">
                  <button className={m.feedback === "up" ? "on" : ""} onClick={() => onFeedback(m.id, "up")} aria-pressed={m.feedback === "up"}>
                    <Icon name="up" size={14} /> Helpful
                  </button>
                  <button className={m.feedback === "down" ? "on" : ""} onClick={() => onFeedback(m.id, "down")} aria-pressed={m.feedback === "down"}>
                    <span className="flip"><Icon name="up" size={14} /></span> Not helpful
                  </button>
                </span>
              )}
            </div>
          </div>
        ))}
        {pending && (
          <>
            <div className="msg user"><div className="bubble"><p dir="auto">{pending}</p></div></div>
            <div className="msg bot">
              <div className="bubble typing" role="status" aria-label="AskSE is typing"><i /><i /><i /></div>
            </div>
          </>
        )}
        <div ref={endRef} />
      </div>

      <div className="composer">
        <div className="chips">
          {SUGGESTIONS.map((q) => (
            <button key={q} className="chip" disabled={!!pending} onClick={() => { setInput(q); send(q); }}>{q}</button>
          ))}
        </div>
        {error && <div className="alert" role="alert">{error}</div>}
        <div className={`box ${tooLong ? "bad" : ""}`}>
          <textarea
            rows={2}
            value={input}
            readOnly={!!pending}
            placeholder="Type your question…"
            aria-label="Your question"
            onChange={(e) => { setInput(e.target.value); if (error) setError(""); }}
            onKeyDown={onKeyDown}
          />
          <button className="send" onClick={() => send()} disabled={!!pending} aria-label="Send message">
            <Icon name="send" size={20} />
          </button>
        </div>
        <div className={`counter ${tooLong ? "bad" : ""}`}>{len}/300</div>
      </div>

      {confirmClear && (
        <ConfirmDialog
          title={MSG.clearConfirm}
          body="Your FAQs are not affected."
          confirmLabel="Clear"
          onCancel={() => setConfirmClear(false)}
          onConfirm={() => { onClear(); setConfirmClear(false); }}
        />
      )}
    </section>
  );
}
