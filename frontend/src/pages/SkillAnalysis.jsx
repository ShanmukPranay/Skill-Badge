import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

export default function SkillAnalysis() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state || {};

  return (
    <div className="analysis-page">
      <div style={{ maxWidth: 700, margin: "0 auto 16px", padding: "0 16px" }}>
        <BackButton to="/onboarding" />
      </div>

      <div className="analysis-card">
        <div className="analysis-spinner">✨</div>

        <h1>Analyzing Your Skills</h1>

        <p>
          We're comparing your current skills with the requirements for
        </p>

        <strong>{data.targetRole || "your target role"}</strong>

        <div className="analysis-progress">
          <div />
        </div>

        <div className="analysis-steps">
          <p>✓ Reading your profile</p>
          <p>✓ Identifying current skills</p>
          <p>✓ Comparing career requirements</p>
          <p>✓ Preparing your skill gap</p>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            marginTop: 24
          }}
        >
          <BackButton to="/onboarding" />
          <button
            className="primary-btn"
            type="button"
            onClick={() => navigate("/skill-gap", { state: data })}
          >
            View My Skill Gap
          </button>
        </div>
      </div>
    </div>
  );
}
