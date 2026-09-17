import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { api, getSessionUser } from "../api";
import BackButton from "../components/BackButton";

const LESSON_LIBRARY = {
  "Syntax & Data Types": {
    overview: "Learn how a Java program is structured, how variables store values, and how Java's primitive and reference data types work.",
    modules: [
      {
        title: "Module 1 — Java Program Structure",
        explanation: "A Java application is commonly organized around classes and methods. Program execution starts from the main method. Statements end with a semicolon, and braces define blocks.",
        example: "public class Demo {\n    public static void main(String[] args) {\n        System.out.println(\"Hello Java\");\n    }\n}",
        practice: "Write a class named Student with a main method that prints your name and target role."
      },
      {
        title: "Module 2 — Variables & Data Types",
        explanation: "A variable stores a value of a particular type. Common primitive types include int, long, double, char and boolean. String is a reference type.",
        example: "int age = 21;\ndouble score = 9.4;\nchar grade = 'A';\nboolean active = true;\nString name = \"Sathvika\";",
        practice: "Declare variables for age, CGPA, first initial and whether a learner is active."
      },
      {
        title: "Module 3 — Type Casting & Input",
        explanation: "Widening conversion happens automatically when a smaller compatible type is assigned to a larger type. Narrowing conversion needs an explicit cast. Scanner is commonly used for console input.",
        example: "int marks = 95;\ndouble value = marks;       // widening\ndouble price = 99.8;\nint whole = (int) price;   // narrowing",
        practice: "Take two integer values using Scanner and print their sum and average."
      }
    ],
    questions: [
      { question: "Which method is the usual entry point of a Java application?", options: ["main()", "start()", "run()", "execute()"], answer: 0 },
      { question: "Which type stores true or false in Java?", options: ["boolean", "char", "double", "String"], answer: 0 },
      { question: "Which of these is a narrowing conversion?", options: ["int to double", "byte to int", "double to int", "int to long"], answer: 2 },
      { question: "Which keyword creates a variable of primitive integer type?", options: ["int", "integer", "number", "IntegerType"], answer: 0 },
      { question: "Which class is commonly used for console input in Java?", options: ["Scanner", "ConsoleReader", "Input", "ReaderUtil"], answer: 0 }
    ]
  },
  "OOP": {
    overview: "Understand the four core object-oriented ideas in Java: encapsulation, inheritance, polymorphism and abstraction.",
    modules: [
      { title: "Module 1 — Classes & Objects", explanation: "A class defines the structure and behaviour of an object. An object is an instance of a class created at runtime.", example: "class Car { String model; }\nCar car = new Car();", practice: "Create a Student class with name and age fields." },
      { title: "Module 2 — Encapsulation & Abstraction", explanation: "Encapsulation protects data using access control and methods. Abstraction exposes essential behaviour while hiding implementation details.", example: "private double balance;\npublic double getBalance() { return balance; }", practice: "Make a BankAccount balance private and expose a deposit method." },
      { title: "Module 3 — Inheritance & Polymorphism", explanation: "Inheritance allows reuse between parent and child classes. Polymorphism allows one interface or parent reference to represent different child implementations.", example: "class Animal { void sound() {} }\nclass Dog extends Animal { void sound() { System.out.println(\"Bark\"); } }", practice: "Create a parent Shape class and a Circle child with an overridden method." }
    ]
  },
  "Collections": {
    overview: "Learn how Java collections store and process groups of objects using List, Set, Map and related interfaces.",
    modules: [
      { title: "Module 1 — List", explanation: "List maintains insertion order and allows duplicates. ArrayList is a common implementation.", example: "List<String> names = new ArrayList<>();\nnames.add(\"Asha\");\nnames.add(\"Ravi\");", practice: "Store five skill names in an ArrayList and print them." },
      { title: "Module 2 — Set", explanation: "Set represents unique elements. HashSet is useful when duplicate values should be removed.", example: "Set<Integer> ids = new HashSet<>();\nids.add(10);\nids.add(10); // duplicate ignored", practice: "Create a set of skills containing a duplicate and observe the result." },
      { title: "Module 3 — Map", explanation: "Map stores key-value pairs. HashMap is commonly used for fast lookup by key.", example: "Map<String, Integer> marks = new HashMap<>();\nmarks.put(\"Java\", 90);", practice: "Store three subject names and their marks in a HashMap." }
    ]
  },
  "Spring Boot": {
    overview: "Build backend applications with Spring Boot using dependency injection, controllers, services and database integration.",
    modules: [
      { title: "Module 1 — Project Structure", explanation: "A typical Spring Boot application separates controllers, services, repositories, models and configuration to keep responsibilities clear.", example: "@SpringBootApplication\npublic class SkillBridgeApplication { }", practice: "Identify the controller, service and repository packages in your project." },
      { title: "Module 2 — REST Controllers", explanation: "Controllers receive HTTP requests and return responses. Common mappings include GET, POST, PUT and DELETE.", example: "@GetMapping(\"/api/skills\")\npublic List<Skill> getSkills() { ... }", practice: "Design a GET endpoint for returning all learning topics." },
      { title: "Module 3 — Service & JPA", explanation: "The service layer contains business logic. Spring Data JPA and Hibernate map Java entities to database tables.", example: "@Entity\npublic class Skill {\n    @Id\n    @GeneratedValue\n    private Long id;\n}", practice: "Trace one request from controller to service to repository in your backend." }
    ]
  },
  React: {
    overview: "Learn how React builds interfaces from reusable components and manages state, events and API data.",
    modules: [
      { title: "Module 1 — Components", explanation: "React applications are composed of reusable components that return JSX describing the UI.", example: "function Welcome() {\n  return <h2>Welcome to SkillBridge</h2>;\n}", practice: "Create a reusable TopicCard component." },
      { title: "Module 2 — Props & State", explanation: "Props pass data from parent to child. State stores data that can change and trigger a re-render.", example: "const [count, setCount] = useState(0);", practice: "Build a counter with a button that increments the state." },
      { title: "Module 3 — Hooks & API Calls", explanation: "Hooks such as useEffect handle side effects like fetching data. fetch or Axios can call backend APIs.", example: "useEffect(() => {\n  fetch(\"http://localhost:8080/api/skills\");\n}, []);", practice: "Fetch a list of skills and display them in a component." }
    ]
  },
  SQL: {
    overview: "Learn how to query relational data using SELECT, filtering, joins, grouping and transactions.",
    modules: [
      { title: "Module 1 — SELECT & WHERE", explanation: "SELECT retrieves columns. WHERE filters rows before the result is returned.", example: "SELECT name, salary FROM employee\nWHERE salary > 50000;", practice: "Write a query to find employees from the IT department." },
      { title: "Module 2 — Joins & Grouping", explanation: "JOIN combines related tables. GROUP BY creates groups for aggregate functions such as COUNT and AVG.", example: "SELECT department, COUNT(*)\nFROM employee\nGROUP BY department;", practice: "Count employees in each department." },
      { title: "Module 3 — Transactions", explanation: "Transactions group changes so they can be committed together or rolled back when something fails.", example: "START TRANSACTION;\nUPDATE account SET balance = balance - 500 WHERE id = 1;\nCOMMIT;", practice: "Explain when ROLLBACK would be safer than COMMIT." }
    ]
  },
  Docker: {
    overview: "Understand images, containers, Dockerfiles, volumes, networking and Compose so applications can run consistently across environments.",
    modules: [
      { title: "Module 1 — Images & Containers", explanation: "A Docker image is a reusable template. A container is a running instance created from an image.", example: "docker pull nginx\ndocker run -d -p 8080:80 nginx", practice: "Run an nginx container and check it with docker ps." },
      { title: "Module 2 — Dockerfile & Volumes", explanation: "A Dockerfile describes how to build an image. Volumes persist data beyond a container's lifecycle.", example: "FROM eclipse-temurin:17\nCOPY app.jar app.jar\nENTRYPOINT [\"java\",\"-jar\",\"app.jar\"]", practice: "Explain why a database container should use persistent storage." },
      { title: "Module 3 — Networking & Compose", explanation: "Docker networks let containers communicate. Docker Compose describes multiple services in one YAML file.", example: "services:\n  backend:\n    build: .\n  db:\n    image: mysql:8", practice: "Describe how a Spring Boot container could connect to a MySQL service." }
    ]
  },
  AWS: {
    overview: "Learn the AWS services most commonly used for deploying web applications: EC2, S3, IAM, regions, Lambda and basic deployment.",
    modules: [
      { title: "Module 1 — EC2 & Regions", explanation: "EC2 provides virtual servers. Regions are geographic areas containing multiple availability zones.", example: "EC2 → virtual machine\nRegion → geographic area\nAZ → isolated location in a region", practice: "Choose where you would deploy a Spring Boot server and explain why." },
      { title: "Module 2 — S3 & IAM", explanation: "S3 stores objects in buckets. IAM controls users, roles and permissions for AWS resources.", example: "S3 bucket → resume PDFs\nIAM role → permissions for an EC2 application", practice: "Explain why an application should use a role instead of a hard-coded AWS password." },
      { title: "Module 3 — Lambda & Deployment Basics", explanation: "Lambda runs code without managing a server. A deployment flow commonly packages, configures, deploys and monitors an application.", example: "Code → Build → Deploy → Monitor → Roll back", practice: "Write five steps you would follow before putting an API into production." }
    ]
  },
  "System Design": {
    overview: "Build the foundations of scalable systems using load balancing, caching, replication, high availability and clear API contracts.",
    modules: [
      { title: "Module 1 — Scaling & Load Balancing", explanation: "Vertical scaling increases resources of one machine. Horizontal scaling adds more instances. A load balancer distributes requests across healthy instances.", example: "Client → Load Balancer → Server 1 / Server 2 / Server 3", practice: "Explain why horizontal scaling is useful when traffic grows." },
      { title: "Module 2 — Caching & Replication", explanation: "Caching reduces repeated database work. Replication keeps copies of data or services to improve availability and read capacity.", example: "Client → Cache → Database\nPrimary DB → Replica DB", practice: "Give one example where caching can reduce response time." },
      { title: "Module 3 — High Availability & API Design", explanation: "High availability plans for component failure. Good APIs have clear contracts, validation, status codes, versioning and predictable errors.", example: "GET /api/users/42\n404 → user not found", practice: "Design a simple REST endpoint for retrieving a user's learning progress." }
    ]
  }
};

