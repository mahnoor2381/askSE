import { useEffect, useState } from "react";
import Chat from "./Chat";
import FaqList from "./FaqList";
import Admin from "./Admin";
import Stats from "./Stats";
import About from "./About";
import { Icon, Logo } from "./ui";
import { STARTER_FAQS } from "./faqs";
import { EMPTY_STATS, KEYS, load, save } from "./utils";

const TABS = [
  { id: "chat", label: "Chat", icon: "chat" },
  { id: "faqs", label: "FAQs", icon: "list" },
  { id: "admin", label: "Admin", icon: "lock" },
  { id: "stats", label: "Stats", icon: "chart" },
  { id: "about", label: "About", icon: "info" },
];

const starter = () => STARTER_FAQS.map((f) => ({ ...f }));

export default function App() {
  const [view, setView] = useState("chat");
  const [faqs, setFaqs] = useState(() => {
    const saved = load(KEYS.faqs, null);
    return Array.isArray(saved) && saved.length ? saved : starter(); // M2: first run loads the 8 FAQs
  });
  const [messages, setMessages] = useState(() => {
    const saved = load(KEYS.chat, []);
    return Array.isArray(saved) ? saved : [];
  });
  const [stats, setStats] = useState(() => ({ ...EMPTY_STATS, ...load(KEYS.stats, {}) }));
  const [theme, setTheme] = useState(() => load(KEYS.theme, "light"));
  const [urdu, setUrdu] = useState(() => load(KEYS.urdu, false));
  const [highlight, setHighlight] = useState(null);

  useEffect(() => save(KEYS.faqs, faqs), [faqs]);
  useEffect(() => save(KEYS.chat, messages), [messages]);
  useEffect(() => save(KEYS.stats, stats), [stats]);
  useEffect(() => save(KEYS.urdu, urdu), [urdu]);
  useEffect(() => {
    save(KEYS.theme, theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function onExchange(userMsg, botMsg) {
    setMessages((m) => [...m, userMsg, botMsg]);
    setStats((s) => {
      const cites = { ...s.cites };
      (botMsg.ids || []).forEach((id) => { cites[id] = (cites[id] || 0) + 1; });
      return {
        asked: s.asked + 1,
        answered: s.answered + (botMsg.found ? 1 : 0),
        notFound: s.notFound + (botMsg.found ? 0 : 1),
        cites,
      };
    });
  }

  const onFeedback = (id, value) =>
    setMessages((m) => m.map((x) => (x.id === id ? { ...x, feedback: x.feedback === value ? null : value } : x)));

  const onAdd = (faq) => setFaqs((f) => [...f, faq]);

  function onReset() {
    setFaqs(starter());
    setMessages([]);
    setStats({ ...EMPTY_STATS });
    setHighlight(null);
  }

  function onCite(id) {
    setHighlight(id);
    setView("faqs");
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <Logo size={34} />
          <span className="brand-name">AskSE</span>
        </div>
        <nav className="tabs" aria-label="Main">
          {TABS.map((t) => (
            <button key={t.id} className={view === t.id ? "active" : ""} onClick={() => { setView(t.id); if (t.id !== "faqs") setHighlight(null); }} aria-current={view === t.id ? "page" : undefined}>
              <Icon name={t.icon} size={20} /><span>{t.label}</span>
            </button>
          ))}
        </nav>
        <button className="theme" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle dark mode" title="Toggle dark mode">
          <Icon name={theme === "dark" ? "sun" : "moon"} />
        </button>
      </header>

      <main className={`main ${view === "chat" ? "is-chat" : ""}`}>
        {view === "chat" && <Chat faqs={faqs} messages={messages} urdu={urdu} setUrdu={setUrdu} onExchange={onExchange} onFeedback={onFeedback} onClear={() => setMessages([])} onCite={onCite} />}
        {view === "faqs" && <FaqList faqs={faqs} highlightId={highlight} onReset={onReset} />}
        {view === "admin" && <Admin faqs={faqs} onAdd={onAdd} />}
        {view === "stats" && <Stats stats={stats} faqs={faqs} messages={messages} />}
        {view === "about" && <About />}
      </main>
    </div>
  );
}
