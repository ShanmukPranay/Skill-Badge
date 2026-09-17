import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

export default function Onboarding() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    role: "",
    experience: "",
    skillMethod: "",
    skills: "",
    resume: null
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.role) e.role = "Please select a target role";
    if (!form.experience) e.experience = "Please select your experience level";
    if (!form.skillMethod) e.skillMethod = "Please choose how to provide your skills";
    if (form.skillMethod === "resume" && !form.resume) {
      e.skillMethod = "Please upload your resume";
    }
    if (form.skillMethod === "manual" && !form.skills.trim()) {
      e.skillMethod = "Please enter at least one skill";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      nav("/skill-analysis");
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    "Java Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "Python Developer",
    "Data Analyst",
    "Cloud Engineer",
    "DevOps Engineer"
  ];

  return (
    <main style={{ maxWidth: 860, margin: "40px auto", padding: "0 24px 80px" }}>
      <span style={{ color: "#4f46e5", fontWeight: 700, fontSize: 13, letterSpacing: "0.05em" }}>
        STEP 1 OF 2
      </span>
      <h1 style={{ fontSize: 36, fontWeight: 800, color: "#111", margin: "12px 0 8px" }}>
        Let's understand your career goal
      </h1>
      <p style={{ color: "#666", fontSize: 16, margin: "0 0 32px" }}>
        Tell us where you are today and where you want to go.
      </p>

      {errors.general && (
        <div style={{ background: "#fee2e2", color: "#991b1b", padding: "12px 16px", borderRadius: 8, marginBottom: 20 }}>
          {errors.general}
        </div>
      )}

      <form onSubmit={submit}>
        {/* Target Role */}
        <section style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "24px 28px", marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 16px", color: "#111" }}>
            What role are you targeting?
          </h2>
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            style={{
              width: "100%",
              padding: "12px 14px",
              border: errors.role ? "1.5px solid #dc3545" : "1px solid #d1d5db",
              borderRadius: 8,
              fontSize: 15,
              color: "#111",
              background: "#fff",
              boxSizing: "border-box"
            }}
          >
            <option value="">Select your target role</option>
            {roles.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
          {errors.role && (
            <span style={{ display: "block", color: "#dc3545", fontSize: 13, marginTop: 8 }}>
              {errors.role}
            </span>
          )}
        </section>

        {/* Experience */}
        <section style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "24px 28px", marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 16px", color: "#111" }}>
            What is your experience level?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { v: "Fresher", icon: "🎓", desc: "Student or starting my career" },
              { v: "Experienced", icon: "💼", desc: "I already have professional experience" }
            ].map((opt) => (
              <div
                key={opt.v}
                onClick={() => setForm({ ...form, experience: opt.v })}
                style={{
                  border: form.experience === opt.v ? "1.5px solid #4f46e5" : "1.5px solid #e5e7eb",
                  background: form.experience === opt.v ? "#f5f3ff" : "#fff",
                  borderRadius: 10,
                  padding: 20,
                  cursor: "pointer",
                  transition: "all 0.15s"
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 8 }}>{opt.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 4px", color: "#111" }}>{opt.v}</h3>
                <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.4 }}>{opt.desc}</p>
              </div>
            ))}
          </div>
          {errors.experience && (
            <span style={{ display: "block", color: "#dc3545", fontSize: 13, marginTop: 8 }}>
              {errors.experience}
            </span>
          )}
        </section>

        {/* Skill Method */}
        <section style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "24px 28px", marginBottom: 20 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: "0 0 16px", color: "#111" }}>
            How would you like to provide your skills?
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { v: "resume", icon: "📄", title: "Upload Resume", desc: "We'll extract your skills automatically." },
              { v: "manual", icon: "✍️", title: "Enter Skills Manually", desc: "Tell us what skills you currently have." }
            ].map((opt) => (
              <div
                key={opt.v}
                onClick={() => setForm({ ...form, skillMethod: opt.v })}
                style={{
                  border: form.skillMethod === opt.v ? "1.5px solid #4f46e5" : "1.5px solid #e5e7eb",
                  background: form.skillMethod === opt.v ? "#f5f3ff" : "#fff",
                  borderRadius: 10,
                  padding: 20,
                  cursor: "pointer",
                  transition: "all 0.15s"
                }}
              >
                <div style={{ fontSize: 22, marginBottom: 8 }}>{opt.icon}</div>
                <h3 style={{ fontSize: 15, fontWeight: 700, margin: "0 0 4px", color: "#111" }}>{opt.title}</h3>
                <p style={{ fontSize: 13, color: "#6b7280", margin: 0, lineHeight: 1.4 }}>{opt.desc}</p>
              </div>
            ))}
          </div>
          {errors.skillMethod && (
            <span style={{ display: "block", color: "#dc3545", fontSize: 13, marginTop: 8 }}>
              {errors.skillMethod}
            </span>
          )}

          {/* Resume upload */}
          {form.skillMethod === "resume" && (
            <div style={{ marginTop: 16 }}>
              <label
                htmlFor="resume-input"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  padding: "14px 20px",
                  background: "#f9fafb",
                  border: "2px dashed #d1d5db",
                  borderRadius: 10,
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#4f46e5"
                }}
              >
                📎 {form.resume ? form.resume.name : "Click to choose a resume file"}
              </label>
              <input
                id="resume-input"
                type="file"
                accept=".pdf,.doc,.docx"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setForm({ ...form, resume: file });
                }}
              />
              {form.resume && (
                <p style={{ marginTop: 10, fontSize: 13, color: "#16a34a", fontWeight: 500 }}>
                  ✅ Selected: {form.resume.name} ({Math.round(form.resume.size / 1024)} KB)
                </p>
              )}
              <p style={{ marginTop: 10, fontSize: 12, color: "#9ca3af" }}>
                Supported: PDF, DOC, DOCX (max 5 MB)
              </p>
            </div>
          )}

          {/* Manual skills textarea */}
          {form.skillMethod === "manual" && (
            <textarea
              placeholder="E.g., Java, Spring Boot, React"
              value={form.skills}
              onChange={(e) => setForm({ ...form, skills: e.target.value })}
              style={{
                width: "100%",
                marginTop: 16,
                padding: "12px 14px",
                border: "1px solid #d1d5db",
                borderRadius: 8,
                fontSize: 15,
                minHeight: 90,
                fontFamily: "inherit",
                boxSizing: "border-box",
                resize: "vertical"
              }}
            />
          )}
        </section>

        {/* Back + Continue buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            marginTop: 32
          }}
        >
          <button
            type="button"
            onClick={() => nav(-1)}
            style={{
              minWidth: 140,
              padding: "16px 32px",
              fontSize: 16,
              fontWeight: 600,
              borderRadius: 10,
              background: "#fff",
              color: "#4f46e5",
              border: "1.5px solid #4f46e5",
              cursor: "pointer",
              transition: "all 0.15s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#eef2ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#fff";
            }}
          >
            ← Back
          </button>

          <button
            type="submit"
            disabled={loading}
            style={{
              minWidth: 280,
              padding: "16px 40px",
              fontSize: 16,
              fontWeight: 600,
              borderRadius: 10,
              background: loading ? "#a5b4fc" : "#4f46e5",
              color: "#fff",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 4px 14px rgba(79, 70, 229, 0.25)"
            }}
          >
            {loading ? "Saving..." : "Continue →"}
          </button>
        </div>
      </form>
    </main>
  );
}