const QUESTION_TEMPLATES = {
  fallback: (skill, topic) => [
    { question: `What is the main purpose of ${topic}?`, options: [`Understanding and applying ${topic}`, "Only designing UI colors", "Only storing passwords", "Only creating database backups"], answer: 0 },
    { question: `Where is ${topic} most directly used in the ${skill} learning path?`, options: ["As part of the current skill", "Only in office administration", "Only in graphic design", "Nowhere in the skill"], answer: 0 },
    { question: `What should you do first when learning ${topic}?`, options: ["Understand the core concept and examples", "Skip directly to deployment", "Delete the project", "Ignore practical examples"], answer: 0 },
    { question: `What improves understanding of ${topic}?`, options: ["Practice with a small example", "Never writing code", "Avoiding questions", "Skipping revision"], answer: 0 },
    { question: `After this lesson on ${topic}, what is a good next step?`, options: ["Practice and review mistakes", "Forget the topic immediately", "Remove the topic from the roadmap", "Stop all learning"], answer: 0 }
  ]
};

function buildFifteenQuestions(skill, topic, existingQuestions = []) {
  const source = existingQuestions.length ? existingQuestions : QUESTION_TEMPLATES.fallback(skill, topic);
  const questions = source.map((q) => ({ ...q }));

  const generated = [
    { question: `What is the main purpose of ${topic}?`, options: [`To understand and apply its core concepts`, "To remove all application logic", "To replace every other technology", "To avoid writing code"], answer: 0 },
    { question: `Which approach is best when learning ${topic}?`, options: ["Learn the concept, study examples, and practice", "Memorize without practice", "Skip fundamentals", "Only watch videos without trying examples"], answer: 0 },
    { question: `Where is ${topic} most useful in a ${skill} project?`, options: ["In the part of the application where the concept solves a real requirement", "Only in the README", "Only after deleting the source code", "Nowhere in a real project"], answer: 0 },
    { question: `Which habit improves your problem-solving ability in ${topic}?`, options: ["Build small examples and analyse mistakes", "Avoid testing", "Copy every solution without understanding", "Never review errors"], answer: 0 },
    { question: `Before using an advanced feature of ${topic}, what should you know?`, options: ["The basic syntax, purpose, and common use cases", "Only the feature name", "Nothing at all", "Only deployment commands"], answer: 0 },
    { question: `What is a good way to check whether you understood ${topic}?`, options: ["Explain it, write a small example, and solve a problem", "Read the title once", "Skip all exercises", "Depend only on memorisation"], answer: 0 },
    { question: `When debugging a problem related to ${topic}, what is a sensible first step?`, options: ["Reproduce the issue and inspect the relevant input, code, or output", "Randomly change many files", "Delete the project", "Ignore the error"], answer: 0 },
    { question: `Which result shows practical learning of ${topic}?`, options: ["You can use the concept in a small working example", "You can only repeat its name", "You avoid writing any code", "You never test it"], answer: 0 },
    { question: `How should ${topic} connect to the rest of your learning roadmap?`, options: ["Understand its dependencies and how later topics build on it", "Treat it as completely unrelated to other topics", "Skip all earlier topics", "Study only definitions forever"], answer: 0 },
    { question: `What should you do after completing a ${topic} exercise?`, options: ["Review the result, identify mistakes, and improve the solution", "Delete the solution immediately", "Never run it again", "Ignore unexpected output"], answer: 0 }
  ];
  for (const q of generated) {
    if (questions.length >= 15) break;
    questions.push(q);
  }
  while (questions.length < 15) {
    const q = source[questions.length % source.length];
    questions.push({ ...q });
  }
  return questions.slice(0, 15);
}

