/*
editorcoder
SRJC CS55.13 Fall 2025
Custom Next.js App
serverFirestoreData.js
2025-11-04
*/

// Server-side Firestore data operations for Next.js App Router
// This file contains functions that can be used in server components

// Import Firestore functions for database operations
import {
  collection, // Obtain a collection reference
  getDocs, // Fetch query results once
  doc, // Create a document reference
  getDoc, // Fetch a single document once
  orderBy, // Sort query results by field
  query, // Build Firestore queries
} from "firebase/firestore";

// Import the server-side Firestore database instance
import { db } from "./serverApp";
// Import server-side storage utilities
import { getCardImageURL } from "./serverStorageUtils";

// Return all card IDs for static generation (server-side)
export async function getCardIds() {
  try {
    const cardsRef = collection(db, 'cards');
    const snapshot = await getDocs(cardsRef);

    return snapshot.docs.map(doc => ({
      params: {
        id: doc.id
      }
    }));
  } catch (error) {
    console.error('Error getting card IDs:', error);
    return [];
  }
}

// Return all card info, sorted by name alphabetically (server-side)
export async function getCardInfo() {
  try {
    const cardsRef = collection(db, 'cards');
    const q = query(cardsRef, orderBy('title'));
    const snapshot = await getDocs(q);

    // Process all cards and get their image URLs
    const cardData = await Promise.all(
      snapshot.docs.map(async (doc) => {
        const data = doc.data();
        const imageURL = await getCardImageURL(data.imageHome);

        return {
          id: doc.id,
          ...data,
          imageURL: imageURL
        };
      })
    );

    return cardData;
  } catch (error) {
    console.error('Error getting card info:', error);
    return [];
  }
}

// Return specific card data (server-side)
export async function getCardSpecified(idRequested) {
  try {
    // Get the main card data
    const cardDoc = await getDoc(doc(db, 'cards', idRequested));

    if (!cardDoc.exists()) {
      return {};
    }

    const cardData = {
      id: cardDoc.id,
      ...cardDoc.data()
    };

    // Ensure favoritedBy field exists (default to empty array if not present)
    if (!cardData.favoritedBy) {
      cardData.favoritedBy = [];
    }

    // Ensure numberOfLikes field exists (default to 0 if not present)
    if (cardData.numberOfLikes === undefined || cardData.numberOfLikes === null) {
      cardData.numberOfLikes = 0;
    }

    // Get the Firebase Storage URL for the main card image
    cardData.imageURL = await getCardImageURL(cardData.imageHome);


    return cardData;
  } catch (error) {
    console.error('Error getting specific card data:', error);
    return {};
  }
}

