import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdDelete, MdEdit } from "react-icons/md";
import { CiPhone } from "react-icons/ci";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { TbFileDescription } from "react-icons/tb";
import { useAuth } from "../../AuthContext/AuthContext";
import ReportFlow from "../../features/reports/components/ReportFlow";
import StatePanel from "../../components/state/StatePanel";
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
  onClearSearch,
}) => {
  const { user, profile, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [loadMoreError, setLoadMoreError] = useState("");
  const [operationNotice, setOperationNotice] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [editLoadingId, setEditLoadingId] = useState(null);
  const [closingId, setClosingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmingDeleteId, setConfirmingDeleteId] = useState(null);
  const [imageFailures, setImageFailures] = useState({});
  const [reloadKey, setReloadKey] = useState(0);
  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  const campusId = profile?.campus_id || null;
  const ownerId = onlyUserItems ? user?.id : null;
  const isHomePage = typeof window !== "undefined" && window.location.pathname === "/" && !onlyUserItems;

  useEffect(() => {
    let active = true;

    const loadFirstPage = async () => {
      if (authLoading) return;
      onMetaChange?.({ loading: true, error: "" });

      if (!isAuthenticated || !campusId) {
        if (!active) return;

        if (isHomePage) {
          setItems(PUBLIC_HOME_ITEMS);
          setTotalCount(PUBLIC_HOME_ITEMS.length);
          setError(null);
          onMetaChange?.({ total: PUBLIC_HOME_ITEMS.length, loaded: PUBLIC_HOME_ITEMS.length, loading: false, error: "" });
        } else {
          setItems([]);
          setTotalCount(0);
          setError("Please log in with your verified university account to view campus items.");
          onMetaChange?.({ total: 0, loaded: 0, loading: false, error: "Authentication required." });
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
        onMetaChange?.({ total: page.total, loaded: page.items.length, loading: false, error: "" });
      } catch (loadError) {
        console.error("Campus items load error:", loadError);
        if (active) {
          setItems([]);
          setTotalCount(0);
          setError("Failed to load campus items. Please try again later.");
          onMetaChange?.({ total: 0, loaded: 0, loading: false, error: "Campus reports could not be loaded." });
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadFirstPage();
    return () => { active = false; };
  }, [authLoading, isAuthenticated, campusId, ownerId, filter, isHomePage, onMetaChange, reloadKey]);

  const visibleItems = useMemo(
    () => items.filter((item) => matchesItemSearch(item, debouncedSearch)),
    [items, debouncedSearch]
  );

  const loadMore = async () => {
    if (!hasMore || !cursor || loadingMore) return;

    try {
      setLoadingMore(true);
      setLoadMoreError("");
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
      setLoadMoreError("The next reports could not be loaded. Your current results are still available.");
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
    setOperationNotice({
      tone: "info",
      title: "Private claims are protected",
      message: "Secure claim verification is being introduced in V2. Personal contact details are not exposed from report cards.",
    });
  };

  const handleRemoveItem = async (item) => {
    if (!item.id || item.owner_id !== user?.id || closingId) return;
    try {
      setClosingId(item.id);
      setOperationNotice(null);
      await closeOwnedItem(item.id);
      setItems((previous) => previous.filter((current) => current.id !== item.id));
      setTotalCount((count) => {
        const next = Math.max(0, count - 1);
        onMetaChange?.({ total: next });
        return next;
      });
      setOperationNotice({
        tone: "success",
        title: "Report closed",
        message: `"${item.title || "Report"}" is no longer visible in the active campus feed.`,
      });
    } catch (closeError) {
      console.error("Unable to close report:", closeError);
      setOperationNotice({
        tone: "error",
        title: "Report was not closed",
        message: "Nothing was changed. Check your connection and try again.",
      });
    } finally {
      setClosingId(null);
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
      setOperationNotice({
        tone: "error",
        title: "Could not open this report",
        message: "The report is unchanged. Retry Edit when your connection is stable.",
      });
    } finally {
      setEditLoadingId(null);
    }
  };

  const requestDeleteItem = (item) => {
    if (!item?.id || item.owner_id !== user?.id || deletingId) return;
    setOperationNotice(null);
    setConfirmingDeleteId(item.id);
  };

  const handleDeleteItem = async (item) => {
    if (!item?.id || item.owner_id !== user?.id || deletingId) return;

    try {
      setDeletingId(item.id);
      const result = await deleteOwnedReport(item.id, user.id);
      if (result.storageCleanupFailed) {
        console.warn("Report deleted, but one or more storage objects need cleanup.");
      }
      setItems((previous) => previous.filter((currentItem) => currentItem.id !== item.id));
      setTotalCount((count) => {
        const next = Math.max(0, count - 1);
        onMetaChange?.({ total: next });
        return next;
      });
      if (editingItem?.id === item.id) setEditingItem(null);
      setConfirmingDeleteId(null);
      setOperationNotice({
        tone: result.storageCleanupFailed ? "warning" : "success",
        title: "Report deleted",
        message: result.storageCleanupFailed
          ? "The report is gone from the database. A background storage cleanup may still be needed."
          : `"${item.title || "Report"}" and its private details were permanently removed.`,
      });
    } catch (deleteError) {
      console.error("Unable to delete report:", deleteError);
      setOperationNotice({
        tone: "error",
        title: "Report was not deleted",
        message: "Nothing was removed. Check your connection and try again.",
      });
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
      setOperationNotice({
        tone: "success",
        title: "Report updated",
        message: `"${updatedData.title || "Report"}" is live with your latest changes.`,
      });
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
    return (
      <div className="items-list-container">
        <StatePanel
          tone="error"
          eyebrow="Campus feed"
          title="We could not load these reports"
          description={error}
          action={{ label: "Try again", onClick: () => setReloadKey((value) => value + 1) }}
        />
      </div>
    );
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
  const hasSearch = Boolean(debouncedSearch.trim());
  const emptyCopy = hasSearch
    ? {
        title: `No reports match “${debouncedSearch.trim()}”`,
        description: "Try a shorter keyword, a category, or a campus location.",
        action: onClearSearch ? { label: "Clear search", onClick: onClearSearch } : null,
      }
    : onlyUserItems
      ? {
          title: "You have no active reports",
          description: "When you lose or find something, your reports will appear here with edit, close and delete controls.",
          action: { label: "Report an item", onClick: () => navigate("/report", { state: { from: "/dashboard" } }) },
        }
      : filter === "lost"
        ? {
            title: "No active lost reports",
            description: "That is good news. If something goes missing, create the first lost report for your campus.",
            action: { label: "Report lost item", onClick: () => navigate("/report", { state: { kind: "lost", from: "/dashboard" } }) },
          }
        : filter === "found"
          ? {
              title: "No active found reports",
              description: "Nothing has been reported found in this campus view yet.",
              action: { label: "Report found item", onClick: () => navigate("/report", { state: { kind: "found", from: "/dashboard" } }) },
            }
          : {
              title: "The campus feed is quiet",
              description: "There are no active reports in this campus network yet. You can start the feed with a lost or found report.",
              action: { label: "Create first report", onClick: () => navigate("/report", { state: { from: "/dashboard" } }) },
            };

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

      {operationNotice && (
        <StatePanel
          compact
          tone={operationNotice.tone}
          title={operationNotice.title}
          description={operationNotice.message}
          secondaryAction={{ label: "Dismiss", onClick: () => setOperationNotice(null) }}
          className="items-operation-state"
        />
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
        <StatePanel
          tone="empty"
          eyebrow={onlyUserItems ? "My reports" : "Campus explorer"}
          title={emptyCopy.title}
          description={emptyCopy.description}
          action={emptyCopy.action}
        />
      ) : (
        <div className="items-grid">
          {visibleItems.map((item) => (
            <article
              key={item.id}
              className={`item-card ${item.role === "lost" ? "lost-card" : "found-card"}`}
            >
              <div className="card-media">
                {item.imageUrl && !imageFailures[item.id] ? (
                  <img
                    loading="lazy"
                    src={item.imageUrl}
                    alt={item.title || "Reported item"}
                    onError={() => setImageFailures((current) => ({ ...current, [item.id]: true }))}
                  />
                ) : (
                  <div className="card-image-placeholder" aria-hidden="true">
                    <span>{iconForCategory(item.category)}</span>
                    <small>{imageFailures[item.id] ? "Photo unavailable" : "No photo uploaded"}</small>
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
                      disabled={closingId === item.id || deletingId === item.id}
                    >
                      {closingId === item.id ? "Closing…" : "Close"}
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
                      onClick={() => requestDeleteItem(item)}
                      disabled={deletingId === item.id || closingId === item.id}
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

              {onlyUserItems && confirmingDeleteId === item.id && (
                <div className="item-delete-confirm" role="alert">
                  <div>
                    <strong>Delete permanently?</strong>
                    <span>This removes the report and its private details. It cannot be undone.</span>
                  </div>
                  <div className="item-delete-confirm__actions">
                    <button
                      type="button"
                      className="item-delete-confirm__cancel"
                      onClick={() => setConfirmingDeleteId(null)}
                      disabled={deletingId === item.id}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="item-delete-confirm__confirm"
                      onClick={() => handleDeleteItem(item)}
                      disabled={deletingId === item.id}
                    >
                      {deletingId === item.id ? "Deleting…" : "Yes, delete"}
                    </button>
                  </div>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {loadMoreError && (
        <StatePanel
          compact
          tone="error"
          title="Could not load the next reports"
          description={loadMoreError}
          action={{ label: "Retry", onClick: loadMore }}
        />
      )}

      {hasMore && !loadMoreError && (
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
