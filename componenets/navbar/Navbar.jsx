import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../AuthContext/AuthContext";
import "./Navbar.css";

const closeNavbar = () => {
  const navbarCollapse = document.getElementById("navbarContent");
  if (navbarCollapse?.classList.contains("show")) navbarCollapse.classList.remove("show");
};

export default function Navbar() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      closeNavbar();
    } catch (error) {
      console.error("Unable to sign out", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/" onClick={closeNavbar}>Campus<span className="sub-logo">LostFound</span></Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation"><span className="navbar-toggler-icon" /></button>
        <div className="collapse navbar-collapse" id="navbarContent">
          <div className="navbar-nav mx-auto">
            <NavLink className="nav-link" to="/" onClick={closeNavbar}>Home</NavLink>
            <NavLink className="nav-link" to="/about" onClick={closeNavbar}>About</NavLink>
            <NavLink className="nav-link" to="/how-it-works" onClick={closeNavbar}>How It Works</NavLink>
            <NavLink className="nav-link" to="/universities" onClick={closeNavbar}>Universities</NavLink>
            <NavLink className="nav-link" to="/blog" onClick={closeNavbar}>Blog</NavLink>
            <NavLink className="nav-link" to="/contact" onClick={closeNavbar}>Contact</NavLink>
          </div>
          <div className="d-flex align-items-center">
            {user && <Link to="/report" className="btn btn-primary me-3 report-btn" onClick={closeNavbar}>Report Item</Link>}
            {user ? (
              <div className="nav-item dropdown">
                <button className="nav-link dropdown-toggle border-0 bg-transparent" type="button" data-bs-toggle="dropdown" aria-expanded="false">Account</button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><span className="dropdown-item-text">{user.email}</span></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><Link className="dropdown-item" to="/dashboard" onClick={closeNavbar}>Dashboard</Link></li>
                  <li><Link className="dropdown-item" to="/privacy-policy" onClick={closeNavbar}>Privacy Policy</Link></li>
                  <li><Link className="dropdown-item" to="/terms-of-service" onClick={closeNavbar}>Terms of Service</Link></li>
                  <li><button className="dropdown-item" type="button" onClick={handleLogout}>Logout</button></li>
                </ul>
              </div>
            ) : (
              <div className="d-flex authenticate-user">
                <Link to="/login" className="btn btn-outline-primary me-2" onClick={closeNavbar}>Login</Link>
                <Link to="/signup" className="btn btn-primary" onClick={closeNavbar}>Signup</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
