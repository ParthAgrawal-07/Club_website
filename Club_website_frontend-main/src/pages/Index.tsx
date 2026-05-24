import BackgroundCanvas from '@/components/club/BackgroundCanvas';
import Navbar from '@/components/club/Navbar';
import Hero from '@/components/club/Hero';
import Events from '@/components/club/Events';
import Projects from '@/components/club/Projects';
import Team from '@/components/club/Team';
import Resources from '@/components/club/Resources';
import Roadmap from '@/components/club/Roadmap';
import Blog from '@/components/club/Blog';
import JoinForm from '@/components/club/JoinForm';
import Footer from '@/components/club/Footer';
import Chatbot from '@/components/club/Chatbot';

const Index = () => (
  <>
    <BackgroundCanvas />
    <Navbar />
    <Hero />
    <div className="h-px bg-border mx-6 md:mx-12 relative z-[1]" />
    <Events />
    <div className="h-px bg-border mx-6 md:mx-12 relative z-[1]" />
    <Projects />
    <div className="h-px bg-border mx-6 md:mx-12 relative z-[1]" />
    <Team />
    <div className="h-px bg-border mx-6 md:mx-12 relative z-[1]" />
    <Resources />
    <div className="h-px bg-border mx-6 md:mx-12 relative z-[1]" />
    <Roadmap />
    <div className="h-px bg-border mx-6 md:mx-12 relative z-[1]" />
    <Blog />
    <div className="h-px bg-border mx-6 md:mx-12 relative z-[1]" />
    <JoinForm />
    <Footer />
    <Chatbot />
  </>
);

export default Index;