function getContent(skill, topic) {
  const exact = LESSON_LIBRARY[topic];
  if (exact) {
    return {
      ...exact,
      questions: buildFifteenQuestions(skill, topic, exact.questions || [])
    };
  }

  return {
    overview: `Learn the fundamentals of ${topic} as part of your ${skill} roadmap. Read each module, study the example, and complete the practice task before taking the final assessment.`,
    modules: [
      { title: `Module 1 — ${topic} Fundamentals`, explanation: `${topic} introduces the core ideas you need before solving practical problems. Focus on terminology, purpose and where the concept is used.`, example: `Example: identify a real project situation where ${topic} would be useful.`, practice: `Explain ${topic} in your own words and write one small example.` },
      { title: `Module 2 — ${topic} in Practice`, explanation: `Apply ${topic} to a small implementation. Pay attention to inputs, outputs, common mistakes and debugging steps.`, example: `Practice task: create a small ${topic} example related to ${skill}.`, practice: `Build one small example and note one mistake you corrected.` },
      { title: `Module 3 — ${topic} Review`, explanation: `Review the most important points, connect them with the rest of your roadmap, and prepare for the final assessment.`, example: `Review checklist: definition → syntax/steps → example → common mistake → real use case.`, practice: `Write three interview questions about ${topic} and answer them.` }
    ],
    questions: buildFifteenQuestions(skill, topic)
  };
}

