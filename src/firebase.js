// src/firebase.js
// staging environment test
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyD0uV2hH1GR4YIJX9LWj9Lf9HVHQICIIUs",

  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "athena-maintenance-staging.firebaseapp.com",

  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID ||
    "athena-maintenance-staging",

  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "athena-maintenance-staging.firebasestorage.app",

  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    "254993135475",

  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:254993135475:web:0493817dd6d90c4351f706",
};

const app = initializeApp(firebaseConfig);

// ✅ ADD: Anonymous auth so Storage rules can allow uploads
export const auth = getAuth(app);

export const authReady = auth.currentUser
  ? Promise.resolve(auth.currentUser)
  : signInAnonymously(auth).then((result) => result.user);

export const db = getFirestore(app);
export const storage = getStorage(app);
