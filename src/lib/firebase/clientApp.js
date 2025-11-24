/*
editorcoder
SRJC CS55.13 Fall 2025
Custom Next.js App
clientApp.js
2025-11-04
*/

// Mark this file as a client component
"use client";

// Import Firebase app initialization function
import { initializeApp } from "firebase/app";
// Import Firestore database getter
import { getFirestore } from "firebase/firestore";
// Import Firebase Storage getter
import { getStorage } from "firebase/storage";
// Import Firebase Authentication getter
import { getAuth } from "firebase/auth";


// Use automatic initialization
// https://firebase.google.com/docs/app-hosting/firebase-sdks#initialize-with-no-arguments
export const firebaseApp = initializeApp();

// Initialize Firebase services
// Export Firestore database instance
export const db = getFirestore(firebaseApp);
// Export Firebase Storage instance
export const storage = getStorage(firebaseApp);
// Export Firebase Authentication instance
export const auth = getAuth(firebaseApp);