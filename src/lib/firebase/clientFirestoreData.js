/*
editorcoder
SRJC CS55.13 Fall 2025
Custom Next.js App
clientFirestoreData.js
2025-11-04
*/

"use client";

// Client-side Firestore data operations for Next.js App Router
// This file contains functions that can be used in client components

import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
} from "firebase/firestore";

// Import the client-side Firestore database instance
import { db } from "./clientApp";

// Toggle favorite status for a card
// Adds userId to favoritedBy array if not present, removes if present
export async function toggleCardFavorite(cardId, userId) {
  try {
    const cardRef = doc(db, "cards", cardId);
    
    // Get current document to check if user is already favorited
    const cardDoc = await getDoc(cardRef);
    
    if (!cardDoc.exists()) {
      throw new Error("Card document does not exist");
    }
    
    const cardData = cardDoc.data();
    const favoritedBy = cardData.favoritedBy || [];
    const isFavorited = favoritedBy.includes(userId);
    
    if (isFavorited) {
      // Remove user from favorites and decrement counter
      const currentLikes = cardData.numberOfLikes || 0;
      await updateDoc(cardRef, {
        favoritedBy: arrayRemove(userId),
        numberOfLikes: Math.max(0, currentLikes - 1), // Ensure it never goes below 0
      });
    } else {
      // Add user to favorites and increment counter
      await updateDoc(cardRef, {
        favoritedBy: arrayUnion(userId),
        numberOfLikes: increment(1),
      });
    }
  } catch (error) {
    console.error("Error toggling card favorite:", error);
    throw error;
  }
}

