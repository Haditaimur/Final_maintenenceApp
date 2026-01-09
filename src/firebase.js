// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth, signInAnonymously } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB5WBBBPwYnpRMSGO-b35BJwlt0nGvhukw",
  authDomain: "hotelkeep-hotelmaintenanceapp.firebaseapp.com",
  projectId: "hotelkeep-hotelmaintenanceapp",

  // ✅ FIX: use the default Firebase Storage bucket format
  storageBucket: "hotelkeep-hotelmaintenanceapp.appspot.com",

  messagingSenderId: "391774453754",
  appId: "1:391774453754:web:1dc905aaa3e315ecccae43",
  measurementId: "G-CD7CE6BWK8",
};

const app = initializeApp(firebaseConfig);

// ✅ ADD: sign in anonymously (required for Storage rules that check request.auth)
const auth = getAuth(app);
signInAnonymously(auth).catch((err) => {
  console.error("Anonymous auth failed:", err);
});

export const db = getFirestore(app);
export const storage = getStorage(app);
