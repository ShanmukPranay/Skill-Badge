import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import { api, getSessionUser } from "../api";
import BackButton from "../components/BackButton";

const FALLBACK_ROADMAPS = {
  "Java Full Stack Developer": {
    Java: ["Syntax & Data Types", "OOP", "Collections", "Exception Handling", "Java 8+", "Multithreading"],
    "Spring Boot": ["Project Structure", "REST Controllers", "Service Layer", "JPA & Hibernate", "Validation", "Spring Security"],
    React: ["Components", "Props & State", "Hooks", "Routing", "Forms", "API Integration"],
    SQL: ["SELECT & WHERE", "Joins", "Grouping", "Subqueries", "Indexes", "Transactions"],
    Docker: ["Images & Containers", "Basic Commands", "Dockerfile", "Volumes", "Networking", "Docker Compose"],
    AWS: ["EC2", "S3", "IAM", "Regions & Availability", "Lambda", "Deployment Basics"],
    "System Design": ["Scaling", "Load Balancing", "Caching", "Replication", "High Availability", "API Design"]
  },
  "Frontend Developer": {
    HTML: ["Semantic HTML", "Forms", "Tables", "Accessibility", "SEO Basics"],
    CSS: ["Selectors", "Box Model", "Flexbox", "Grid", "Responsive Design", "Animations"],
    JavaScript: ["ES6+", "Functions", "DOM", "Async JavaScript", "Promises", "Fetch & APIs"],
    React: ["Components", "Props & State", "Hooks", "Routing", "Forms", "Performance"],
    TypeScript: ["Types", "Interfaces", "Generics", "Utility Types", "React with TypeScript"],
    Testing: ["Unit Tests", "Component Tests", "Mocking", "Test Cases"],
    "Next.js": ["App Router", "Pages", "Server Components", "Data Fetching", "Deployment"]
  },
  "Backend Developer": {
    Java: ["Syntax", "OOP", "Collections", "Exceptions", "Java 8+"],
    "Spring Boot": ["REST APIs", "Dependency Injection", "JPA & Hibernate", "Validation", "Security"],
    "REST APIs": ["HTTP Methods", "Status Codes", "Request/Response", "Validation", "Error Handling"],
    SQL: ["Queries", "Joins", "Grouping", "Transactions", "Indexes"],
    Docker: ["Images", "Containers", "Dockerfile", "Compose", "Networking"],
    Redis: ["Key-Value Model", "Caching", "TTL", "Data Structures", "Use Cases"],
    "System Design": ["Scaling", "Load Balancing", "Caching", "Queues", "High Availability"]
  },
  "Python Developer": {
    Python: ["Syntax", "Functions", "OOP", "Modules", "Exceptions", "Testing"],
    "Django / Flask": ["Routing", "Views", "Templates", "REST APIs", "Authentication"],
    SQL: ["Queries", "Joins", "Grouping", "Subqueries", "Indexes"],
    "REST APIs": ["HTTP", "Endpoints", "JSON", "Validation", "Error Handling"],
    Git: ["Repositories", "Branches", "Commits", "Merge", "Pull Requests"],
    Docker: ["Images", "Dockerfile", "Compose", "Volumes"],
    Testing: ["Unit Tests", "Fixtures", "Mocking", "Coverage"]
  },
  "Data Analyst": {
    SQL: ["SELECT", "Joins", "Grouping", "Subqueries", "Window Functions", "Indexes"],
    Excel: ["Formulas", "Lookup Functions", "Pivot Tables", "Cleaning", "Charts"],
    Python: ["Variables", "Functions", "Lists", "Pandas", "Data Cleaning"],
    Pandas: ["Series & DataFrame", "Filtering", "GroupBy", "Merge", "Missing Data"],
    "Power BI": ["Data Import", "Data Model", "DAX Basics", "Visuals", "Dashboards"],
    Statistics: ["Mean & Median", "Variance", "Probability", "Distributions", "Hypothesis Testing"],
    "Data Visualization": ["Chart Selection", "Distribution", "Comparison", "Trends", "Dashboards"]
  },
  "Cloud Engineer": {
    Linux: ["Files & Directories", "Permissions", "Processes", "Networking", "Shell Basics"],
    Networking: ["IP & Ports", "DNS", "HTTP/HTTPS", "Subnets", "Routing"],
    AWS: ["IAM", "EC2", "S3", "VPC", "Lambda", "Cloud Monitoring"],
    Docker: ["Images", "Containers", "Dockerfile", "Volumes", "Networking"],
    Kubernetes: ["Pods", "Deployments", "Services", "ConfigMaps", "Ingress"],
    Terraform: ["Providers", "Resources", "Variables", "State", "Modules"],
    Monitoring: ["Metrics", "Logs", "Alerts", "Dashboards", "Health Checks"]
  },
  "DevOps Engineer": {
    Linux: ["Files", "Permissions", "Processes", "Services", "Shell"],
    Git: ["Commits", "Branches", "Merge", "Rebase", "Pull Requests"],
    Docker: ["Images", "Containers", "Dockerfile", "Compose", "Networking"],
    Jenkins: ["Jobs", "Pipelines", "Stages", "Agents", "Credentials"],
    AWS: ["IAM", "EC2", "S3", "VPC", "Deployment"],
    Kubernetes: ["Pods", "Deployments", "Services", "ConfigMaps", "Ingress"],
    Terraform: ["Providers", "Resources", "Variables", "State", "Modules"]
  }
};

