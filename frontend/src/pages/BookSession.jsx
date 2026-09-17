import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import BackButton from "../components/BackButton";

const peerNames = {
  rahul: "Rahul Kumar",
  priya: "Priya Sharma",
  arjun: "Arjun Reddy"
};

export default function BookSession() {
  const { peerId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const peerName = peerNames[peerId] || "Peer Mentor";

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("30");
  const [message, setMessage] = useState("");

  const submitBooking = (event) => {
    event.preventDefault();

    if (!date || !time) {
      alert("Please select date and time.");
      return;
    }

    const session = {
      id: Date.now(),
      peerName,
      targetRole: location.state?.targetRole || "",
      date,
      time,
      duration,
      message,
      status: "PENDING"
    };

    const existing = JSON.parse(
      localStorage.getItem("skillbridgeSessions") || "[]"
    );

    localStorage.setItem(
      "skillbridgeSessions",
      JSON.stringify([session, ...existing])
    );

    navigate("/sessions");
  };

  return (
    <div className="booking-page">
      <div className="booking-container">
        <span className="section-label">BOOK A PEER SESSION</span>

        <h1>Schedule with {peerName}</h1>

        <p>
          Choose a convenient time and tell your peer what you want to learn.
        </p>

        <form className="gap-card booking-form" onSubmit={submitBooking}>
          <div className="booking-grid">
            <div>
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(event) => setDate(event.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="duration">Duration</label>
              <select
                id="duration"
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
              >
                <option value="30">30 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </div>
          </div>

          <label>Available Time</label>

          <div className="time-grid">
            {["6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"].map((slot) => (
              <button
                type="button"
                className={`time-btn ${time === slot ? "selected" : ""}`}
                key={slot}
                onClick={() => setTime(slot)}
              >
                {slot}
              </button>
            ))}
          </div>

          <label htmlFor="message">Message to your peer</label>

          <textarea
            id="message"
            rows="4"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Example: I want to learn Docker basics and deployment."
          />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              marginTop: 24
            }}
          >
            <BackButton to={`/peers/${peerId}`} />
            <button className="primary-btn" type="submit">
              Request Session →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
