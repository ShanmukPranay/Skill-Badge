import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

export default function Sessions() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(
      localStorage.getItem("skillbridgeSessions") || "[]"
    );

    setSessions(saved);
  }, []);

  return (
    <div className="sessions-page">
      <div className="sessions-container">
        <div style={{ marginBottom: 16 }}>
          <BackButton to="/peers" />
        </div>

        <span className="section-label">MY LEARNING</span>

        <h1>My Sessions</h1>

        <p>
          Track your peer learning requests and upcoming sessions.
        </p>

        {sessions.length === 0 ? (
          <div className="session-card">
            <h3>No sessions yet</h3>
            <p>Find a peer and book your first learning session.</p>

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
              <button
                className="primary-btn"
                onClick={() => navigate("/peers")}
              >
                Find a Peer →
              </button>
            </div>
          </div>
        ) : (
          sessions.map((session) => (
            <div className="session-card" key={session.id}>
              <div className="session-top">
                <div>
                  <h3>Session with {session.peerName}</h3>
                  <p>
                    {session.date} · {session.time} · {session.duration} min
                  </p>
                </div>

                <span className="session-status">
                  {session.status}
                </span>
              </div>

              <p>{session.message || "No message added."}</p>

              <div className="session-actions">
                <button
                  className="primary-btn"
                  onClick={() => navigate("/chat")}
                >
                  Open Chat
                </button>
              </div>
            </div>
          ))
        )}

        {sessions.length > 0 && (
          <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-start" }}>
            <BackButton to="/peers" />
          </div>
        )}
      </div>
    </div>
  );
}
