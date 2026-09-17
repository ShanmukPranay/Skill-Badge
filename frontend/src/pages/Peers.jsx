import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import BackButton from "../components/BackButton";

const peersByRole = {
  "Java Full Stack Developer": [
    { id: "rahul-java", name: "Rahul Kumar", skills: "Java · Spring Boot · Docker", level: "Advanced", rating: "4.8", sessions: 18, bio: "Java full-stack developer who helps learners with backend and deployment." },
    { id: "ananya-java", name: "Ananya Rao", skills: "React · Java · SQL", level: "Advanced", rating: "4.9", sessions: 21, bio: "Full-stack mentor focused on practical React and Spring Boot projects." },
    { id: "vivek-java", name: "Vivek Sharma", skills: "Hibernate · REST APIs · MySQL", level: "Intermediate", rating: "4.7", sessions: 11, bio: "Backend mentor who enjoys explaining APIs, JPA and database design." },
  ],
  "Frontend Developer": [
    { id: "meera-front", name: "Meera Nair", skills: "React · JavaScript · TypeScript", level: "Advanced", rating: "4.9", sessions: 19, bio: "Frontend engineer who teaches component design and modern React." },
    { id: "karthik-front", name: "Karthik Dev", skills: "HTML · CSS · React", level: "Advanced", rating: "4.8", sessions: 16, bio: "UI-focused developer who helps learners build responsive interfaces." },
    { id: "diya-front", name: "Diya Singh", skills: "Next.js · Testing · React", level: "Intermediate", rating: "4.7", sessions: 10, bio: "Frontend mentor with a focus on testing and production-ready apps." },
  ],
  "Backend Developer": [
    { id: "neel-back", name: "Neel Varma", skills: "Java · Spring Boot · REST APIs", level: "Advanced", rating: "4.8", sessions: 22, bio: "Backend engineer focused on clean REST APIs and Spring architecture." },
    { id: "pavan-back", name: "Pavan Reddy", skills: "SQL · Hibernate · Redis", level: "Advanced", rating: "4.9", sessions: 17, bio: "Backend mentor who teaches persistence, caching and API design." },
    { id: "sneha-back", name: "Sneha Kapoor", skills: "Python · Flask · SQL", level: "Intermediate", rating: "4.6", sessions: 9, bio: "Python backend developer who enjoys practical API projects." },
  ],
  "Python Developer": [
    { id: "harsha-python", name: "Harsha Rao", skills: "Python · Django · REST APIs", level: "Advanced", rating: "4.8", sessions: 14, bio: "Python mentor who teaches APIs and backend project structure." },
    { id: "isha-python", name: "Isha Patel", skills: "Python · Flask · SQL", level: "Advanced", rating: "4.9", sessions: 20, bio: "Flask and SQL enthusiast focused on beginner-friendly teaching." },
    { id: "rohit-python", name: "Rohit Jain", skills: "Pandas · Python · Testing", level: "Intermediate", rating: "4.7", sessions: 12, bio: "Python mentor for coding practice and data-focused projects." },
  ],
  "Data Analyst": [
    { id: "nisha-data", name: "Nisha Thomas", skills: "SQL · Excel · Power BI", level: "Advanced", rating: "4.9", sessions: 24, bio: "Data analyst who teaches SQL, dashboards and business insights." },
    { id: "amit-data", name: "Amit Mehta", skills: "Python · Pandas · Statistics", level: "Advanced", rating: "4.8", sessions: 17, bio: "Analytics mentor focused on Python and statistics fundamentals." },
    { id: "pooja-data", name: "Pooja Shah", skills: "Excel · Power BI · SQL", level: "Intermediate", rating: "4.7", sessions: 13, bio: "Dashboard mentor who helps learners turn data into clear stories." },
  ],
  "Cloud Engineer": [
    { id: "rahul-cloud", name: "Rahul Menon", skills: "AWS · Linux · Networking", level: "Advanced", rating: "4.9", sessions: 20, bio: "Cloud engineer who teaches AWS foundations and deployment." },
    { id: "zara-cloud", name: "Zara Khan", skills: "Docker · Kubernetes · AWS", level: "Advanced", rating: "4.8", sessions: 18, bio: "Cloud mentor focused on containers and scalable deployments." },
    { id: "manoj-cloud", name: "Manoj Kumar", skills: "Terraform · AWS · Monitoring", level: "Intermediate", rating: "4.7", sessions: 12, bio: "Cloud learner turned mentor for infrastructure and monitoring basics." },
  ],
  "DevOps Engineer": [
    { id: "priya-devops", name: "Priya Sharma", skills: "Docker · Jenkins · CI/CD", level: "Advanced", rating: "4.9", sessions: 24, bio: "DevOps engineer focused on automation and deployment pipelines." },
    { id: "arjun-devops", name: "Arjun Reddy", skills: "AWS · Docker · Kubernetes", level: "Advanced", rating: "4.8", sessions: 21, bio: "Cloud and DevOps mentor who teaches practical deployment workflows." },
    { id: "vikas-devops", name: "Vikas Rao", skills: "Linux · Git · Terraform", level: "Intermediate", rating: "4.7", sessions: 13, bio: "Infrastructure mentor focused on automation and Linux fundamentals." },
  ],
};

export default function Peers() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const targetRole = location.state?.targetRole || "Java Full Stack Developer";
  const peers = peersByRole[targetRole] || Object.values(peersByRole).flat();

  const filteredPeers = useMemo(
    () =>
      peers.filter((peer) =>
        `${peer.name} ${peer.skills}`.toLowerCase().includes(search.toLowerCase())
      ),
    [peers, search]
  );

  return (
    <div className="peers-page">
      <div className="peers-container">
        <div style={{ marginBottom: 16 }}>
          <BackButton to="/learning-choice" />
        </div>

        <span className="section-label">PEER LEARNING</span>
        <h1>Find a Skill Partner</h1>
        <p>
          Connect with peers who already know the skills you want to learn for{" "}
          <strong>{targetRole}</strong>.
        </p>

        <div className="peers-toolbar">
          <input
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or skill..."
          />
          <button
            className="primary-btn"
            type="button"
            onClick={() => navigate("/teach", { state: location.state })}
          >
            Teach a Skill +
          </button>
        </div>

        <div className="peer-grid">
          {filteredPeers.map((peer) => (
            <div className="peer-card" key={peer.id}>
              <div className="avatar">{peer.name.charAt(0)}</div>
              <h3>{peer.name}</h3>
              <p className="peer-skills">{peer.skills}</p>
              <p>{peer.level}</p>
              <div className="peer-meta">
                <span>⭐ {peer.rating}</span>
                <span>{peer.sessions} sessions</span>
              </div>
              <button
                className="primary-btn"
                type="button"
                onClick={() =>
                  navigate(`/peers/${peer.id}`, { state: { ...location.state, peer } })
                }
              >
                View Profile →
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
