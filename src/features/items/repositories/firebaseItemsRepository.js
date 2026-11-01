import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../../../firebaseConfig/firebaseCore";

const ITEMS_PAGE_SIZE = 20;

const toItem = (snapshot) => ({ id: snapshot.id, ...snapshot.data() });

export const firebaseItemsRepository = {
  async listByUniversity({
    universityDomain,
    role = "all",
    ownerId = null,
    cursor = null,
    pageSize = ITEMS_PAGE_SIZE,
  }) {
    if (!universityDomain) return { items: [], cursor: null, hasMore: false };

    const constraints = [
      where("university.domain", "==", universityDomain),
      where("status", "==", "active"),
      where("isDeleted", "==", false),
    ];

    if (role !== "all") constraints.push(where("role", "==", role));
    if (ownerId) constraints.push(where("userId", "==", ownerId));

    constraints.push(orderBy("createdAt", "desc"));
    if (cursor) constraints.push(startAfter(cursor));
    constraints.push(limit(pageSize));

    const snapshot = await getDocs(query(collection(db, "items"), ...constraints));
    const docs = snapshot.docs;

    return {
      items: docs.map(toItem),
      cursor: docs.at(-1) ?? null,
      hasMore: docs.length === pageSize,
    };
  },

  async softDeleteOwnedItem({ itemId, userId }) {
    if (!itemId || !userId) throw new Error("Missing item ownership context");
    // Firebase security rules remain the authoritative ownership check in V1.
    await updateDoc(doc(db, "items", itemId), {
      isDeleted: true,
      status: "deleted",
    });
  },

  async updateOwnedItem({ itemId, userId, changes }) {
    if (!itemId || !userId) throw new Error("Missing item ownership context");
    await updateDoc(doc(db, "items", itemId), changes);
  },
};

export { ITEMS_PAGE_SIZE };
