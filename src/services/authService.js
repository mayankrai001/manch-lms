// ============================================================
// Auth Service — Admin Authentication
// ============================================================
// Wraps Firebase Auth methods for login/logout/state tracking.
// All admin operations require a signed-in user.
// ============================================================

import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth'
import { auth } from '../firebase/firebase'

/**
 * Login admin with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<UserCredential>}
 */
export const loginAdmin = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  } catch (error) {
    // Re-throw with user-friendly messages
    const messages = {
      'auth/user-not-found': 'No admin account found with this email.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/invalid-email': 'Invalid email address format.',
      'auth/too-many-requests': 'Too many failed attempts. Account temporarily locked.',
      'auth/invalid-credential': 'Invalid email or password.'
    }
    throw new Error(messages[error.code] || 'Login failed. Please try again.')
  }
}

/**
 * Logout the current admin.
 * @returns {Promise<void>}
 */
export const logoutAdmin = async () => {
  await signOut(auth)
}

/**
 * Get the currently signed-in user (synchronous, can be null).
 * @returns {User|null}
 */
export const getCurrentUser = () => {
  return auth.currentUser
}

/**
 * Subscribe to auth state changes.
 * Call the returned function to unsubscribe when done.
 * @param {Function} callback - Receives (user) where user is null if logged out
 * @returns {Function} unsubscribe
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback)
}

/**
 * Returns a Promise that resolves to the current user once auth is initialized.
 * Useful for router guards to avoid race conditions on page load.
 * @returns {Promise<User|null>}
 */
export const getAuthReady = () => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe()
      resolve(user)
    })
  })
}
