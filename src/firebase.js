// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyB5WBBBPwYnpRMSGO-b35BJwlt0nGvhukw",
  authDomain: "hotelkeep-hotelmaintenanceapp.firebaseapp.com",
  projectId: "hotelkeep-hotelmaintenanceapp",
  storageBucket: "hotelkeep-hotelmaintenanceapp.firebasestorage.app",
  messagingSenderId: "391774453754",
  appId: "1:391774453754:web:1dc905aaa3e315ecccae43",
  measurementId: "G-CD7CE6BWK8"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app)
