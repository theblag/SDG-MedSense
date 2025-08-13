import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Signin from "./pages/signin";
import Landing from "./pages/Landing";
import HealthMisinformationGuard from "./pages/healthmisinformation";
import HealthQuiz from "./pages/quiz";
import Community from "./pages/community";
import ProfilePage from "./pages/profile";
import ReportAnalyzer from "./pages/reportAnalyzer";
import Doubts from "./pages/doubts";
import About from "./pages/about";
import Testpage from "./pages/testpage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/home" element={<Home />} />
      <Route path="/signin" element={<Signin />} />
      <Route path="/healthmisinformation" element={<HealthMisinformationGuard />} />
      <Route path="/quiz" element={<HealthQuiz />} />
      <Route path="/community" element={<Community />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/reportAnalyzer" element={<ReportAnalyzer />} />
      <Route path="/doubts" element={<Doubts/>} />
      <Route path="/about" element={<About/>} />
      <Route path="/testpage" element={<Testpage/>} />
    </Routes>
  );
}

export default App;
