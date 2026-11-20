import { useState } from "react";
import { ADMIN_PIN, CATEGORIES, LIMITS, MSG } from "./config";
import { Icon } from "./ui";
import { nextFaqId } from "./utils";

export default function Admin({ faqs, onAdd }) {
  const [unlocked, setUnlocked] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [form, setForm] = useState({ category: "", question: "", answer: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");

  function unlock(e) {
    e.preventDefault();
    if (pin === ADMIN_PIN) { setUnlocked(true); setPin(""); setPinError(""); }
    else setPinError(MSG.wrongPin);
  }

  function validate(f) {
    const e = {};
    const q = f.question.trim().length;
    const a = f.answer.trim().length;
    if (!CATEGORIES.includes(f.category)) e.category = "Choose a category.";
    if (q < LIMITS.qMin || q > LIMITS.qMax) e.question = `Question must be ${LIMITS.qMin} to ${LIMITS.qMax} characters.`;
    if (a < LIMITS.aMin || a > LIMITS.aMax) e.answer = `Answer must be ${LIMITS.aMin} to ${LIMITS.aMax} characters.`;
    return e;
  }

  function submit(e) {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    setSuccess("");
    if (Object.keys(errs).length) return;
    const id = nextFaqId(faqs);
    onAdd({ id, category: form.category, question: form.question.trim(), answer: form.answer.trim() });
    setForm({ category: "", question: "", answer: "" });
    setSuccess(`${id} added. The bot can use it right now.`);
  }

  const set = (k) => (e) => { setForm({ ...form, [k]: e.target.value }); setErrors({ ...errors, [k]: undefined }); setSuccess(""); };

  if (!unlocked) {
    return (
      <section className="page narrow">
        <form className="card pin" onSubmit={unlock}>
          <span className="pin-icon"><Icon name="lock" size={26} /></span>
          <h1>Admin</h1>
          <p>Enter the PIN to add FAQs.</p>
          <input type="password" inputMode="numeric" value={pin} onChange={(e) => { setPin(e.target.value); setPinError(""); }} placeholder="PIN" aria-label="Admin PIN" autoFocus />
          {pinError && <div className="alert" role="alert">{pinError}</div>}
          <button className="btn primary" type="submit">Unlock</button>
        </form>
      </section>
    );
  }

  return (
    <section className="page narrow">
      <header className="page-head">
        <div>
          <h1>Add a FAQ</h1>
          <p>The next ID will be <strong>{nextFaqId(faqs)}</strong>. New FAQs are used by the bot immediately.</p>
        </div>
        <button className="btn ghost small" onClick={() => { setUnlocked(false); setSuccess(""); }}>
          <Icon name="lock" size={16} /> Lock
        </button>
      </header>
      <form className="card form" onSubmit={submit} noValidate>
        <label>Category
          <select value={form.category} onChange={set("category")}>
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
          {errors.category && <span className="ferr">{errors.category}</span>}
        </label>
        <label>Question
          <input value={form.question} onChange={set("question")} placeholder="e.g. Where do I collect my transcript?" />
          <span className="fhint">{form.question.trim().length}/{LIMITS.qMax} (min {LIMITS.qMin})</span>
          {errors.question && <span className="ferr">{errors.question}</span>}
        </label>
        <label>Answer
          <textarea rows={4} value={form.answer} onChange={set("answer")} placeholder="Write the official answer." />
          <span className="fhint">{form.answer.trim().length}/{LIMITS.aMax} (min {LIMITS.aMin})</span>
          {errors.answer && <span className="ferr">{errors.answer}</span>}
        </label>
        {success && <div className="okmsg" role="status">{success}</div>}
        <button className="btn primary" type="submit"><Icon name="plus" size={18} /> Add FAQ</button>
      </form>
    </section>
  );
}
