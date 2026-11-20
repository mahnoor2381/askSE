export default function Stats({ stats, faqs, messages }) {
  const top = Object.entries(stats.cites || {}).sort((a, b) => b[1] - a[1])[0];
  const topFaq = top && faqs.find((f) => f.id === top[0]);
  const bots = messages.filter((m) => m.role === "bot");
  const up = bots.filter((m) => m.feedback === "up").length;
  const down = bots.filter((m) => m.feedback === "down").length;
  const rate = stats.asked ? Math.round((stats.answered / stats.asked) * 100) : 0;

  return (
    <section className="page">
      <header className="page-head">
        <div><h1>Stats</h1><p>How the help desk is doing, since the last reset.</p></div>
      </header>
      <div className="stat-row">
        <div className="stat"><b>{stats.asked}</b><span>Questions asked</span></div>
        <div className="stat good"><b>{stats.answered}</b><span>Answered</span></div>
        <div className="stat warn"><b>{stats.notFound}</b><span>Not found</span></div>
        <div className="stat"><b>{rate}%</b><span>Answer rate</span></div>
      </div>
      <div className="card">
        <h2>Most-cited FAQ</h2>
        {top ? (
          <p><span className="idtag">{top[0]}</span> cited {top[1]} {top[1] === 1 ? "time" : "times"}{topFaq ? `: ${topFaq.question}` : ""}</p>
        ) : (
          <p className="muted">No FAQ has been cited yet. Ask a question in Chat.</p>
        )}
      </div>
      <div className="card">
        <h2>Feedback on answers</h2>
        <p className="muted">{up} helpful, {down} not helpful (from the current chat).</p>
      </div>
    </section>
  );
}
