/*
editorcoder
SRJC CS55.13 Fall 2025
Custom Next.js App
Header.jsx
2025-11-04
*/

'use client';

import Link from 'next/link';
import { useEffect } from 'react';
// Import authentication functions from Firebase auth module
import {
  signInWithGoogle,
  signOut,
  onIdTokenChanged,
} from "../lib/firebase/auth";
// Import cookie management functions for session handling
import { setCookie, deleteCookie } from "cookies-next";
import styles from "./Header.module.css";

// Custom hook to manage user session state and authentication changes
function useUserSession(initialUser) {
  // Set up effect to listen for authentication state changes
  useEffect(() => {
    // Return the unsubscribe function from onIdTokenChanged
    return onIdTokenChanged(async (user) => {
      // If user is authenticated, get their ID token and set it as a cookie
      if (user) {
        // Get the user's ID token from Firebase
        const idToken = await user.getIdToken();
        // Set the ID token as a session cookie
        await setCookie("__session", idToken);
      } else {
        // If user is not authenticated, delete the session cookie
        await deleteCookie("__session");
      }
      // If the user hasn't changed, don't reload the page
      if (initialUser?.uid === user?.uid) {
        return;
      }
      // Reload the page to reflect authentication state changes
      window.location.reload();
    });
  }, [initialUser]); // Depend on initialUser to re-run effect when it changes

  // Return the initial user value
  return initialUser;
}

// Define the Header component as the default export
export default function Header({ initialUser }) {
  // Use the custom hook to manage user session state
  const user = useUserSession(initialUser);

  // Event handler for sign out action
  const handleSignOut = (event) => {
    // Prevent the default link behavior
    event.preventDefault();
    // Call the signOut function from Firebase auth
    signOut();
  };

  // Event handler for sign in action
  const handleSignIn = (event) => {
    // Prevent the default link behavior
    event.preventDefault();
    // Call the signInWithGoogle function from Firebase auth
    signInWithGoogle();
  };

  return (
    <header>
      <Link href="/" className={styles.logo}>
      <span aria-hidden="true" className={styles.logoIcon}>🐈</span>
        <h1>The Cat TCG Gallery</h1>
      </Link>

      {user ? (
        <>
          <div className={styles.profile}>
            <p>
              <img
                className={styles.profileImage}
                src={user.photoURL || "/profile.svg"}
                alt=""
              />
              {user.displayName}
            </p>

            <div className={styles.menu}>
              ...
              <ul>
                <li>{user.displayName}</li>
            
                <li>
                  <a href="#" onClick={handleSignOut}>
                    Sign Out
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div className={styles.profile}>
          <a href="#" onClick={handleSignIn}>
          ➜] Sign In with Google
          </a>
        </div>
      )}
    </header>
  );
}
