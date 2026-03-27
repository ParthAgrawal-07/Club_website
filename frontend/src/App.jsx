import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BackgroundCanvas from './components/BackgroundCanvas';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Events from './components/Events';
import Projects from './components/Projects';
import { Team, Resources, Blog, Footer } from './components/StaticSections';
import JoinForm from './components/JoinForm';
import AdminDashboard from './components/AdminDashboard'; 
import Chatbot from './components/Chatbot'; 

// 1. LandingPage Component
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

// 2. The SINGLE App Function
function App() {
  return (
    <Router>
      <div className="app-container">
        {/* These components are "Global" - they appear on every page */}
        <BackgroundCanvas />
        <Navbar />

        <Routes>
          {/* Main Website */}
          <Route path="/" element={<LandingPage />} />

          {/* Admin Control Panel */}
          <Route path="/admin-portal-verify" element={<AdminDashboard />} />
        </Routes>

        <Footer />
        
        {/* Floating AI Assistant - Stays visible everywhere */}
        <Chatbot /> 
      </div>
    </Router>
  );
}

export default App;
