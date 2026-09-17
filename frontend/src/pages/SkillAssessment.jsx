import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { api, getSessionUser } from "../api";
import BackButton from "../components/BackButton";

export default function SkillAssessment() {
  const { skill } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const user = getSessionUser() || {
    id: 1,
    name: "Demo Learner",
  };

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadQuestions() {
      try {
        const data = await api.questions(skill);
        setQuestions(data);
      } catch (err) {
        setError(err.message || "Unable to load assessment.");
      } finally {
        setLoading(false);
      }
    }

    loadQuestions();
  }, [skill]);

  async function submitAssessment() {
    setSubmitting(true);
    setError("");

    try {
      const formattedAnswers = Object.fromEntries(
        Object.entries(answers).map(([questionId, optionIndex]) => [
          questionId,
          Number(optionIndex),
        ])
      );

      const assessmentResult = await api.submitAssessment({
        userId: user.id,
        skill,
        answers: formattedAnswers,
      });

      setResult(assessmentResult);
      localStorage.setItem(
        `assessment_${skill}`,
        JSON.stringify(assessmentResult)
      );
    } catch (err) {
      setError(err.message || "Unable to submit assessment.");
    } finally {
      setSubmitting(false);
    }
  }

  function retakeAssessment() {
    setResult(null);
    setAnswers({});
    setError("");
  }

  if (loading) {
    return (
      <main className="page-shell">
        <div className="panel">
          <p>Loading diagnostic quiz...</p>
        </div>
      </main>
    );
  }

  if (result) {
    const weakAreas = result.weakAreas
      ? result.weakAreas.split(", ").filter(Boolean)
      : [];

    return (
      <main className="page-shell">
        <div style={{ marginBottom: 16 }}>
          <BackButton to="/roadmap" />
        </div>

        <div className="page-head">
          <span className="eyebrow">PERSONAL LEARNING</span>
          <h1>{skill} Assessment Result</h1>
          <p>
            We analysed your answers and created a path around the areas you
            need most.
          </p>
        </div>

        <section className="result-grid">
          <div className="result-score">
            <div className="big-score">
              {result.score}/{result.total}
            </div>
            <strong>{result.level}</strong>
            <span>{result.readiness}% diagnostic readiness</span>
          </div>

          <div className="panel">
            <h3>Your analysis</h3>

            <p>
              <strong>Strengths:</strong>{" "}
              {result.score >= 3
                ? "Core concepts are developing well."
                : "Start with fundamentals and build confidence."}
            </p>

            <p>
              <strong>Needs attention:</strong>{" "}
              {weakAreas.length > 0
                ? weakAreas.join(", ")
                : "No major weak areas detected."}
            </p>

            <div className="topic-list">
              {questions.map((question) => {
                const needsWork = weakAreas.includes(question.topic);

                return (
                  <div key={question.id} className="topic-row">
                    <span>{question.topic}</span>
                    <span
                      className={needsWork ? "topic-bad" : "topic-good"}
                    >
                      {needsWork ? "Needs work" : "Ready"}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="button-row">
              <button
                className="primary-btn"
                onClick={() =>
                  navigate(`/roadmap?skill=${encodeURIComponent(skill)}`)
                }
              >
                View Personalized Path
              </button>

              <button
                className="secondary-btn"
                onClick={retakeAssessment}
              >
                Retake
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <div style={{ marginBottom: 16 }}>
        <BackButton to="/roadmap" />
      </div>

      <div className="page-head">
        <span className="eyebrow">DIAGNOSTIC ASSESSMENT</span>
        <h1>Test your {skill} skills</h1>
        <p>
          Answer from what you know now. Your score controls the recommended
          learning order.
        </p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <section className="quiz-card">
        {questions.map((question, index) => (
          <article className="question-card" key={question.id}>
            <div className="question-number">Question {index + 1}</div>

            <h3>{question.question}</h3>

            <div className="options">
              {question.options.map((option, optionIndex) => {
                const selected =
                  String(answers[question.id]) === String(optionIndex);

                return (
                  <label
                    key={option}
                    className={`option ${selected ? "selected" : ""}`}
                  >
                    <input
                      type="radio"
                      name={`q-${question.id}`}
                      checked={selected}
                      onChange={() =>
                        setAnswers((current) => ({
                          ...current,
                          [question.id]: optionIndex,
                        }))
                      }
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
            </div>
          </article>
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
          <BackButton to="/roadmap" />
          <button
            className="primary-btn wide-btn"
            disabled={
              submitting ||
              Object.keys(answers).length < questions.length
            }
            onClick={submitAssessment}
          >
            {submitting ? "Analysing..." : "Submit & Analyse"}
          </button>
        </div>
      </section>
    </main>
  );
}
