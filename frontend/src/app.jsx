import BackgroundCanvas from './components/BackgroundCanvas';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Events from './components/Events';
import Projects from './components/Projects';
import { Team, Resources, Blog, Footer } from './components/StaticSections';
import JoinForm from './components/JoinForm';

function App() {
  return (
    <>
      <BackgroundCanvas />
      <Navbar />
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
      <Footer />
    </>
  );
}

export default App;
