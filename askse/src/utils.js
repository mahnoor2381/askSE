export const KEYS = {
  faqs: "askse.faqs",
  chat: "askse.chat",
  stats: "askse.stats",
  theme: "askse.theme",
  urdu: "askse.urduScript",
};

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or blocked – app keeps working in memory */
  }
}

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

// hh:mm AM/PM
export function fmtTime(ts) {
  return new Date(ts).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export const idNumber = (id) => parseInt(String(id).replace(/\D/g, ""), 10) || 0;

export function nextFaqId(faqs) {
  const max = faqs.reduce((m, f) => Math.max(m, idNumber(f.id)), 0);
  return "FAQ-" + String(max + 1).padStart(2, "0");
}

export const EMPTY_STATS = { asked: 0, answered: 0, notFound: 0, cites: {} };
