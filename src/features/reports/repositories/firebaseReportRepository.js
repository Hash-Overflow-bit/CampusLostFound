import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig/firebaseCore";

export const firebaseReportRepository = {
  async create({ report, userId, university }) {
    if (!userId) throw new Error("Authentication is required.");
    const payload = {
      ...report,
      userId,
      university,
      status: "active",
      isDeleted: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const result = await addDoc(collection(db, "items"), payload);
    return result.id;
  },

  async update({ itemId, report, userId }) {
    if (!itemId || !userId) throw new Error("Missing ownership context.");
    await updateDoc(doc(db, "items", itemId), {
      ...report,
      updatedAt: serverTimestamp(),
    });
    return itemId;
  },
};
