import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BackgroundCanvas from './components/BackgroundCanvas';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Events from './components/Events';
import Projects from './components/Projects';
import { Team, Resources, Blog, Footer } from './components/StaticSections';
import JoinForm from './components/JoinForm';
import AdminDashboard from './components/AdminDashboard'; 
import Chatbot from './components/Chatbot'; // Import the new component

function App() {
  return (
    <Router>
      <div className="app-container">
        <BackgroundCanvas />
        <Navbar />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin-portal-verify" element={<AdminDashboard />} />
        </Routes>

        <Footer />
        
        {/* ── ADD THE CHATBOT HERE ── */}
        <Chatbot /> 
      </div>
    </Router>
  );
}

// 1. Define the LandingPage component FIRST so App can find it
const LandingPage = () => (
  <>
    <Hero />
    <div className="divider"></div>
    <Events />
    <div className="divider"></div>
    <Projects />
    <div className="divider"></div>
    <Team />
    <div className="divider"></div>
    <Resources />
    <div className="divider"></div>
    <Blog />
    <div className="divider"></div>
    <JoinForm />
  </>
);

// 2. Define the App function ONLY ONCE
function App() {
  return (
    <Router>
      <div className="app-container">
        {/* These components stay visible on every page */}
        <BackgroundCanvas />
        <Navbar />

        <Routes>
          {/* When URL is "/", show the full landing page */}
          <Route path="/" element={<LandingPage />} />

          {/* When URL is "/admin-portal-verify", show ONLY the admin dashboard */}
          <Route path="/admin-portal-verify" element={<AdminDashboard />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
