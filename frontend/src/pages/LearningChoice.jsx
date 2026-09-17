import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

export default function LearningChoice() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="choice-page">
      <div className="choice-container">
        <div style={{ marginBottom: 20 }}>
          <BackButton />
        </div>

        <div className="choice-header">
          <span className="section-label">BRIDGE YOUR SKILL GAP</span>
          <h1>How do you want to improve?</h1>
          <p>Choose the learning approach that works best for you.</p>
        </div>

        <div className="choice-grid">
          <div className="choice-card">
            <div className="choice-icon">📚</div>
            <h2>Learn Yourself</h2>
            <p>
              Follow a personalized learning roadmap designed around your skill
              gaps.
            </p>
            <ul>
              <li>Personalized roadmap</li>
              <li>Recommended courses</li>
              <li>Learning resources</li>
              <li>Progress tracking</li>
              <li>Skill reassessment</li>
            </ul>

            <button
              className="choice-button personal-button"
              type="button"
              onClick={() =>
                navigate("/roadmap", {
                  state: location.state
                })
              }
            >
              Start Learning →
            </button>
          </div>

          <div className="choice-card">
            <div className="choice-icon">🤝</div>
            <h2>Learn from Peers</h2>
            <p>
              Connect with students who already have the skills you want to
              develop.
            </p>
            <ul>
              <li>Find matching peers</li>
              <li>View peer profiles</li>
              <li>Check availability</li>
              <li>Book learning sessions</li>
              <li>Chat & get feedback</li>
            </ul>

            <button
              className="choice-button peer-button"
              type="button"
              onClick={() => navigate("/peers")}
            >
              Find a Peer →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
