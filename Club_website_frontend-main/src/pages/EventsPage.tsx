import BackgroundCanvas from '@/components/club/BackgroundCanvas';
import Navbar from '@/components/club/Navbar';
import Events from '@/components/club/Events';
import Footer from '@/components/club/Footer';
import Chatbot from '@/components/club/Chatbot';

const EventsPage = () => {
  return (
    <>
      <BackgroundCanvas />
      <Navbar />
      <div className="pt-16">
        <Events isHomepage={false} />
      </div>
      <Footer />
      <Chatbot />
    </>
  );
};

export default EventsPage;
