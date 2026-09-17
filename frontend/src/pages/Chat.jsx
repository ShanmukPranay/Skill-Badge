import { useState } from "react";
import BackButton from "../components/BackButton";

export default function Chat() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      text: "Hi! What would you like to learn today?",
      type: "received"
    },
    {
      text: "I want to understand Docker and deployment.",
      type: "sent"
    }
  ]);

  const sendMessage = (event) => {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    setMessages([
      ...messages,
      {
        text: message.trim(),
        type: "sent"
      }
    ]);

    setMessage("");
  };

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16
          }}
        >
          <BackButton />
        </div>

        <span className="section-label">PEER CHAT</span>

        <h1>Chat with your peer</h1>

        <div className="chat-box">
          {messages.map((item, index) => (
            <div className={`message ${item.type}`} key={index}>
              {item.text}
            </div>
          ))}

          <form className="chat-form" onSubmit={sendMessage}>
            <input
              className="chat-input"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Type a message..."
            />

            <button className="primary-btn" type="submit">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
