/*
editorcoder
SRJC CS55.13 Fall 2025
Custom Next.js App
FavoriteButton.jsx
2025-11-04
*/

// Mark this file as a client component
"use client";

// Import React hooks for state and side effects
import { useState, useEffect } from "react";
// Import custom hook to get current user
import { useUser } from "../lib/getUser";
// Import function to toggle favorite status in Firestore
import { toggleCardFavorite } from "../lib/firebase/clientFirestoreData";
// Import CSS module styles
import styles from "./FavoriteButton.module.css";

// Default export: Component for favoriting/unfavoriting cards
export default function FavoriteButton({ cardId, initialFavoritedBy = [] }) {
  // Get current user from custom hook
  const user = useUser();
  // Initialize state with list of users who favorited this card
  const [favoritedBy, setFavoritedBy] = useState(initialFavoritedBy);
  // Initialize state for whether current user has favorited this card
  const [isFavorite, setIsFavorite] = useState(false);
  // Initialize state for loading status during favorite toggle
  const [isLoading, setIsLoading] = useState(false);

  // Update isFavorite when user or favoritedBy changes
  useEffect(() => {
    // Check if user exists and is in the favoritedBy array
    if (user && favoritedBy.includes(user.uid)) {
      // Set favorite status to true if user has favorited
      setIsFavorite(true);
    } else {
      // Set favorite status to false if user hasn't favorited
      setIsFavorite(false);
    }
  }, [user, favoritedBy]); // Re-run effect when user or favoritedBy changes

  // Handler for toggling favorite status
  const handleToggleFavorite = async () => {
    // Return early if no user or already loading
    if (!user || isLoading) {
      return;
    }

    // Set loading state to true
    setIsLoading(true);
    // Get user ID from user object
    const userId = user.uid;
    // Store current favorite state before updating
    const wasFavorite = isFavorite;

    try {
      // Optimistically update local state
      // Toggle favorite status immediately
      setIsFavorite(!wasFavorite);
      // Update favoritedBy array based on current state
      if (wasFavorite) {
        // Remove user from favoritedBy array if unfavoriting
        setFavoritedBy((prev) => prev.filter((id) => id !== userId));
      } else {
        // Add user to favoritedBy array if favoriting
        setFavoritedBy((prev) => [...prev, userId]);
      }

      // Update Firestore
      // Call async function to update favorite status in database
      await toggleCardFavorite(cardId, userId);
    } catch (error) {
      // Revert optimistic update on error
      // Restore previous favorite state
      setIsFavorite(wasFavorite);
      // Restore previous favoritedBy array state
      if (wasFavorite) {
        // Add user back if we were reverting an unfavorite action
        setFavoritedBy((prev) => [...prev, userId]);
      } else {
        // Remove user if we were reverting a favorite action
        setFavoritedBy((prev) => prev.filter((id) => id !== userId));
      }
      // Log error to console
      console.error("Failed to toggle favorite:", error);
    } finally {
      // Set loading state to false regardless of success or failure
      setIsLoading(false);
    }
  };

  // Only show button if user is authenticated
  // Return null if no user (don't render button)
  if (!user) {
    return null;
  }

  return (
    <button
      className={styles.favoriteButton}
      onClick={handleToggleFavorite}
      disabled={isLoading}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorite ? "❤️" : "🩶"}
    </button>
  );
}

