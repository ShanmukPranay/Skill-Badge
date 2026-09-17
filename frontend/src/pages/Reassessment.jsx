import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

const questions = [
  {
    question: "Which Docker file defines how an image is built?",
    options: ["Dockerfile", "docker.json", "image.yml", "container.xml"],
    answer: "Dockerfile"
  },
  {
    question: "Which AWS service is commonly used for virtual servers?",
    options: ["EC2", "S3", "RDS", "Route 53"],
    answer: "EC2"
  }
];

export default function Reassessment() {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});

  const submit = () => {
    const score = questions.reduce(
      (total, question, index) =>
        total + (answers[index] === question.answer ? 1 : 0),
      0
    );

    alert(
      `Reassessment complete! Score: ${score}/${questions.length}`
    );

    navigate("/progress");
  };

  const question = questions[current];

  return (
    <div className="reassessment-page">
      <div className="reassessment-container">
        <div style={{ marginBottom: 16 }}>
          <BackButton to="/progress" />
        </div>

        <span className="section-label">SKILL REASSESSMENT</span>

        <h1>Measure Your Improvement</h1>

        <p>
          Answer a few questions to reassess your current readiness.
        </p>

        <div className="question-card">
          <strong>
            Question {current + 1} of {questions.length}
          </strong>

          <h2>{question.question}</h2>

          {question.options.map((option) => (
            <label className="option" key={option}>
              <input
                type="radio"
                name={`question-${current}`}
                checked={answers[current] === option}
                onChange={() =>
                  setAnswers({
                    ...answers,
                    [current]: option
                  })
                }
              />{" "}
              {option}
            </label>
          ))}

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              marginTop: 24
            }}
          >
            <BackButton to="/progress" />

            {current < questions.length - 1 ? (
              <button
                className="primary-btn"
                onClick={() => setCurrent(current + 1)}
              >
                Next →
              </button>
            ) : (
              <button className="primary-btn" onClick={submit}>
                Submit Reassessment
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
