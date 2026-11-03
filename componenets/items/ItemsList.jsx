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
  ITEMS_PAGE_SIZE,
} from "../../features/items/repositories/supabaseItemsRepository";
import {
  deleteOwnedReport,
  getOwnedReportForEdit,
  updateReport,
} from "../../features/reports/repositories/supabaseReportRepository";
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
  if (value.includes("notebook") || value.includes("book")) return "📒";
  if (value.includes("bag")) return "🎒";
  if (value.includes("cloth")) return "👕";
  return "📦";
};

const lifecycleLabel = (status) => ({
  open: "Active",
  possible_match: "Possible match",
  claim_pending: "Claim pending",
  recovered: "Recovered",
  closed: "Closed",
}[status] || "Active");

const ItemsSkeleton = ({ count = 6 }) => (
  <div className="items-skeleton" aria-label="Loading campus reports" role="status">
    <div className="items-skeleton__top">
      <span className="skeleton-line skeleton-line--eyebrow" />
      <span className="skeleton-line skeleton-line--title" />
    </div>
    <div className="items-skeleton__grid">
      {Array.from({ length: count }).map((_, index) => (
        <article
          key={index}
          className={`item-skeleton-card ${index % 3 === 1 ? "is-found" : "is-lost"}`}
          aria-hidden="true"
        >
          <div className="item-skeleton-card__media">
            <span className="skeleton-chip" />
            <span className="skeleton-chip skeleton-chip--small" />
          </div>
          <div className="item-skeleton-card__body">
            <span className="skeleton-line skeleton-line--small" />
            <span className="skeleton-line skeleton-line--card-title" />
            <span className="skeleton-line skeleton-line--copy" />
            <span className="skeleton-line skeleton-line--copy skeleton-line--short" />
            <span className="skeleton-line skeleton-line--button" />
          </div>
        </article>
      ))}
    </div>
    <span className="sr-loading-text">Loading campus reports…</span>
  </div>
);

