import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BackgroundCanvas from './components/BackgroundCanvas';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Events from './components/Events';
import Projects from './components/Projects';
import { Team, Resources, Blog, Footer } from './components/StaticSections';
import JoinForm from './components/JoinForm';
import AdminDashboard from './components/AdminDashboard'; 


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin-portal-verify" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

// 1. Create a component for your main website content
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

function App() {
  return (
    <Router>
      <div className="app-container">
        <BackgroundCanvas />
        <Navbar />

        {/* 2. Routes decide which content to show based on the URL */}
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
