import { useLocation, useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";

const fallbackPeers = {
  rahul: {
    name: "Rahul Kumar",
    level: "Advanced",
    rating: "4.8",
    sessions: 12,
    skills: ["Docker", "AWS", "Kubernetes"],
    bio: "DevOps enthusiast who enjoys helping students build practical cloud skills.",
    availability: "Weekdays · 6 PM – 9 PM"
  },
};

export default function PeerProfile() {
  const { peerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const statePeer = location.state?.peer;
  const peer = statePeer
    ? { ...statePeer, skills: statePeer.skills.split(" · "), availability: "Weekdays · 6 PM – 9 PM" }
    : (fallbackPeers[peerId] || fallbackPeers.rahul);

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div style={{ marginBottom: 16 }}>
          <BackButton to="/peers" />
        </div>

        <div className="profile-header">
          <div className="avatar">{peer.name.charAt(0)}</div>
          <h1>{peer.name}</h1>
          <p>{peer.level} · ⭐ {peer.rating} · {peer.sessions} sessions</p>
        </div>

        <div className="gap-card">
          <h2>About</h2>
          <p>{peer.bio}</p>
        </div>

        <div className="gap-card">
          <h2>Skills</h2>
          {peer.skills.map((skill) => (
            <div className="profile-skill" key={skill}>
              <span>{skill}</span>
              <strong>Can teach</strong>
            </div>
          ))}
        </div>

        <div className="gap-card">
          <h2>Availability</h2>
          <p>{peer.availability}</p>
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
          <BackButton to="/peers" />
          <button
            className="primary-btn"
            type="button"
            onClick={() => navigate(`/sessions/book/${peerId}`, { state: location.state })}
          >
            Book a Session →
          </button>
        </div>
      </div>
    </div>
  );
}
