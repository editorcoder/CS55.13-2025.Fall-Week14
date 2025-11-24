/*
editorcoder
SRJC CS55.13 Fall 2025
Custom Next.js App
serverApp.js
2025-11-04
*/

// Import server-only module to ensure this code only runs on the server
// https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#keeping-server-only-code-out-of-the-client-environment
import "server-only";

// Import cookies function from Next.js headers for accessing request cookies
import { cookies } from "next/headers";
// Import Firebase app initialization functions
import { initializeServerApp, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";



// Initialize Firebase app for server-side use
export const firebaseApp = initializeApp();

// Initialize Firestore for server-side use
export const db = getFirestore(firebaseApp);

// Returns an authenticated client SDK instance for use in Server Side Rendering and Static Site Generation
export async function getAuthenticatedAppForUser() {
  // Get the authentication ID token from the session cookie
  const authIdToken = (await cookies()).get("__session")?.value;
  
  // check for auth token
  if (authIdToken) {
    console.log("Auth ID Token exists!");
  } else {
    console.log("Auth ID Token not found.");
  }

  // Firebase Server App is a new feature in the JS SDK that allows you to instantiate the SDK with credentials retrieved from the client & has other affordances for use in server environments.
  // Initialize the Firebase server app with the ID token
  const firebaseServerApp = initializeServerApp(
    // https://github.com/firebase/firebase-js-sdk/issues/8863#issuecomment-2751401913
    // Initialize a base Firebase app first
    initializeApp(),
    {
      // Pass the authentication ID token to the server app
      authIdToken,
    }
  );

  // Get the authentication instance from the server app
  const auth = getAuth(firebaseServerApp);
  // Wait for the authentication state to be ready
  await auth.authStateReady();

  // Return both the server app instance and the current user
  return { firebaseServerApp, currentUser: auth.currentUser };
}

