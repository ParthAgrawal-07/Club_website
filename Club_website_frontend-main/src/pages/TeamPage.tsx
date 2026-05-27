import BackgroundCanvas from '@/components/club/BackgroundCanvas';
import Navbar from '@/components/club/Navbar';
import Team from '@/components/club/Team';
import Footer from '@/components/club/Footer';
import Chatbot from '@/components/club/Chatbot';

const TeamPage = () => {
  return (
    <>
      <BackgroundCanvas />
      <Navbar />
      <div className="pt-16">
        <Team isHomepage={false} />
      </div>
      <Footer />
      <Chatbot />
    </>
  );
};

export default TeamPage;
