// Firebase initializer for GitHub Pages (public)
// This file is safe to commit publicly - Firebase API keys are designed for client-side use
// and are protected by Firestore security rules and App Check.

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getAuth, signInAnonymously, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";
import { getFirestore, serverTimestamp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app-check.js";

// Firebase configuration (safe to expose publicly)
const firebaseConfig = {
  apiKey: "AIzaSyBvO1mNpKiwtZULXTFVZthE4856d-tmoQI",
  authDomain: "band-trip.firebaseapp.com",
  projectId: "band-trip",
  storageBucket: "band-trip.firebasestorage.app",
  messagingSenderId: "780025076624",
  appId: "1:780025076624:web:466281e60c79f14c8b3115"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// App Check with ReCaptcha Enterprise for production
// Debug token only enabled for localhost (not on GitHub Pages)
if (location && (location.hostname === 'localhost' || location.hostname === '127.0.0.1' || location.hostname === '::1')) {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
  console.warn('App Check debug token enabled (local dev only).');
} else {
  self.FIREBASE_APPCHECK_DEBUG_TOKEN = false;
}

// Initialize App Check with error handling
try {
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider("6Ld8SQ0sAAAAAF_xhbvIP1n1tj6BbJr-_gnW_loM"),
    isTokenAutoRefreshEnabled: true
  });
} catch (err) {
  console.warn('App Check initialization failed (likely domain not registered):', err.message);
  console.warn('Form submission may be blocked. Add your domain to Firebase App Check or disable enforcement.');
}

// Helper functions
export async function ensureAnonymousAuth() {
  if (!auth.currentUser) await signInAnonymously(auth);
}

export async function signInAdminWithGoogle() {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
}

export function onAuth(cb) {
  return onAuthStateChanged(auth, cb);
}

export { serverTimestamp };
