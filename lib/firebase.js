// lib/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAynH3jKu0CKDyWY4fz4QgaH72PXRrNU-Y",
  authDomain: "dnl-casanova.firebaseapp.com",
  projectId: "dnl-casanova",
  storageBucket: "dnl-casanova.appspot.com",
  messagingSenderId: "185820978125",
  appId: "1:185820978125:web:86ffbfc92589c0fc5e0284",
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firebase Storage
const storage = getStorage(firebaseApp);

// Initialize Firestore (from client-side SDK)
const db = getFirestore(firebaseApp);

// Initialize Firebase Authentication
const auth = getAuth(firebaseApp);

export { db, storage, auth };
