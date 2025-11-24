/*
editorcoder
SRJC CS55.13 Fall 2025
Custom Next.js App
serverStorageUtils.js
2025-11-04
*/

// Server-side Firebase Storage utility functions
// This file contains server-side functions to get download URLs from Firebase Storage

import "server-only";
import { getStorage } from "firebase/storage";
import { firebaseApp } from "./serverApp";


export async function getImageDownloadURL(imagePath) {
  try {
    const storage = getStorage(firebaseApp);
    const { getDownloadURL, ref } = await import("firebase/storage");
    const imageRef = ref(storage, imagePath);
    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error getting download URL for image:', imagePath, error);
    // Return a fallback image or empty string
    return '';
  }
}

export async function getCardImageURL(imagehome) {
  // Images are stored in 'images/cards' folder in Firebase Storage
  const imagePath = `images/cards/${imagehome}`;
  return await getImageDownloadURL(imagePath);
}