const ItemsList = ({
  searchQuery = "",
  onlyUserItems = false,
  filter = "all",
  showHeader = true,
  onMetaChange,
}) => {
  const { user, profile, isAuthenticated, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editLoadingId, setEditLoadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  const campusId = profile?.campus_id || null;
  const ownerId = onlyUserItems ? user?.id : null;
  const isHomePage = typeof window !== "undefined" && window.location.pathname === "/" && !onlyUserItems;

  useEffect(() => {
    let active = true;

    const loadFirstPage = async () => {
      if (authLoading) return;

      if (!isAuthenticated || !campusId) {
        if (!active) return;

        if (isHomePage) {
          setItems(PUBLIC_HOME_ITEMS);
          setTotalCount(PUBLIC_HOME_ITEMS.length);
          setError(null);
          onMetaChange?.({ total: PUBLIC_HOME_ITEMS.length, loaded: PUBLIC_HOME_ITEMS.length });
        } else {
          setItems([]);
          setTotalCount(0);
          setError("Please log in with your verified university account to view campus items.");
          onMetaChange?.({ total: 0, loaded: 0 });
        }

        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const page = await listItems({
          campusId,
          type: filter,
          ownerId,
          pageSize: ITEMS_PAGE_SIZE,
        });

        if (!active) return;

        setItems(page.items);
        setTotalCount(page.total);
        setCursor(page.cursor);
        setHasMore(page.hasMore);
        onMetaChange?.({ total: page.total, loaded: page.items.length });
      } catch (loadError) {
        console.error("Campus items load error:", loadError);
        if (active) {
          setItems([]);
          setTotalCount(0);
          setError("Failed to load campus items. Please try again later.");
          onMetaChange?.({ total: 0, loaded: 0 });
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadFirstPage();
    return () => { active = false; };
  }, [authLoading, isAuthenticated, campusId, ownerId, filter, isHomePage, onMetaChange]);

  const visibleItems = useMemo(
    () => items.filter((item) => matchesItemSearch(item, debouncedSearch)),
    [items, debouncedSearch]
  );

  const loadMore = async () => {
    if (!hasMore || !cursor || loadingMore) return;

    try {
      setLoadingMore(true);
      const page = await listItems({
        campusId,
        type: filter,
        ownerId,
        cursor,
        pageSize: ITEMS_PAGE_SIZE,
      });

      setItems((previous) => {
        const seen = new Set(previous.map((item) => item.id));
        return [...previous, ...page.items.filter((item) => !seen.has(item.id))];
      });
      setCursor(page.cursor);
      setHasMore(page.hasMore);
    } catch (loadError) {
      console.error("Load more items error:", loadError);
      setError("Could not load more items. Please try again.");
    } finally {
      setLoadingMore(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Recent";
    try {
      return new Date(timestamp).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Recent";
    }
  };

  const formatShortDate = (timestamp) => {
    if (!timestamp) return "Recent";
    try {
      return new Date(timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch {
      return "Recent";
    }
  };

  const handleContactClick = () => {
    alert("Secure claims and private messaging are being introduced in V2. Personal contact details are hidden.");
  };

  const handleRemoveItem = async (item) => {
    if (!item.id || item.owner_id !== user?.id) return;
    try {
      await closeOwnedItem(item.id);
      setItems((previous) => previous.filter((current) => current.id !== item.id));
      setTotalCount((count) => Math.max(0, count - 1));
    } catch {
      alert("Failed to remove item. Please try again.");
    }
  };

  const handleUpdateItem = async (item) => {
    if (!item?.id || item.owner_id !== user?.id || editLoadingId) return;

    try {
      setEditLoadingId(item.id);
      const fullReport = await getOwnedReportForEdit(item.id, user.id);
      setEditingItem(fullReport);
    } catch (editError) {
      console.error("Unable to load report for editing:", editError);
      alert("Unable to open this report for editing. Please try again.");
    } finally {
      setEditLoadingId(null);
    }
  };

  const handleDeleteItem = async (item) => {
    if (!item?.id || item.owner_id !== user?.id || deletingId) return;

    const confirmed = window.confirm(
      `Delete "${item.title || "this report"}" permanently? This cannot be undone.`
    );
    if (!confirmed) return;

    try {
      setDeletingId(item.id);
      const result = await deleteOwnedReport(item.id, user.id);
      if (result.storageCleanupFailed) {
        console.warn("Report deleted, but one or more storage objects need cleanup.");
      }
      setItems((previous) => previous.filter((currentItem) => currentItem.id !== item.id));
      setTotalCount((count) => Math.max(0, count - 1));
      if (editingItem?.id === item.id) setEditingItem(null);
    } catch (deleteError) {
      console.error("Unable to delete report:", deleteError);
      alert("Unable to delete this report. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleUpdateSubmit = async (updatedData) => {
    if (!editingItem?.id || !updatedData || editingItem.owner_id !== user?.id) return;

    const itemPatch = {
      kind: updatedData.role,
      title: updatedData.title,
      category: updatedData.category,
      color: updatedData.color || null,
      description: updatedData.description || null,
      public_location: updatedData.location || null,
      occurred_at: updatedData.date ? new Date(updatedData.date).toISOString() : null,
    };

    try {
      const updated = await updateReport({
        itemId: editingItem.id,
        ownerId: user.id,
        itemPatch,
        privateDetails: {
          exact_location: null,
          identifying_details: null,
          contact_email: updatedData.email || user.email || null,
          contact_phone: updatedData.phone || null,
        },
        image: updatedData.image || null,
      });

      setItems((previous) => previous.map((item) => item.id === editingItem.id ? {
        ...item,
        ...itemPatch,
        role: updated.role,
        location: updated.location,
        date: itemPatch.occurred_at,
        imageUrl: updated.existingImageUrl || item.imageUrl,
      } : item));
      setEditingItem(null);
    } catch (updateError) {
      console.error("Failed to update report:", updateError);
      throw updateError;
    }
  };

  if (authLoading || loading) {
    return (
      <div className="items-list-container items-list-container--loading">
        <ItemsSkeleton count={isHomePage ? 4 : 6} />
      </div>
    );
  }

  if (error && items.length === 0) {
    return <div className="items-list-container"><div className="error"><p>{error}</p></div></div>;
  }

  if (isHomePage) {
    const homeItems = visibleItems.slice(0, 8);
    const marqueeItems = [...homeItems, ...homeItems];

    return (
      <section className="items-list-container home-items-showcase" aria-label="Recent campus reports">
        <div className="home-items-heading">
          <span>Real campus reports</span>
          <h2>What students are looking for right now.</h2>
        </div>

        {homeItems.length === 0 ? (
          <div className="no-items"><p>No matching reports found.</p></div>
        ) : (
          <div className="home-items-marquee">
            <div className="home-items-track">
              {marqueeItems.map((item, index) => (
                <article
                  key={`${item.id}-${index}`}
                  className={`home-report-card ${item.role === "found" ? "is-found" : "is-lost"}`}
                  aria-hidden={index >= homeItems.length ? "true" : undefined}
                >
                  <div className="home-report-top">
                    <span className="home-report-status">{item.role === "found" ? "Found" : "Lost"}</span>
                    <span>{formatShortDate(item.createdAt)}</span>
                  </div>
                  <div className="home-report-icon">{iconForCategory(item.category)}</div>
                  <h3>{item.title || "Campus item"}</h3>
                  <p>{item.category || "Other"}</p>
                  <div className="home-report-location">
                    <HiOutlineLocationMarker />
                    {item.location || "Campus"}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>
    );
  }

  const remaining = Math.max(0, totalCount - items.length);

  return (
    <div className="items-list-container">
      {editingItem && (
        <div className="update-modal">
          <ReportFlow
            initialData={editingItem}
            onCancel={() => setEditingItem(null)}
            onComplete={handleUpdateSubmit}
          />
        </div>
      )}

      {showHeader && (
        <div className="items-header">
          <div>
            <p className="items-header__eyebrow">Campus network</p>
            <h2>Lost & Found Items</h2>
          </div>
          <span className="items-header__count">{totalCount} active</span>
        </div>
      )}

      {visibleItems.length === 0 ? (
        <div className="no-items">
          <strong>No matching reports</strong>
          <p>Try another keyword or switch the item filter.</p>
        </div>
      ) : (
        <div className="items-grid">
          {visibleItems.map((item) => (
            <article
              key={item.id}
              className={`item-card ${item.role === "lost" ? "lost-card" : "found-card"}`}
            >
              <div className="card-media">
                {item.imageUrl ? (
                  <img loading="lazy" src={item.imageUrl} alt={item.title || "Reported item"} />
                ) : (
                  <div className="card-image-placeholder" aria-hidden="true">
                    <span>{iconForCategory(item.category)}</span>
                    <small>No photo uploaded</small>
                  </div>
                )}

                <div className="card-media__badges">
                  <span className="status-badge">{item.role === "lost" ? "Lost" : "Found"}</span>
                  <span className="lifecycle-badge">{lifecycleLabel(item.status)}</span>
                </div>
              </div>

              <div className="card-body">
                <div className="item-card__topline">
                  <span className="item-category">{item.category || "Other"}</span>
                  <span className="date">{formatDate(item.date || item.createdAt)}</span>
                </div>

                <h3 className="item-title">{item.title || "Unknown item"}</h3>

                <p className="item-description">
                  <TbFileDescription className="content-icon" />
                  <span>{item.description || "No description provided."}</span>
                </p>

                <p className="item-location">
                  <HiOutlineLocationMarker className="content-icon" />
                  <span>{item.location || "Campus location not specified"}</span>
                </p>
              </div>

              <div className="card-footer">
                {onlyUserItems && item.owner_id === user?.id ? (
                  <>
                    <button
                      className="close-item-btn"
                      onClick={() => handleRemoveItem(item)}
                      disabled={deletingId === item.id}
                    >
                      Close
                    </button>
                    <button
                      className="update-item-btn"
                      onClick={() => handleUpdateItem(item)}
                      disabled={editLoadingId === item.id || deletingId === item.id}
                    >
                      <MdEdit className="button-icon" />
                      {editLoadingId === item.id ? "Opening…" : "Edit"}
                    </button>
                    <button
                      className="delete-item-btn"
                      onClick={() => handleDeleteItem(item)}
                      disabled={deletingId === item.id}
                      aria-label={`Delete ${item.title || "report"} permanently`}
                    >
                      <MdDelete className="button-icon" />
                      {deletingId === item.id ? "Deleting…" : "Delete"}
                    </button>
                  </>
                ) : (
                  <button className="contact-btn" onClick={handleContactClick}>
                    <CiPhone className="button-icon" />
                    {item.role === "found" ? "This might be mine" : "I found this"}
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {error && items.length > 0 && <div className="error items-inline-error"><p>{error}</p></div>}

      {hasMore && (
        <div className="items-pagination">
          <button type="button" onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? (
              <span className="load-more-state">
                <span className="load-more-dots" aria-hidden="true"><i /><i /><i /></span>
                Loading more
              </span>
            ) : (
              `Load more${remaining ? ` · ${remaining} remaining` : ""}`
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default ItemsList;
