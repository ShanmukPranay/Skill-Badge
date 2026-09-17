import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import AppHeader from "./components/AppHeader";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Onboarding from "./pages/Onboarding";
import SkillAnalysis from "./pages/SkillAnalysis";
import SkillGap from "./pages/SkillGap";
import LearningChoice from "./pages/LearningChoice";
import Roadmap from "./pages/Roadmap";
import Peers from "./pages/Peers";
import PeerProfile from "./pages/PeerProfile";
import BookSession from "./pages/BookSession";
import Sessions from "./pages/Sessions";
import Chat from "./pages/Chat";
import Progress from "./pages/Progress";
import Reassessment from "./pages/Reassessment";
import SkillAssessment from "./pages/SkillAssessment";
import LearningTopic from "./pages/LearningTopic";
import TeachSession from "./pages/TeachSession";

export default function App() {
  return (
    <BrowserRouter>
      <AppHeader />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/skill-analysis" element={<SkillAnalysis />} />
        <Route path="/skill-gap" element={<SkillGap />} />
        <Route path="/learning-choice" element={<LearningChoice />} />
        <Route path="/roadmap" element={<Roadmap />} />
        <Route path="/skill-assessment/:skill" element={<SkillAssessment />} />
        <Route path="/learn" element={<LearningTopic />} />
        <Route path="/teach" element={<TeachSession />} />
        <Route path="/peers" element={<Peers />} />
        <Route path="/peers/:peerId" element={<PeerProfile />} />
        <Route path="/sessions/book/:peerId" element={<BookSession />} />
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/reassessment" element={<Reassessment />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
