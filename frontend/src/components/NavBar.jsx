export default function Navbar() {
  return (
    <nav>
      <div className="nav-logo">Neural<span>Node</span></div>
      <ul className="nav-links">
        <li><a href="#about">About</a></li>
        <li><a href="#events">Events</a></li>
        <li><a href="#projects">Projects</a></li>
        <li><a href="#team">Team</a></li>
        <li><a href="#resources">Resources</a></li>
        <li><a href="#join" className="nav-cta">Join Us</a></li>
      </ul>
    </nav>
  );
}
