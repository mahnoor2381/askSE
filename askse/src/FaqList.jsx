import { useEffect, useMemo, useState } from "react";
import { CATEGORIES } from "./config";
import { Icon, ConfirmDialog } from "./ui";
import { idNumber } from "./utils";

export default function FaqList({ faqs, highlightId, onReset }) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState("All");
  const [confirm, setConfirm] = useState(false);

  const sorted = useMemo(() => [...faqs].sort((a, b) => idNumber(a.id) - idNumber(b.id)), [faqs]);
  const shown = sorted.filter((f) => {
    const q = query.trim().toLowerCase();
    return (cat === "All" || f.category === cat) &&
      (!q || [f.id, f.category, f.question, f.answer].some((s) => s.toLowerCase().includes(q)));
  });

  useEffect(() => {
    if (highlightId) document.getElementById(highlightId)?.scrollIntoView({ block: "center" });
  }, [highlightId]);

  return (
    <section className="page">
      <header className="page-head">
        <div>
          <h1>FAQ knowledge base</h1>
          <p>{faqs.length} entries. This is everything AskSE is allowed to know.</p>
        </div>
        <button className="btn ghost small" onClick={() => setConfirm(true)}>
          <Icon name="reset" size={16} /> Reset to starter data
        </button>
      </header>

      <div className="filters">
        <label className="search">
          <Icon name="search" size={18} />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search questions and answers" aria-label="Search FAQs" />
        </label>
        <div className="chips">
          {["All", ...CATEGORIES].map((c) => (
            <button key={c} className={`chip ${cat === c ? "active" : ""}`} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
      </div>

      <div className="faq-grid">
        {shown.map((f) => (
          <article id={f.id} key={f.id} className={`faq ${highlightId === f.id ? "flash" : ""}`}>
            <div className="faq-head"><span className="idtag">{f.id}</span><span className="cat">{f.category}</span></div>
            <h3>{f.question}</h3>
            <p>{f.answer}</p>
          </article>
        ))}
        {shown.length === 0 && <p className="empty">No FAQ matches your search. Try another word or category.</p>}
      </div>

      {confirm && (
        <ConfirmDialog
          title="Reset to starter data?"
          body="This restores the 8 starter FAQs and clears the chat and stats."
          confirmLabel="Reset"
          onCancel={() => setConfirm(false)}
          onConfirm={() => { onReset(); setConfirm(false); }}
        />
      )}
    </section>
  );
}
