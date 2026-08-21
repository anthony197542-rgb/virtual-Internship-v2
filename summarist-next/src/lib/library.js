import { addDoc, collection, getDocs, query, serverTimestamp, where } from "firebase/firestore";
import { db } from "./firebase";

export async function saveBook(userId, book) {
  if (!db || !userId) throw new Error("Firebase library is not configured.");
  const books = collection(db, "users", userId, "savedBooks");
  await addDoc(books, { ...book, userId, savedAt: serverTimestamp() });
}

export async function getSavedBooks(userId) {
  if (!db || !userId) return [];
  const snapshot = await getDocs(query(collection(db, "users", userId, "savedBooks"), where("userId", "==", userId)));
  return snapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
}
