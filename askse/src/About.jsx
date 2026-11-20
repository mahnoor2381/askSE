import { TEAM } from "./config";
import { LLM } from "./llm";
import { Logo } from "./ui";

export default function About() {
  const rows = [
    ["Entry ID", TEAM.entryId],
    ["Team", TEAM.teamName],
    ["Members", TEAM.members.join(", ")],
    ["Repository", <a key="r" href={TEAM.repoUrl} target="_blank" rel="noreferrer">{TEAM.repoUrl}</a>],
    ["LLM API", LLM.label],
    ["Model", LLM.model],
    ["AI tools used to build it", TEAM.aiTools.join(", ")],
  ];
  return (
    <section className="page narrow">
      <div className="about-hero">
        <Logo size={64} />
        <div>
          <h1>AskSE</h1>
          <p>A help-desk chatbot that answers only from the department FAQ, cites the entry it used, and says so when it doesn't know.</p>
        </div>
      </div>
      <dl className="card about-list">
        {rows.map(([k, v]) => (
          <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
        ))}
      </dl>
      <p className="muted">Built for CodeQuest 2026 · Vibe Jam. All FAQ data is fictional.</p>
    </section>
  );
}
