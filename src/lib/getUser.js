/*
editorcoder
SRJC CS55.13 Fall 2025
Custom Next.js App
getUser.js
2025-11-04
*/

// Mark this file as a client component
"use client";

// Import Firebase authentication state change listener
import { onAuthStateChanged } from "firebase/auth";
// Import React hooks for state and side effects
import { useEffect, useState } from "react";

// Import Firebase auth instance from client app
import { auth } from "./firebase/clientApp.js";

// Export custom hook to get current user
export function useUser() {
  // Initialize user state as undefined
  const [user, setUser] = useState();

  // Set up effect to listen for authentication state changes
  useEffect(() => {
    // Return unsubscribe function from auth state listener
    return onAuthStateChanged(auth, (authUser) => {
      // Update user state when auth state changes
      setUser(authUser);
    });
  }, []); // Empty dependency array means this effect runs once on mount

  // Return current user state
  return user;
}

