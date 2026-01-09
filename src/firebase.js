import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
last month

Update firebase.js
import { getStorage } from 'firebase/storage'
last month

Create firebase.js

const firebaseConfig = {
last month

Update firebase.js
  apiKey: "AIzaSyB5WBBBPwYnpRMSGO-b35BJwlt0nGvhukw",
  authDomain: "hotelkeep-hotelmaintenanceapp.firebaseapp.com",
  projectId: "hotelkeep-hotelmaintenanceapp",
12 minutes ago

Update firebase.js
  storageBucket: "hotelkeep-hotelmaintenanceapp.firebasestorage.app",
last month

Update firebase.js
  messagingSenderId: "391774453754",
  appId: "1:391774453754:web:1dc905aaa3e315ecccae43",
  measurementId: "G-CD7CE6BWK8"
last month

Create firebase.js
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
last month

Update firebase.js
export const storage = getStorage(app)
