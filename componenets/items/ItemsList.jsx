import React, { useEffect, useMemo, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { CiPhone } from "react-icons/ci";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { TbFileDescription } from "react-icons/tb";
import { useAuth } from "../../AuthContext/AuthContext";
import ReportFlow from "../../features/reports/components/ReportFlow";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";
import { matchesItemSearch } from "../../features/items/itemSearch";
import {
  listItems,
  closeOwnedItem,
  updateOwnedItem,
  ITEMS_PAGE_SIZE,
} from "../../features/items/repositories/supabaseItemsRepository";
import "./ItemsList.css";
import "./HomeItemsMarquee.css";

const PUBLIC_HOME_ITEMS = [
  { id: "public-card", role: "lost", title: "Card", category: "ID Card", location: "University Classroom", createdAt: "2026-08-17T21:38:45.500Z" },
  { id: "public-register", role: "lost", title: "Register", category: "Notebook", location: "CB2-303", createdAt: "2026-01-26T17:38:45.924Z" },
  { id: "public-keys", role: "lost", title: "Keys", category: "Keys", location: "Bike parking", createdAt: "2026-01-21T14:01:50.555Z" },
  { id: "public-wallet", role: "lost", title: "Army design wallet", category: "Wallet", location: "University", createdAt: "2026-01-07T03:14:26.512Z" },
  { id: "public-ring", role: "found", title: "Silver Ring", category: "Jewelry", location: "CB1 Level 6 Washroom", createdAt: "2025-11-10T12:56:02.896Z" },
  { id: "public-helmet", role: "lost", title: "Helmet", category: "Other", location: "UMT Bike Parking", createdAt: "2025-10-30T18:32:40.045Z" },
  { id: "public-id", role: "lost", title: "UMT Student ID Card", category: "ID Card", location: "SST2 10th floor / SST1 6th floor", createdAt: "2025-10-23T07:09:45.377Z" },
  { id: "public-headset", role: "lost", title: "P9 headsets", category: "Electronics", location: "SST1 to girls-side mosque road", createdAt: "2025-11-13T17:24:17.118Z" },
];

const iconForCategory = (category) => {
  const value = String(category || "").toLowerCase();
  if (value.includes("id")) return "🪪";
  if (value.includes("key")) return "🔑";
  if (value.includes("wallet")) return "👛";
  if (value.includes("jewel")) return "💍";
  if (value.includes("elect")) return "🎧";
  if (value.includes("notebook")) return "📒";
  return "🎒";
};

const ItemsList = ({ searchQuery = "", onlyUserItems = false, filter = "all", showHeader = true }) => {
  const { user, profile, isAuthenticated, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  const campusId = profile?.campus_id || null;
  const ownerId = onlyUserItems ? user?.id : null;
  const isHomePage = typeof window !== "undefined" && window.location.pathname === "/" && !onlyUserItems;

  useEffect(() => {
    let active = true;
    const loadFirstPage = async () => {
      if (authLoading) return;
      if (!isAuthenticated || !campusId) {
        if (active) {
          if (isHomePage) {
            setItems(PUBLIC_HOME_ITEMS);
            setError(null);
          } else {
            setItems([]);
            setError("Please log in with your verified university account to view campus items.");
          }
          setLoading(false);
        }
        return;
      }
      try {
        setLoading(true);
        setError(null);
        const page = await listItems({ campusId, type: filter, ownerId, pageSize: ITEMS_PAGE_SIZE });
        if (!active) return;
        setItems(page.items);
        setCursor(page.cursor);
        setHasMore(page.hasMore);
      } catch {
        if (active) setError("Failed to load items. Please try again later.");
      } finally {
        if (active) setLoading(false);
      }
    };
    loadFirstPage();
    return () => { active = false; };
  }, [authLoading, isAuthenticated, campusId, ownerId, filter, isHomePage]);

  const visibleItems = useMemo(
    () => items.filter((item) => matchesItemSearch(item, debouncedSearch)),
    [items, debouncedSearch]
  );

  const loadMore = async () => {
    if (!hasMore || !cursor || loadingMore) return;
    try {
      setLoadingMore(true);
      const page = await listItems({ campusId, type: filter, ownerId, cursor, pageSize: ITEMS_PAGE_SIZE });
      setItems((previous) => {
        const seen = new Set(previous.map((item) => item.id));
        return [...previous, ...page.items.filter((item) => !seen.has(item.id))];
      });
      setCursor(page.cursor);
      setHasMore(page.hasMore);
    } catch {
      setError("Could not load more items. Please try again.");
    } finally {
      setLoadingMore(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    try {
      return new Date(timestamp).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
      });
    } catch { return "Invalid date"; }
  };

  const formatShortDate = (timestamp) => {
    if (!timestamp) return "Recent";
    try {
      return new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch { return "Recent"; }
  };

  const handleContactClick = () => {
    alert("Secure claims and private messaging are being introduced in V2. Personal contact details are hidden.");
  };

  const handleRemoveItem = async (item) => {
    if (!item.id || item.owner_id !== user?.id) return;
    try {
      await closeOwnedItem(item.id);
      setItems((previous) => previous.filter((current) => current.id !== item.id));
    } catch { alert("Failed to remove item. Please try again."); }
  };

  const handleUpdateItem = (item) => {
    if (item.owner_id !== user?.id) return;
    setEditingItem(item);
  };

  const handleUpdateSubmit = async (updatedData) => {
    if (!editingItem?.id || !updatedData || editingItem.owner_id !== user?.id) return;
    const patch = {
      kind: updatedData.role,
      title: updatedData.title,
      category: updatedData.category,
      description: updatedData.description || null,
      public_location: updatedData.location || null,
      occurred_at: updatedData.date ? new Date(updatedData.date).toISOString() : null,
    };
    try {
      await updateOwnedItem(editingItem.id, patch);
      setItems((previous) => previous.map((item) => item.id === editingItem.id ? {
        ...item,
        ...patch,
        role: patch.kind,
        location: patch.public_location,
        date: patch.occurred_at,
      } : item));
      setEditingItem(null);
    } catch { alert("Failed to update item. Please try again."); }
  };

  if (authLoading || loading) return <div className="items-list-container"><div className="loading"><div className="spinner" /><p>Loading campus items...</p></div></div>;
  if (error && items.length === 0) return <div className="items-list-container"><div className="error"><p>{error}</p></div></div>;

  if (isHomePage) {
    const homeItems = visibleItems.slice(0, 8);
    const marqueeItems = [...homeItems, ...homeItems];
    return (
      <section className="items-list-container home-items-showcase" aria-label="Recent campus reports">
        <div className="home-items-heading">
          <span>Real campus reports</span>
          <h2>What students are looking for right now.</h2>
        </div>
        {homeItems.length === 0 ? <div className="no-items"><p>No matching reports found.</p></div> : (
          <div className="home-items-marquee">
            <div className="home-items-track">
              {marqueeItems.map((item, index) => (
                <article key={`${item.id}-${index}`} className={`home-report-card ${item.role === "found" ? "is-found" : "is-lost"}`} aria-hidden={index >= homeItems.length ? "true" : undefined}>
                  <div className="home-report-top"><span className="home-report-status">{item.role === "found" ? "Found" : "Lost"}</span><span>{formatShortDate(item.createdAt)}</span></div>
                  <div className="home-report-icon">{iconForCategory(item.category)}</div>
                  <h3>{item.title || "Campus item"}</h3>
                  <p>{item.category || "Other"}</p>
                  <div className="home-report-location"><HiOutlineLocationMarker />{item.location || "Campus"}</div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    );
  }

  return (
    <div className="items-list-container">
      {editingItem && <div className="update-modal"><ReportFlow initialData={editingItem} onCancel={() => setEditingItem(null)} onComplete={handleUpdateSubmit} /></div>}
      {showHeader && <div className="items-header"><h2>Lost & Found Items</h2></div>}
      {visibleItems.length === 0 ? <div className="no-items"><p>No matching campus items found.</p></div> : (
        <div className="items-grid">{visibleItems.map((item) => (
          <div key={item.id} className={`item-card ${item.role === "lost" ? "lost-card" : "found-card"}`}>
            <div className="card-header"><span className={`status-badge ${item.role}`}>{item.role === "lost" ? "Lost" : "Found"}</span><span className="date">{formatDate(item.createdAt)}</span></div>
            <div className="item-title-container"><h3 className="item-title">{item.title || "Unknown Item"}</h3><p className="item-category">{item.category || "Not specified"}</p></div>
            {item.imageUrl && <div className="card-image"><img loading="lazy" src={item.imageUrl} alt={item.title || "Reported item"} /></div>}
            <div className="card-content"><p className="item-description"><TbFileDescription className="content-icon des-icon" />{item.description || "No description provided"}</p><p className="item-location"><HiOutlineLocationMarker className="content-icon" />{item.location || "Not specified"}</p></div>
            <div className="card-footer">{onlyUserItems && item.owner_id === user?.id ? <><button className="remove-item-btn" onClick={() => handleRemoveItem(item)}><MdDelete className="button-icon" /> Remove Item</button><button className="update-item-btn" onClick={() => handleUpdateItem(item)}><MdEdit className="button-icon" /> Update</button></> : <button className={`contact-btn ${item.role === "found" ? "found-btn" : "lost-btn"}`} onClick={handleContactClick}><CiPhone className="button-icon" />{item.role === "found" ? "This might be mine" : "I found this"}</button>}</div>
          </div>
        ))}</div>
      )}
      {error && <div className="error"><p>{error}</p></div>}
      {hasMore && <div className="items-pagination"><button type="button" onClick={loadMore} disabled={loadingMore}>{loadingMore ? "Loading..." : "Load more"}</button></div>}
    </div>
  );
};

export default ItemsList;
