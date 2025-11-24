/*
editorcoder
SRJC CS55.13 Fall 2025
Custom Next.js App
CardLikesCounter.jsx
2025-11-04
*/

// Mark this file as a client component
"use client";

// Import React hooks for state and side effects
import { useState, useEffect } from "react";
// Import Firestore functions for document reference and real-time updates
import { doc, onSnapshot } from "firebase/firestore";
// Import Firestore database instance
import { db } from "../lib/firebase/clientApp";
// Import CSS module styles
import styles from "./Card.module.css";

// Default export: Component to display and update card likes counter
export default function CardLikesCounter({ cardId, initialLikes = 0 }) {
  // Initialize state with initial likes count
  const [numberOfLikes, setNumberOfLikes] = useState(initialLikes);

  // Set up effect to listen for real-time updates
  useEffect(() => {
    // Create reference to the card document in Firestore
    const cardRef = doc(db, "cards", cardId);
    
    // Subscribe to real-time updates for the card document
    // onSnapshot returns an unsubscribe function
    const unsubscribe = onSnapshot(cardRef, (docSnapshot) => {
      // Check if document exists
      if (docSnapshot.exists()) {
        // Get document data
        const data = docSnapshot.data();
        // Update likes count from document data, default to 0 if not present
        setNumberOfLikes(data.numberOfLikes || 0);
      }
    });

    // Cleanup subscription on unmount
    // Return cleanup function that unsubscribes from updates
    return () => unsubscribe();
  }, [cardId]); // Re-run effect when cardId changes

  // Return JSX element displaying likes count
  return <p className={styles.numberOfLikes}>❤️Favorited by {numberOfLikes} users</p>;
}

