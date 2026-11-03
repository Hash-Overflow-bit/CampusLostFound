import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  const isWorkspace = Boolean(user) && (
    location.pathname === "/dashboard" ||
    location.pathname.startsWith("/report")
  );

  const currentDashboardView = useMemo(
    () => new URLSearchParams(location.search).get("view") || "all",
    [location.search]
  );

  const closeNavbar = () => {
    setMenuOpen(false);
    setAccountOpen(false);
  };

  useEffect(() => {
    closeNavbar();
  }, [location.pathname, location.search, location.hash]);

  const goToSection = (sectionId) => {
    closeNavbar();
    const hash = `#${sectionId}`;

    if (location.pathname !== "/") {
      navigate({ pathname: "/", hash });
      return;
    }

    window.history.replaceState(null, "", hash);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleLogout = async () => {
    try {
      await logout();
      closeNavbar();
    } catch (error) {
      console.error("Unable to sign out", error);
    }
  };

  const workspaceLinkClass = (view) => {
    const isDashboard = location.pathname === "/dashboard";
    const active = isDashboard && currentDashboardView === view;
    return `campus-nav-link campus-workspace-link${active ? " is-active" : ""}`;
  };

  return (
    <nav className={`campus-nav${isWorkspace ? " campus-nav--workspace" : ""}`} aria-label="Primary navigation">
      <div className="campus-nav-inner">
        <Link
          className="campus-brand"
          to={isWorkspace ? "/dashboard" : "/"}
          onClick={closeNavbar}
          aria-label={isWorkspace ? "Campus Lost Found dashboard" : "Campus Lost Found home"}
        >
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
            {isWorkspace ? (
              <>
                <Link className={workspaceLinkClass("all")} to="/dashboard#campus-feed" onClick={closeNavbar}>Browse items</Link>
                <Link className={workspaceLinkClass("lost")} to="/dashboard?view=lost#campus-feed" onClick={closeNavbar}>Lost</Link>
                <Link className={workspaceLinkClass("found")} to="/dashboard?view=found#campus-feed" onClick={closeNavbar}>Found</Link>
                <Link className={workspaceLinkClass("mine")} to="/dashboard?view=mine#campus-feed" onClick={closeNavbar}>My reports</Link>
              </>
            ) : (
              <>
                <Link className="campus-nav-link" to="/" onClick={closeNavbar}>Home</Link>
                <button className="campus-nav-link campus-nav-scroll" type="button" onClick={() => goToSection("how-it-works")}>How it works</button>
                <button className="campus-nav-link campus-nav-scroll" type="button" onClick={() => goToSection("campuses")}>Campuses</button>
                <button className="campus-nav-link campus-nav-scroll" type="button" onClick={() => goToSection("about")}>About</button>
              </>
            )}
          </div>

          <div className="campus-nav-actions">
            {user ? (
              <>
                <Link
                  to="/report"
                  state={{ from: "/dashboard" }}
                  className="campus-nav-report"
                  onClick={closeNavbar}
                >
                  Report item <span>↗</span>
                </Link>

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
                      {!isWorkspace && <Link className="campus-dropdown-item" to="/" onClick={closeNavbar}>Public home</Link>}
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
