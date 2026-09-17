import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

const roleRequirements = {
  "Java Full Stack Developer": [
    ["Java", "Strong"],
    ["Spring Boot", "Strong"],
    ["React", "Good"],
    ["SQL", "Good"],
    ["Docker", "Beginner"],
    ["AWS", "Missing"],
    ["System Design", "Missing"]
  ],
  "Frontend Developer": [
    ["HTML", "Strong"],
    ["CSS", "Strong"],
    ["JavaScript", "Good"],
    ["React", "Good"],
    ["TypeScript", "Beginner"],
    ["Testing", "Missing"],
    ["Next.js", "Missing"]
  ],
  "Backend Developer": [
    ["Java", "Good"],
    ["Spring Boot", "Good"],
    ["REST APIs", "Good"],
    ["SQL", "Good"],
    ["Docker", "Beginner"],
    ["Redis", "Missing"],
    ["System Design", "Missing"]
  ],
  "Python Developer": [
    ["Python", "Good"],
    ["Django / Flask", "Good"],
    ["SQL", "Good"],
    ["REST APIs", "Good"],
    ["Git", "Good"],
    ["Docker", "Beginner"],
    ["Testing", "Missing"]
  ],
  "Data Analyst": [
    ["SQL", "Strong"],
    ["Excel", "Good"],
    ["Python", "Good"],
    ["Pandas", "Beginner"],
    ["Power BI", "Beginner"],
    ["Statistics", "Missing"],
    ["Data Visualization", "Missing"]
  ],
  "Cloud Engineer": [
    ["Linux", "Good"],
    ["Networking", "Good"],
    ["AWS", "Beginner"],
    ["Docker", "Good"],
    ["Kubernetes", "Beginner"],
    ["Terraform", "Missing"],
    ["Monitoring", "Missing"]
  ],
  "DevOps Engineer": [
    ["Linux", "Good"],
    ["Git", "Strong"],
    ["Docker", "Good"],
    ["Jenkins", "Beginner"],
    ["AWS", "Beginner"],
    ["Kubernetes", "Missing"],
    ["Terraform", "Missing"]
  ]
};

const normalize = (skill) => skill.trim().toLowerCase();

function getStatus(level) {
  if (level === "Strong" || level === "Good") {
    return "good";
  }

  if (level === "Beginner") {
    return "warning";
  }

  return "missing";
}

function getSkillLevel(userSkills, skillName, expectedLevel) {
  const match = userSkills.find((skill) => {
    const current = normalize(skill);

    return (
      current === normalize(skillName) ||
      current.includes(normalize(skillName)) ||
      normalize(skillName).includes(current)
    );
  });

  if (!match) {
    return "Missing";
  }

  if (expectedLevel === "Strong") {
    return "Good";
  }

  return "Good";
}

export default function SkillGap() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state || {};

  const targetRole = data.targetRole || "Java Full Stack Developer";
  const requirements =
    roleRequirements[targetRole] || roleRequirements["Java Full Stack Developer"];

  const userSkills = data.skills
    ? data.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
    : [];

  const skills = requirements.map(([name, expectedLevel]) => {
    const level =
      data.inputType === "manual"
        ? getSkillLevel(userSkills, name, expectedLevel)
        : expectedLevel;

    return {
      name,
      level,
      status: getStatus(level)
    };
  });

  const scoreMap = {
    Strong: 100,
    Good: 80,
    Beginner: 45,
    Missing: 0
  };

  const readiness = Math.round(
    skills.reduce((total, skill) => total + scoreMap[skill.level], 0) /
      skills.length
  );

  const gapCount = skills.filter((skill) => skill.status !== "good").length;

  return (
    <div className="gap-page">
      <div className="gap-container">
        <div style={{ marginBottom: 16 }}>
          <BackButton to="/skill-analysis" />
        </div>

        <div className="gap-header">
          <span className="section-label">SKILL ANALYSIS COMPLETE</span>

          <h1>Your Skill Gap</h1>

          <p>
            Target Role: <strong>{targetRole}</strong>
          </p>
        </div>

        <div className="readiness-score">
          <div className="score-circle">
            <strong>{readiness}%</strong>
            <span>Ready</span>
          </div>

          <div>
            <h3>Career Readiness</h3>
            <p className="gap-summary">
              You have {skills.filter((skill) => skill.status === "good").length}{" "}
              strong foundation skills. Focus on the {gapCount} highlighted
              skill{gapCount === 1 ? "" : "s"} to improve your readiness.
            </p>
          </div>
        </div>

        <div className="gap-card">
          <h2>Skill Comparison</h2>

          {skills.map((skill) => (
            <div className="gap-item" key={skill.name}>
              <div>
                <span className={`status-dot ${skill.status}`}>
                  {skill.status === "good" ? "✓" : "!"}
                </span>
                {skill.name}
              </div>

              <span className={`level ${skill.status}`}>
                {skill.level}
              </span>
            </div>
          ))}
        </div>

        <div className="gap-next">
          <h2>Your next step is up to you.</h2>
          <p>Choose how you want to bridge your skill gap.</p>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              marginTop: 16
            }}
          >
            <BackButton to="/skill-analysis" />
            <button
              className="primary-btn"
              type="button"
              onClick={() =>
                navigate("/learning-choice", {
                  state: data
                })
              }
            >
              Choose My Learning Path →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
