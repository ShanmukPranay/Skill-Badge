import { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import BackButton from "../components/BackButton";

const roles = [
  "Java Full Stack Developer",
  "Frontend Developer",
  "Backend Developer",
  "Python Developer",
  "Data Analyst",
  "Cloud Engineer",
  "DevOps Engineer",
];

const commonSkills = [
  "Java", "Spring Boot", "React", "JavaScript", "Python", "SQL", "Docker",
  "AWS", "System Design", "Git", "Jenkins", "Kubernetes", "TypeScript",
  "REST APIs", "Hibernate / JPA", "Power BI",
];

export default function TeachSession() {
  const navigate = useNavigate();
  const location = useLocation();
  const stored = JSON.parse(localStorage.getItem("skillbridgeTeachingSessions") || "[]");

  const initialRole = location.state?.targetRole || roles[0];
  const [form, setForm] = useState({
    role: initialRole,
    skill: commonSkills[0],
    customSkill: "",
    date: "",
    time: "",
    duration: "30",
    mode: "Online",
    description: "",
  });
  const [created, setCreated] = useState(stored);

  const skillValue = useMemo(
    () => form.customSkill.trim() || form.skill,
    [form.customSkill, form.skill]
  );

  function change(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function submit(event) {
    event.preventDefault();
    if (!form.date || !form.time || !skillValue) {
      alert("Please complete skill, date and time.");
      return;
    }

    const session = {
      id: Date.now(),
      role: form.role,
      skill: skillValue,
      date: form.date,
      time: form.time,
      duration: form.duration,
      mode: form.mode,
      description: form.description,
      status: "OPEN",
    };

    const next = [session, ...created];
    localStorage.setItem("skillbridgeTeachingSessions", JSON.stringify(next));
    setCreated(next);
    setForm((current) => ({ ...current, date: "", time: "", description: "" }));
  }

  return (
    <main className="page-shell">
      <div style={{ marginBottom: 16 }}>
        <BackButton to="/peers" />
      </div>

      <div className="page-head">
        <span className="eyebrow">PEER LEARNING</span>
        <h1>Teach a Skill</h1>
        <p>Create an open peer session and help someone learn a skill you know.</p>
      </div>

      <section className="lesson-card teach-workspace">
        <form className="teach-form" onSubmit={submit}>
          <div className="teach-grid">
            <label>
              Target Role
              <select value={form.role} onChange={(e) => change("role", e.target.value)}>
                {roles.map((role) => <option key={role}>{role}</option>)}
              </select>
            </label>

            <label>
              Skill You Can Teach
              <select value={form.skill} onChange={(e) => change("skill", e.target.value)}>
                {commonSkills.map((skill) => <option key={skill}>{skill}</option>)}
              </select>
            </label>
          </div>

          <label>
            Or add another skill
            <input value={form.customSkill} onChange={(e) => change("customSkill", e.target.value)} placeholder="Example: Spring Security" />
          </label>

          <div className="teach-grid">
            <label>
              Date
              <input type="date" value={form.date} onChange={(e) => change("date", e.target.value)} required />
            </label>
            <label>
              Time
              <input type="time" value={form.time} onChange={(e) => change("time", e.target.value)} required />
            </label>
          </div>

          <div className="teach-grid">
            <label>
              Duration
              <select value={form.duration} onChange={(e) => change("duration", e.target.value)}>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </label>
            <label>
              Mode
              <select value={form.mode} onChange={(e) => change("mode", e.target.value)}>
                <option>Online</option>
                <option>In Person</option>
              </select>
            </label>
          </div>

          <label>
            Session Description
            <textarea rows="4" value={form.description} onChange={(e) => change("description", e.target.value)} placeholder="Tell learners what they will learn in this session." />
          </label>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              marginTop: 16
            }}
          >
            <BackButton to="/peers" />
            <button className="primary-btn" type="submit">
              Create Teaching Session →
            </button>
          </div>
        </form>
      </section>

      <section className="teach-list">
        <div className="page-head small-head">
          <span className="eyebrow">MY TEACHING SESSIONS</span>
          <h2>Sessions you created</h2>
        </div>

        {created.length === 0 ? (
          <div className="panel"><p>No teaching sessions created yet.</p></div>
        ) : (
          created.map((session) => (
            <div className="teaching-session-card" key={session.id}>
              <div>
                <span className="mini-label">{session.role}</span>
                <h3>{session.skill}</h3>
                <p>{session.date} · {session.time} · {session.duration} min · {session.mode}</p>
                {session.description && <p>{session.description}</p>}
              </div>
              <span className="status-open">{session.status}</span>
            </div>
          ))
        )}

        <div className="button-row">
          <BackButton to="/peers" />
          <button
            className="secondary-btn"
            onClick={() => navigate("/peers", { state: location.state })}
          >
            Back to Peer Learning
          </button>
        </div>
      </section>
    </main>
  );
}
