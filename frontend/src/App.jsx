import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BackgroundCanvas from './components/BackgroundCanvas';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Events from './components/Events';
import Projects from './components/Projects';
import { Team, Resources, Blog, Footer } from './components/StaticSections';
import JoinForm from './components/JoinForm';
import AdminDashboard from './components/AdminDashboard'; // Import your new component
import EventBot from './components/EventBot'; // Your AI Agent

// This component represents your main Landing Page
const HomePage = () => (
  <>
    <Hero />
    <div className="divider"></div>
    <div className="max-w-4xl mx-auto p-6">
       <EventBot /> {/* AI Agent stays on the main page */}
    </div>
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
      <div className="relative min-h-screen">
        <BackgroundCanvas />
        <Navbar />
        
        <Routes>
          {/* Public Home Route */}
          <Route path="/" element={<HomePage />} />

          {/* Hidden Admin Route */}
          <Route path="/admin-portal-verify" element={<AdminDashboard />} />
        </Routes>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
