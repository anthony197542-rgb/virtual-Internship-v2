import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth, firebaseConfigured } from './firebase'

export const watchAuth = (callback) => {
  if (!auth) return () => { }
  return onAuthStateChanged(auth, callback)
}

export const loginWithEmail = async (email, password) => {
  if (!firebaseConfigured) throw new Error('Firebase is not configured yet.')
  const result = await signInWithEmailAndPassword(auth, email, password)
  return result.user
}

export const registerWithEmail = async (email, password) => {
  if (!firebaseConfigured) throw new Error('Firebase is not configured yet.')
  const result = await createUserWithEmailAndPassword(auth, email, password)
  return result.user
}

export const loginAsGuest = async () => {
  if (!firebaseConfigured) throw new Error('Firebase is not configured yet.')
  const result = await signInAnonymously(auth)
  return result.user
}

export const logout = async () => {
  if (auth) await signOut(auth)
}