export default function LearningTopic() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const user = getSessionUser() || { id: 1 };

  const skill = params.get("skill") || "Java";
  const topic = params.get("topic") || "Syntax & Data Types";
  const content = useMemo(() => getContent(skill, topic), [skill, topic]);

  const [currentModule, setCurrentModule] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showAssessment, setShowAssessment] = useState(false);
  const [result, setResult] = useState(null);
  const [bestProgress, setBestProgress] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.progress(user.id)
      .then((rows) => {
        const existing = rows.find((row) => row.skill === skill && row.topic === topic);
        setBestProgress(existing?.progressPercent || 0);
      })
      .catch(() => setBestProgress(0));
  }, [skill, topic, user.id]);

  const module = content.modules[currentModule];
  const allAnswered = Object.keys(answers).length === content.questions.length;

  function startAssessment() {
    setAnswers({});
    setResult(null);
    setShowAssessment(true);
  }

  async function submitAssessment() {
    let score = 0;
    content.questions.forEach((question, index) => {
      if (answers[index] === question.answer) score += 1;
    });

    const percent = Math.round((score / content.questions.length) * 100);
    const updatedProgress = Math.max(bestProgress, percent);
    const passed = percent >= 80;

    setSaving(true);
    try {
      await api.updateProgress(user.id, skill, topic, updatedProgress);
      setBestProgress(updatedProgress);
      setResult({ score, total: content.questions.length, percent, passed });
    } finally {
      setSaving(false);
    }
  }

  function retake() {
    setAnswers({});
    setResult(null);
  }

  return (
    <main className="page-shell">
      <div style={{ marginBottom: 16 }}>
        <BackButton to={`/roadmap?skill=${encodeURIComponent(skill)}`} />
      </div>

      <div className="page-head">
        <span className="eyebrow">PERSONAL LEARNING</span>
        <h1>{topic}</h1>
        <p>{skill} · guided learning module</p>
      </div>

      {!showAssessment ? (
        <section className="lesson-card learning-workspace">
          <div className="learning-meta">
            <div>
              <strong>Learning Progress</strong>
              <span>{bestProgress}%</span>
            </div>
            <div className="progress-bar">
              <span style={{ width: `${bestProgress}%` }} />
            </div>
          </div>

          <div className="module-tabs">
            {content.modules.map((item, index) => (
              <button
                key={item.title}
                className={index === currentModule ? "module-tab active" : "module-tab"}
                onClick={() => setCurrentModule(index)}
              >
                {index + 1}. {item.title.replace(/^Module \d+ — /, "")}
              </button>
            ))}
          </div>

          <div className="module-content">
            <span className="eyebrow">MODULE {currentModule + 1} OF {content.modules.length}</span>
            <h2>{module.title}</h2>
            <p className="lesson-overview">{content.overview}</p>

            <h3>Learn</h3>
            <p>{module.explanation}</p>

            <h3>Example</h3>
            <pre className="code-block"><code>{module.example}</code></pre>

            <h3>Practice</h3>
            <p>{module.practice}</p>
          </div>

          <div className="button-row">
            {currentModule > 0 && (
              <button className="secondary-btn" onClick={() => setCurrentModule((value) => value - 1)}>
                Previous Module
              </button>
            )}

            {currentModule < content.modules.length - 1 ? (
              <button className="primary-btn" onClick={() => setCurrentModule((value) => value + 1)}>
                Next Module
              </button>
            ) : (
              <button className="primary-btn" onClick={startAssessment}>
                Take Final Assessment
              </button>
            )}
          </div>
        </section>
      ) : (
        <section className="quiz-card">
          {!result ? (
            <>
              <div className="assessment-intro">
                <span className="eyebrow">FINAL ASSESSMENT</span>
                <h2>Test your {topic} understanding</h2>
                <p>Answer all questions. Your score updates this topic's learning progress.</p>
              </div>

              {content.questions.map((question, index) => (
                <article className="question-card" key={`${topic}-${index}`}>
                  <div className="question-number">Question {index + 1}</div>
                  <h3>{question.question}</h3>

                  <div className="options">
                    {question.options.map((option, optionIndex) => {
                      const selected = answers[index] === optionIndex;
                      return (
                        <label className={`option ${selected ? "selected" : ""}`} key={option}>
                          <input
                            type="radio"
                            name={`final-${index}`}
                            checked={selected}
                            onChange={() =>
                              setAnswers((current) => ({ ...current, [index]: optionIndex }))
                            }
                          />
                          <span>{option}</span>
                        </label>
                      );
                    })}
                  </div>
                </article>
              ))}

              <div className="button-row">
                <button
                  className="primary-btn"
                  disabled={!allAnswered || saving}
                  onClick={submitAssessment}
                >
                  {saving ? "Updating Progress..." : "Submit Assessment"}
                </button>
                <button className="secondary-btn" onClick={() => setShowAssessment(false)}>
                  Back to Modules
                </button>
              </div>
            </>
          ) : (
            <div className="assessment-result">
              <span className="eyebrow">ASSESSMENT COMPLETE</span>
              <div className="big-score">{result.score}/{result.total}</div>
              <h2>{result.passed ? "Topic completed 🎉" : "Keep practicing"}</h2>
              <p>
                Your assessment score is <strong>{result.percent}%</strong>. Your saved learning progress is now <strong>{bestProgress}%</strong>.
              </p>

              {result.passed ? (
                <div className="success-banner">
                  ✓ {topic} is complete. Continue to the next topic from your roadmap.
                </div>
              ) : (
                <div className="error-banner">
                  Review the modules and retake the assessment. Progress never decreases, so your best score is preserved.
                </div>
              )}

              <div className="button-row">
                {!result.passed && (
                  <button className="primary-btn" onClick={retake}>Review & Retake</button>
                )}
                <button
                  className="secondary-btn"
                  onClick={() => navigate(`/roadmap?skill=${encodeURIComponent(skill)}`)}
                >
                  Back to Roadmap
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
