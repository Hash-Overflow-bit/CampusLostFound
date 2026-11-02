import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../AuthContext/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const closeNavbar = () => {
    setMenuOpen(false);
    setAccountOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeNavbar();
    } catch (error) {
      console.error("Unable to sign out", error);
    }
  };

  return (
    <nav className="campus-nav" aria-label="Primary navigation">
      <div className="campus-nav-inner">
        <Link className="campus-brand" to="/" onClick={closeNavbar} aria-label="Campus Lost Found home">
          <span className="campus-brand-mark">C</span>
          <span className="campus-brand-copy">Campus<span>LostFound</span></span>
        </Link>

        <button
          className={`campus-menu-toggle${menuOpen ? " is-open" : ""}`}
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-controls="campusNavMenu"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
        >
          <span></span><span></span><span></span>
        </button>

        <div id="campusNavMenu" className={`campus-nav-menu${menuOpen ? " is-open" : ""}`}>
          <div className="campus-nav-links">
            <NavLink className="campus-nav-link" to="/" onClick={closeNavbar}>Home</NavLink>
            <NavLink className="campus-nav-link" to="/how-it-works" onClick={closeNavbar}>How it works</NavLink>
            <NavLink className="campus-nav-link" to="/universities" onClick={closeNavbar}>Campuses</NavLink>
            <NavLink className="campus-nav-link" to="/about" onClick={closeNavbar}>About</NavLink>
          </div>

          <div className="campus-nav-actions">
            {user ? (
              <>
                <Link to="/report" className="campus-nav-report" onClick={closeNavbar}>Report item <span>↗</span></Link>
                <div className="campus-account-wrap">
                  <button
                    className="campus-account-button"
                    type="button"
                    onClick={() => setAccountOpen((open) => !open)}
                    aria-expanded={accountOpen}
                  >
                    Account <span aria-hidden="true">⌄</span>
                  </button>
                  {accountOpen && (
                    <div className="campus-dropdown" role="menu">
                      <span className="campus-account-email">{user.email}</span>
                      <Link className="campus-dropdown-item" to="/dashboard" onClick={closeNavbar}>Dashboard</Link>
                      <button className="campus-dropdown-item" type="button" onClick={handleLogout}>Log out</button>
                    </div>
                  )}
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
