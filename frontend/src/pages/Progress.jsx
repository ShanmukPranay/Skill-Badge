import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, getSessionUser } from "../api";
import BackButton from "../components/BackButton";

export default function Progress() {
  const user = getSessionUser() || { id: 1 };
  const [rows, setRows] = useState([]);

  useEffect(() => {
    api.progress(user.id).then(setRows).catch(() => setRows([]));
  }, [user.id]);

  const grouped = {};
  rows.forEach((x) => {
    (grouped[x.skill] ??= []).push(x);
  });

  const overall = rows.length
    ? Math.round(rows.reduce((s, x) => s + x.progressPercent, 0) / rows.length)
    : 0;

  return (
    <main className="page-shell">
      <div style={{ marginBottom: 16 }}>
        <BackButton to="/roadmap" />
      </div>

      <div className="page-head">
        <span className="eyebrow">PROGRESS</span>
        <h1>Your learning progress</h1>
        <p>
          Your progress increases from completed learning topics and quizzes — not from the
          diagnostic score itself.
        </p>
      </div>

      <section className="progress-overview">
        <div className="result-score">
          <div className="big-score">{overall}%</div>
          <strong>Overall Learning</strong>
          <span>Tracked topic progress</span>
        </div>

        <div className="panel">
          <h3>Skill progress</h3>

          {Object.entries(grouped).map(([skill, items]) => {
            const p = Math.round(
              items.reduce((s, x) => s + x.progressPercent, 0) / items.length
            );
            return (
              <div className="skill-progress" key={skill}>
                <div>
                  <span>{skill}</span>
                  <b>{p}%</b>
                </div>
                <div className="progress-bar">
                  <span style={{ width: `${p}%` }} />
                </div>
              </div>
            );
          })}

          <div className="button-row">
            <BackButton to="/roadmap" />
            <Link to="/roadmap" className="primary-btn">Continue Roadmap</Link>
            <Link to="/reassessment" className="secondary-btn">Reassessment</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
