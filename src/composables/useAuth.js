// ============================================================
// useAuth Composable — Reactive Auth State
// ============================================================
// Provides reactive `user`, `isLoggedIn`, `loading` state.
// Use this in any Vue component to respond to auth changes.
// ============================================================

import { ref, readonly } from 'vue'
import { onAuthStateChange, logoutAdmin } from '../services/authService'

// Module-level reactive state (shared across all components)
const user = ref(null)
const isLoggedIn = ref(false)
const authLoading = ref(true) // true until Firebase confirms auth state

// Initialize the listener once (not per-component)
let initialized = false

const initAuthListener = () => {
  if (initialized) return
  initialized = true

  onAuthStateChange((firebaseUser) => {
    user.value = firebaseUser
    isLoggedIn.value = !!firebaseUser
    authLoading.value = false
  })
}

// Start listening immediately when this module is imported
initAuthListener()

/**
 * useAuth composable — use in any Vue component.
 *
 * @example
 * const { user, isLoggedIn, authLoading, logout } = useAuth()
 */
export const useAuth = () => {
  const logout = async () => {
    await logoutAdmin()
    // State updates automatically via the onAuthStateChange listener above
  }

  return {
    user: readonly(user),
    isLoggedIn: readonly(isLoggedIn),
    authLoading: readonly(authLoading),
    logout
  }
}
