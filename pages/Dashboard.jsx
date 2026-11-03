import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  FiArrowUpRight,
  FiCheckCircle,
  FiGrid,
  FiSearch,
  FiUser,
} from "react-icons/fi";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { RiFindReplaceLine } from "react-icons/ri";
import { TbReport, TbReportSearch } from "react-icons/tb";
import ItemsList from "../componenets/items/ItemsList";
import { useAuth } from "../AuthContext/AuthContext";
import { getOwnedItemStats } from "../features/items/repositories/supabaseItemsRepository";
import "./Dashboard.css";

const EMPTY_STATS = { total: 0, found: 0, lost: 0 };
const ALLOWED_VIEWS = new Set(["all", "lost", "found", "mine"]);

const views = [
  { id: "all", label: "All campus", icon: FiGrid },
  { id: "lost", label: "Lost", icon: TbReportSearch },
  { id: "found", label: "Found", icon: FiCheckCircle },
  { id: "mine", label: "My reports", icon: FiUser },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, profile, campus } = useAuth();

  const requestedView = searchParams.get("view");
  const [activeView, setActiveView] = useState(
    ALLOWED_VIEWS.has(requestedView) ? requestedView : "all"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState(EMPTY_STATS);
  const [feedMeta, setFeedMeta] = useState({ total: 0, loaded: 0 });

  useEffect(() => {
    let active = true;

    if (!user?.id) {
      setStats(EMPTY_STATS);
      return () => { active = false; };
    }

    getOwnedItemStats(user.id)
      .then((nextStats) => {
        if (active) setStats(nextStats);
      })
      .catch((error) => {
        console.error("Dashboard stats error:", error);
        if (active) setStats(EMPTY_STATS);
      });

    return () => { active = false; };
  }, [user?.id]);

  useEffect(() => {
    setActiveView(ALLOWED_VIEWS.has(requestedView) ? requestedView : "all");
  }, [requestedView]);

  useEffect(() => {
    if (location.hash !== "#campus-feed") return;
    requestAnimationFrame(() => {
      document.getElementById("campus-feed")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }, [location.hash, activeView]);

  const firstName = useMemo(() => {
    const displayName = profile?.display_name?.trim();
    if (displayName) return displayName.split(/\s+/)[0];

    const emailName = user?.email?.split("@")[0] || "there";
    return emailName.replace(/[._-]+/g, " ");
  }, [profile?.display_name, user?.email]);

  const campusName = campus?.name || profile?.campuses?.name || "Your campus";
  const listFilter = activeView === "lost" || activeView === "found" ? activeView : "all";
  const onlyUserItems = activeView === "mine";

  const changeView = useCallback((view, scroll = true) => {
    setActiveView(view);

    const next = new URLSearchParams(searchParams);
    if (view === "all") next.delete("view");
    else next.set("view", view);
    setSearchParams(next, { replace: true });

    if (scroll) {
      requestAnimationFrame(() => {
        document.getElementById("campus-feed")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }, [searchParams, setSearchParams]);

  const handleFeedMeta = useCallback((meta) => {
    setFeedMeta(meta);
  }, []);

  const reportItem = (kind) => {
    navigate("/report", { state: { kind, from: "/dashboard" } });
  };

  return (
    <main className="dashboard-page">
      <section className="dashboard-hero" aria-labelledby="dashboard-title">
        <div className="dashboard-hero__copy">
          <div className="dashboard-campus-pill">
            <HiOutlineLocationMarker aria-hidden="true" />
            <span>{campusName}</span>
            <span className="dashboard-campus-pill__verified">Verified network</span>
          </div>

          <p className="dashboard-kicker">Welcome back, {firstName}</p>
          <h1 id="dashboard-title">
            Find what matters.
            <span>Your campus is looking too.</span>
          </h1>

          <p className="dashboard-intro">
            Browse active reports from your campus, search by item or location,
            and report something lost or found in a few steps.
          </p>

          <div className="dashboard-hero__actions">
            <button
              type="button"
              className="dashboard-action dashboard-action--lost"
              onClick={() => reportItem("lost")}
            >
              <span className="dashboard-action__icon"><TbReport aria-hidden="true" /></span>
              <span>
                <small>Can’t find something?</small>
                Report lost item
              </span>
              <FiArrowUpRight aria-hidden="true" />
            </button>

            <button
              type="button"
              className="dashboard-action dashboard-action--found"
              onClick={() => reportItem("found")}
            >
              <span className="dashboard-action__icon"><RiFindReplaceLine aria-hidden="true" /></span>
              <span>
                <small>Picked something up?</small>
                Report found item
              </span>
              <FiArrowUpRight aria-hidden="true" />
            </button>
          </div>
        </div>

        <aside className="dashboard-snapshot" aria-label="Your report summary">
          <div className="dashboard-snapshot__heading">
            <span>Your activity</span>
            <strong>{stats.total}</strong>
            <p>active {stats.total === 1 ? "report" : "reports"}</p>
          </div>

          <div className="dashboard-snapshot__grid">
            <button type="button" onClick={() => changeView("mine")}>
              <span className="dashboard-stat-dot dashboard-stat-dot--lost" />
              <span>Lost reports</span>
              <strong>{stats.lost}</strong>
            </button>

            <button type="button" onClick={() => changeView("mine")}>
              <span className="dashboard-stat-dot dashboard-stat-dot--found" />
              <span>Found reports</span>
              <strong>{stats.found}</strong>
            </button>
          </div>

          <div className="dashboard-snapshot__note">
            <FiCheckCircle aria-hidden="true" />
            <p><strong>Campus-only discovery.</strong> Private contact details stay protected.</p>
          </div>
        </aside>
      </section>

      <section
        id="campus-feed"
        className="dashboard-explorer"
        aria-labelledby="campus-feed-title"
      >
        <header className="dashboard-explorer__header">
          <div>
            <p className="dashboard-section-kicker">Campus explorer</p>
            <h2 id="campus-feed-title">
              {activeView === "mine" ? "Your active reports" : "Active campus reports"}
            </h2>
            <p>
              {activeView === "mine"
                ? `${feedMeta.total} active ${feedMeta.total === 1 ? "report" : "reports"} created by you.`
                : `${feedMeta.total} active ${feedMeta.total === 1 ? "report" : "reports"} available in your verified campus network.`}
            </p>
          </div>

          <div className="dashboard-search">
            <FiSearch aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search item, category or location"
              aria-label="Search campus reports"
            />
            {searchQuery && (
              <button type="button" onClick={() => setSearchQuery("")} aria-label="Clear search">
                ×
              </button>
            )}
          </div>
        </header>

        <div className="dashboard-viewbar" role="tablist" aria-label="Filter campus reports">
          {views.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeView === id}
              className={activeView === id ? "is-active" : ""}
              onClick={() => changeView(id, false)}
            >
              <Icon aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>

        <div className="dashboard-feed">
          <ItemsList
            onlyUserItems={onlyUserItems}
            searchQuery={searchQuery}
            filter={listFilter}
            showHeader={false}
            onMetaChange={handleFeedMeta}
          />
        </div>
      </section>

      <section className="dashboard-guide" aria-label="Recovery flow">
        <div>
          <span>01</span>
          <h3>Browse first</h3>
          <p>Search active campus reports before creating a duplicate.</p>
        </div>
        <div>
          <span>02</span>
          <h3>Report clearly</h3>
          <p>Add the public details another student would recognize.</p>
        </div>
        <div>
          <span>03</span>
          <h3>Recover safely</h3>
          <p>Keep sensitive contact and exact-location details private.</p>
        </div>
      </section>
    </main>
  );
}
