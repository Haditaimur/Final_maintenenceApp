// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyB5WBBBPwYnpRMSGO-b35BJwlt0nGvhukw",

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

export const auth = getAuth(app);

export const authReady = auth.currentUser
  ? Promise.resolve(auth.currentUser)
  : signInAnonymously(auth).then((result) => result.user);

export const db = getFirestore(app);
export const storage = getStorage(app);
