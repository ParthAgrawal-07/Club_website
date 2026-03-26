import ChatBot from './components/ChatBot';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Your Existing AI Club Header/Navbar */}
      <nav className="p-4 bg-white shadow-md">
        <h1 className="text-xl font-bold text-blue-700">AI Club Portal</h1>
      </nav>

      <main className="container mx-auto p-6 flex flex-col md:flex-row gap-8">
        {/* Left Side: Event Details */}
        <div className="flex-1">
          <h2 className="text-3xl font-extrabold mb-4">AI Triathlon Highlights</h2>
          <p className="text-gray-600">Catch up on the latest robotics and coding scores...</p>
          {/* Your event cards or list here */}
        </div>

        {/* Right Side: The AI Agent (Integrated) */}
        <div className="w-full md:w-96">
          <ChatBot />
        </div>
      </main>
    </div>
  );
}
