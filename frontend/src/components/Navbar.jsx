import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <nav className="flex justify-between items-center p-6 bg-white/80 backdrop-blur-md sticky top-0 z-50">
      {/* 1. Use Link for the logo so it always goes back to the home route */}
      <Link to="/" className="nav-logo font-bold text-xl cursor-pointer">
        Neural<span className="text-blue-600">Node</span>
      </Link>

      <ul className="nav-links flex gap-6 items-center">
        {/* 2. Only show section links if we are on the home page */}
        {isHomePage ? (
          <>
            <li><a href="#about" className="hover:text-blue-600 transition-colors">About</a></li>
            <li><a href="#events" className="hover:text-blue-600 transition-colors">Events</a></li>
            <li><a href="#projects" className="hover:text-blue-600 transition-colors">Projects</a></li>
            <li><a href="#team" className="hover:text-blue-600 transition-colors">Team</a></li>
            <li><a href="#resources" className="hover:text-blue-600 transition-colors">Resources</a></li>
            <li><a href="#join" className="nav-cta bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all">Join Us</a></li>
          </>
        ) : (
          /* 3. Show a "Back to Home" button if we are on the Admin Portal */
          <li>
            <Link to="/" className="text-blue-600 font-semibold hover:underline">
              ← Back to Main Site
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}
