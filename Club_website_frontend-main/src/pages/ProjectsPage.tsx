import BackgroundCanvas from '@/components/club/BackgroundCanvas';
import Navbar from '@/components/club/Navbar';
import Projects from '@/components/club/Projects';
import Footer from '@/components/club/Footer';
import Chatbot from '@/components/club/Chatbot';

const ProjectsPage = () => {
  return (
    <>
      <BackgroundCanvas />
      <Navbar />
      <div className="pt-16">
        <Projects isHomepage={false} />
      </div>
      <Footer />
      <Chatbot />
    </>
  );
};

export default ProjectsPage;
