import { collection, getDocs, setDoc, deleteDoc, doc } from 'firebase/firestore'
import { db, firebaseConfigured } from './firebase'

const libraryCollection = (userId) => collection(db, 'users', userId, 'library')

export const loadCloudLibrary = async (userId) => {
  if (!firebaseConfigured || !db || !userId) return []
  const snapshot = await getDocs(libraryCollection(userId))
  return snapshot.docs.map((book) => book.data())
}

export const saveCloudBook = async (userId, book) => {
  if (!firebaseConfigured || !db || !userId) return
  await setDoc(doc(libraryCollection(userId), book.id), book)
}

export const removeCloudBook = async (userId, bookId) => {
  if (!firebaseConfigured || !db || !userId) return
  await deleteDoc(doc(libraryCollection(userId), bookId))
}