const ASSESSABLE_SKILLS = new Set(["Docker", "AWS", "System Design"]);

const defaultRole = "Java Full Stack Developer";
const CURRENT_SKILL_SCORE = 100;

const normalizeSkill = (value) => String(value || "").trim().toLowerCase();

function isCurrentSkill(currentSkills, skill) {
  const target = normalizeSkill(skill);
  return currentSkills.some((item) => {
    const current = normalizeSkill(item);
    return current === target || current.includes(target) || target.includes(current);
  });
}

export default function Roadmap() {
  const [params] = useSearchParams();
  const highlightedSkill = params.get("skill");
  const user = getSessionUser() || { id: 1 };

  const [role, setRole] = useState(localStorage.getItem("targetRole") || defaultRole);
  const [roadmap, setRoadmap] = useState(null);
  const [results, setResults] = useState({});
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentSkills = useMemo(
    () =>
      (localStorage.getItem("currentSkills") || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    []
  );

  useEffect(() => {
    const savedRole = localStorage.getItem("targetRole") || defaultRole;
    setRole(savedRole);

    async function loadRoadmap() {
      try {
        const data = await api.roadmap(savedRole);
        setRoadmap(data.skills || data);
      } catch {
        setRoadmap(FALLBACK_ROADMAPS[savedRole] || FALLBACK_ROADMAPS[defaultRole]);
      } finally {
        setLoading(false);
      }
    }

    loadRoadmap();
  }, []);

  const skills = useMemo(() => roadmap || {}, [roadmap]);

  useEffect(() => {
    if (!roadmap) return;

    async function loadUserData() {
      const skillNames = Object.keys(roadmap);
      const latestResults = {};

      await Promise.all(
        skillNames.map(async (skill) => {
          try {
            const result = await api.latestAssessment(user.id, skill);
            if (result) latestResults[skill] = result;
          } catch {
            // A skill may not have a diagnostic yet.
          }
        })
      );

      setResults(latestResults);

      try {
        setProgress(await api.progress(user.id));
      } catch {
        setProgress([]);
      }
    }

    loadUserData();
  }, [roadmap, user.id]);

  const getTopicProgress = (skill, topic) => {
    const item = progress.find(
      (entry) => entry.skill === skill && entry.topic === topic
    );
    return item?.progressPercent || 0;
  };

  if (loading) {
    return (
      <main className="page-shell">
        <div className="panel">
          <p>Building your role-specific learning path...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <div style={{ marginBottom: 16 }}>
        <BackButton to="/learning-choice" />
      </div>

      <div className="page-head">
        <span className="eyebrow">PERSONAL LEARNING</span>
        <h1>Your Personalized Roadmap</h1>
        <p>
          A step-by-step path built for your <strong>{role}</strong> goal.
          Each technology has its own topics, assessment, and learning progress.
        </p>
      </div>

      <div className="roadmap-stack">
        {Object.entries(skills).map(([skill, topics]) => {
          const result = results[skill];
          const canAssess = ASSESSABLE_SKILLS.has(skill);
          const current = isCurrentSkill(currentSkills, skill) ? CURRENT_SKILL_SCORE : 0;
          const learningEntries = topics.map((topic) => getTopicProgress(skill, topic));
          const learningProgress = learningEntries.length
            ? Math.round(
                learningEntries.reduce((sum, value) => sum + value, 0) /
                  learningEntries.length
              )
            : 0;

          return (
            <section
              className={`roadmap-card ${highlightedSkill === skill ? "highlighted" : ""}`}
              key={skill}
            >
              <div className="roadmap-top">
                <div>
                  <span className="mini-label">TECHNOLOGY</span>
                  <h2>{skill}</h2>
                  <div className="roadmap-meta">
                    {result ? (
                      <>
                        <b>{result.level}</b> · Diagnostic {result.score}/{result.total}
                      </>
                    ) : canAssess ? (
                      "Not assessed yet"
                    ) : (
                      "Step-by-step learning path"
                    )}
                  </div>
                </div>

                <div style={{ display: "flex", gap: "12px" }}>
                  <div className="score-pill">
                    <strong>{current}%</strong>
                    <span>Current</span>
                  </div>
                  <div className="score-pill">
                    <strong>{learningProgress}%</strong>
                    <span>Learning</span>
                  </div>
                </div>
              </div>

              <div className="topic-list">
                {topics.map((topic, index) => {
                  const percent = getTopicProgress(skill, topic);
                  const previousTopicsComplete = topics
                    .slice(0, index)
                    .every((item) => getTopicProgress(skill, item) >= 100);
                  const locked = index > 0 && !previousTopicsComplete;

                  return (
                    <div className="roadmap-topic" key={topic}>
                      <div>
                        <div className="topic-title">
                          {percent >= 100 ? (
                            <span className="done">✓</span>
                          ) : locked ? (
                            <span className="lock">🔒</span>
                          ) : (
                            <span className="step">{index + 1}</span>
                          )}

                          {locked ? (
                            <span>{topic}</span>
                          ) : (
                            <Link
                              className="topic-link"
                              to={`/learn?skill=${encodeURIComponent(skill)}&topic=${encodeURIComponent(topic)}`}
                            >
                              {topic}
                            </Link>
                          )}
                        </div>

                        <div className="progress-bar">
                          <span style={{ width: `${percent}%` }} />
                        </div>
                      </div>

                      <div className="topic-percent">{percent}%</div>
                    </div>
                  );
                })}
              </div>

              {canAssess ? (
                <Link
                  className="primary-btn"
                  to={`/skill-assessment/${encodeURIComponent(skill)}`}
                >
                  {result ? "View / Retake Assessment" : "Take Diagnostic Quiz"}
                </Link>
              ) : (
                <Link
                  className="primary-btn"
                  to={`/learn?skill=${encodeURIComponent(skill)}&topic=${encodeURIComponent(topics[0])}`}
                >
                  Start Learning
                </Link>
              )}
            </section>
          );
        })}
      </div>

      <div style={{ marginTop: 32, display: "flex", justifyContent: "flex-start" }}>
        <BackButton to="/learning-choice" />
      </div>
    </main>
  );
}
