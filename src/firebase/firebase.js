// ============================================================
// Firebase Configuration
// ============================================================
// SETUP STEPS:
// 1. Go to https://console.firebase.google.com
// 2. Create a new project (e.g., "manch-lms")
// 3. Project Settings → Your Apps → Add app → Web (</>)
// 4. Register the app and copy the firebaseConfig object below
// 5. Replace ALL placeholder values with your actual config
// ============================================================

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔥 REPLACE with your Firebase project config
// (Found at: Firebase Console → Project Settings → Your Apps)
const firebaseConfig = {
  apiKey: "AIzaSyCsamo4P8hwQULjEjpUiHvi6Tnz8yj-VmA",
  authDomain: "manch-lms.firebaseapp.com",
  projectId: "manch-lms",
  storageBucket: "manch-lms.firebasestorage.app",
  messagingSenderId: "661154915264",
  appId: "1:661154915264:web:49a5f1a4ab7410529d1e25",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export service instances (used throughout the app)
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
