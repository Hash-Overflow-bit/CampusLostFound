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
  firebaseItemsRepository,
  ITEMS_PAGE_SIZE,
} from "../../features/items/repositories/firebaseItemsRepository";
import "./ItemsList.css";

const getUniversityDomain = (email) => email?.split("@")[1] || null;

const ItemsList = ({ searchQuery = "", onlyUserItems = false, filter = "all" }) => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const debouncedSearch = useDebouncedValue(searchQuery, 300);

  const universityDomain = getUniversityDomain(user?.email);
  const ownerId = onlyUserItems ? user?.uid : null;

  useEffect(() => {
    let active = true;

    const loadFirstPage = async () => {
      if (authLoading) return;
      if (!isAuthenticated || !universityDomain) {
        if (active) {
          setItems([]);
          setError("Please log in with your verified university account to view campus items.");
          setLoading(false);
        }
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const page = await firebaseItemsRepository.listByUniversity({
          universityDomain,
          role: filter,
          ownerId,
          pageSize: ITEMS_PAGE_SIZE,
        });
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
    return () => {
      active = false;
    };
  }, [authLoading, isAuthenticated, universityDomain, ownerId, filter]);

  const visibleItems = useMemo(
    () => items.filter((item) => matchesItemSearch(item, debouncedSearch)),
    [items, debouncedSearch]
  );

  const loadMore = async () => {
    if (!hasMore || !cursor || loadingMore) return;
    try {
      setLoadingMore(true);
      const page = await firebaseItemsRepository.listByUniversity({
        universityDomain,
        role: filter,
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
    } catch {
      setError("Could not load more items. Please try again.");
    } finally {
      setLoadingMore(false);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Unknown date";
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  const handleContactClick = () => {
    alert("Secure claims and private messaging are being introduced in V2. Personal contact details are hidden.");
  };

  const handleRemoveItem = async (item) => {
    if (!item.id || item.userId !== user?.uid) return;
    try {
      await firebaseItemsRepository.softDeleteOwnedItem({ itemId: item.id, userId: user.uid });
      setItems((previous) => previous.filter((current) => current.id !== item.id));
    } catch {
      alert("Failed to remove item. Please try again.");
    }
  };

  const handleUpdateItem = (item) => {
    if (item.userId !== user?.uid) return;
    setEditingItem(item);
  };

  const handleUpdateSubmit = async (updatedData) => {
    if (!editingItem?.id || !updatedData || !user?.uid) return;
    if (editingItem.userId !== user.uid) return;

    try {
      await firebaseItemsRepository.updateOwnedItem({
        itemId: editingItem.id,
        userId: user.uid,
        changes: updatedData,
      });
      setItems((previous) =>
        previous.map((item) =>
          item.id === editingItem.id ? { ...item, ...updatedData } : item
        )
      );
      setEditingItem(null);
    } catch {
      alert("Failed to update item. Please try again.");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="items-list-container">
        <div className="loading"><div className="spinner" /><p>Loading campus items...</p></div>
      </div>
    );
  }

  if (error && items.length === 0) {
    return <div className="items-list-container"><div className="error"><p>{error}</p></div></div>;
  }

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

      <div className="items-header">
        <h2>Lost & Found Items{universityDomain ? ` - ${universityDomain.toUpperCase()}` : ""}</h2>
      </div>

      {visibleItems.length === 0 ? (
        <div className="no-items"><p>No matching campus items found.</p></div>
      ) : (
        <div className="items-grid">
          {visibleItems.map((item) => (
            <div key={item.id} className={`item-card ${item.role === "lost" ? "lost-card" : "found-card"}`}>
              <div className="card-header">
                <span className={`status-badge ${item.role}`}>{item.role === "lost" ? "Lost" : "Found"}</span>
                <span className="date">{formatDate(item.createdAt)}</span>
              </div>
              <div className="item-title-container">
                <h3 className="item-title">{item.title || "Unknown Item"}</h3>
                <p className="item-category">{item.category || "Not specified"}</p>
              </div>
              {(item.imageUrl || item.image?.imageUrl) && (
                <div className="card-image"><img loading="lazy" src={item.imageUrl || item.image.imageUrl} alt={item.title || "Reported item"} /></div>
              )}
              <div className="card-content">
                <p className="item-description"><TbFileDescription className="content-icon des-icon" />{item.description || "No description provided"}</p>
                <p className="item-location"><HiOutlineLocationMarker className="content-icon" />{item.location || "Not specified"}</p>
                {item.university && <p className="item-university">{item.university.name || item.university}</p>}
              </div>
              <div className="card-footer">
                {onlyUserItems && item.userId === user?.uid ? (
                  <>
                    <button className="remove-item-btn" onClick={() => handleRemoveItem(item)}><MdDelete className="button-icon" /> Remove Item</button>
                    <button className="update-item-btn" onClick={() => handleUpdateItem(item)}><MdEdit className="button-icon" /> Update</button>
                  </>
                ) : (
                  <button className={`contact-btn ${item.role === "found" ? "found-btn" : "lost-btn"}`} onClick={handleContactClick}>
                    <CiPhone className="button-icon" />{item.role === "found" ? "This might be mine" : "I found this"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <div className="error"><p>{error}</p></div>}
      {hasMore && (
        <div className="items-pagination">
          <button type="button" onClick={loadMore} disabled={loadingMore}>{loadingMore ? "Loading..." : "Load more"}</button>
        </div>
      )}
    </div>
  );
};

export default ItemsList;
