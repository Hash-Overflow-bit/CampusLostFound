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
    <nav className="campus-nav navbar navbar-expand-lg">
      <div className="container-fluid campus-nav-inner">
        <Link className="campus-brand" to="/" onClick={closeNavbar} aria-label="Campus Lost Found home">
          <span className="campus-brand-mark">C</span>
          <span className="campus-brand-copy">Campus<span>LostFound</span></span>
        </Link>

        <button className="navbar-toggler campus-menu-toggle" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent" aria-controls="navbarContent" aria-expanded="false" aria-label="Toggle navigation">
          <span></span><span></span><span></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <div className="navbar-nav campus-nav-links mx-auto">
            <NavLink className="nav-link" to="/" onClick={closeNavbar}>Home</NavLink>
            <NavLink className="nav-link" to="/how-it-works" onClick={closeNavbar}>How it works</NavLink>
            <NavLink className="nav-link" to="/universities" onClick={closeNavbar}>Campuses</NavLink>
            <NavLink className="nav-link" to="/about" onClick={closeNavbar}>About</NavLink>
          </div>

          <div className="campus-nav-actions">
            {user ? (
              <>
                <Link to="/report" className="campus-nav-report" onClick={closeNavbar}>Report item <span>↗</span></Link>
                <div className="nav-item dropdown">
                  <button className="campus-account-button dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">Account</button>
                  <ul className="dropdown-menu dropdown-menu-end campus-dropdown">
                    <li><span className="dropdown-item-text campus-account-email">{user.email}</span></li>
                    <li><Link className="dropdown-item" to="/dashboard" onClick={closeNavbar}>Dashboard</Link></li>
                    <li><button className="dropdown-item" type="button" onClick={handleLogout}>Log out</button></li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="campus-login-link" onClick={closeNavbar}>Log in</Link>
                <Link to="/signup" className="campus-nav-report" onClick={closeNavbar}>Join campus <span>↗</span></Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
