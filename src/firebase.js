// src/firebase.js
// staging environment test
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyB5WBBBWPwYnpRMSG0-b35BJw1t0nGvhukw",

  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "hotelkeep-hotelmaintenanceapp.firebaseapp.com",

  projectId:
    import.meta.env.VITE_FIREBASE_PROJECT_ID ||
    "hotelkeep-hotelmaintenanceapp",

  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "hotelkeep-hotelmaintenanceapp.firebasestorage.app",

  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ||
    "391774453754",

  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:391774453754:web:1dc905aaa3e315ecccae43",
};

const app = initializeApp(firebaseConfig);

// ✅ ADD: Anonymous auth so Storage rules can allow uploads
const auth = getAuth(app);
signInAnonymously(auth).catch((err) => {
  console.error("Anonymous auth failed:", err);
});

export const db = getFirestore(app);
export const storage = getStorage(app);
