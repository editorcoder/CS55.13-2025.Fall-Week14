/*
editorcoder
SRJC CS55.13 Fall 2025
Custom Next.js App
CardListings.jsx
2025-11-04
*/

// Mark this file as a client component
"use client";

// This component handles the card listings page
// It receives data from src/app/page.js, such as the initial cards and search params from the URL

// Import Link component from Next.js for client-side navigation
import Link from "next/link";
// Import Image component from Next.js for optimized images
import Image from "next/image";
// Import React hooks for state and side effects
import { useState, useEffect } from "react";
// Import useRouter hook from Next.js for navigation
import { useRouter } from "next/navigation";
// Import CardFilters component for filtering cards
import CardFilters from "./CardFilters.jsx";
// Import custom hook to get current user
import { useUser } from "../lib/getUser";
// Import CSS module styles
import styles from "./Card.module.css";

// Helper function to update URL query params based on filters
function routerWithFilters(router, filters) {
  // Create new URLSearchParams object for building query string
  const queryParams = new URLSearchParams();

  // Iterate through all filter entries
  for (const [key, value] of Object.entries(filters)) {
    // Skip empty strings and default sort value
    if (value === "" || value === "title") {
      continue;
    }
    
    // Handle type filters - only add if false (unchecked)
    if (key === "typeAbility" || key === "typeItem" || key === "typeUnit") {
      // Only add to query params if filter is disabled
      if (value === false) {
        queryParams.append(key, "false");
      }
      continue;
    }
    
    // Handle cost filters separately - only add if not default
    if (key === "costMin") {
      // Get cost minimum, default to 0 if undefined
      const costMin = filters.costMin !== undefined ? filters.costMin : 0;
      // Only add to query params if not default value
      if (costMin !== 0) {
        queryParams.append(key, value);
      }
      continue;
    }
    if (key === "costMax") {
      // Get cost maximum, default to 6 if undefined
      const costMax = filters.costMax !== undefined ? filters.costMax : 6;
      // Only add to query params if not default value
      if (costMax !== 6) {
        queryParams.append(key, value);
      }
      continue;
    }
    
    // Handle showOnlyFavorites - only add if true
    if (key === "showOnlyFavorites") {
      // Only add to query params if filter is enabled
      if (value === true) {
        queryParams.append(key, "true");
      }
      continue;
    }
    
    // Add other filter values to query params if defined
    if (value !== undefined) {
      queryParams.append(key, value);
    }
  }

  // Convert query params to string
  const queryString = queryParams.toString();
  // Update URL with new query string
  router.push(`?${queryString}`);
}

// Helper function to filter and sort cards based on filter criteria
function filterAndSortCards(cards, filters, userId) {
  // Create a copy of cards array to avoid mutating original
  let filteredCards = [...cards];

  // Apply type filters (only filter if at least one type is unchecked)
  // Check if each type filter is enabled (not false)
  const typeAbility = filters.typeAbility !== false;
  const typeItem = filters.typeItem !== false;
  const typeUnit = filters.typeUnit !== false;
  
  // Only filter if not all types are selected (default state)
  if (!typeAbility || !typeItem || !typeUnit) {
    // Filter cards based on type
    filteredCards = filteredCards.filter((card) => {
      // Return true if card type matches enabled filter
      if (card.type === "Ability") return typeAbility;
      if (card.type === "Item") return typeItem;
      if (card.type === "Unit") return typeUnit;
      return false; // Unknown type, exclude it
    });
  }

  // Apply hasCatnip filter
  if (filters.hasCatnip === "Yes") {
    // Filter cards that have catnip stat
    filteredCards = filteredCards.filter((card) => card.catnip != null);
  }

  // Apply hasDefense filter
  if (filters.hasDefense === "Yes") {
    // Filter cards that have defense stat
    filteredCards = filteredCards.filter((card) => card.defense != null);
  }

  // Apply hasAttack filter
  if (filters.hasAttack === "Yes") {
    // Filter cards that have attack stat
    filteredCards = filteredCards.filter((card) => card.attack != null);
  }

  // Apply cost filter
  // Get cost range from filters, default to 0-6 if undefined
  const costMin = filters.costMin !== undefined ? filters.costMin : 0;
  const costMax = filters.costMax !== undefined ? filters.costMax : 6;
  // Only filter if not default range (0-6)
  if (costMin !== 0 || costMax !== 6) {
    // Filter cards within cost range
    filteredCards = filteredCards.filter((card) => {
      // Get card cost, default to 0 if not present
      const cardCost = card.cost || 0;
      // Check if card cost is within range
      return cardCost >= costMin && cardCost <= costMax;
    });
  }

  // Apply favorites filter - only show cards favorited by the current user
  if (filters.showOnlyFavorites === true && userId) {
    // Filter cards favorited by current user
    filteredCards = filteredCards.filter((card) => {
      // Get favoritedBy array, default to empty array if not present
      const favoritedBy = card.favoritedBy || [];
      // Check if user ID is in favoritedBy array
      return favoritedBy.includes(userId);
    });
  }

  // Apply sorting
  if (filters.sort === "title") {
    // Sort cards alphabetically by title
    filteredCards.sort((a, b) => a.title.localeCompare(b.title));
  } else if (filters.sort === "type") {
    // Sort cards alphabetically by type
    filteredCards.sort((a, b) => a.type.localeCompare(b.type));
  } else if (filters.sort === "cost") {
    // Sort cards numerically by cost
    filteredCards.sort((a, b) => (a.cost || 0) - (b.cost || 0));
  }

  // Return filtered and sorted cards
  return filteredCards;
}

// Default export: Main component for displaying card listings with filters
export default function CardListings({ initialCards, searchParams }) {
  // Get router instance for navigation
  const router = useRouter();
  // Get current user from custom hook
  const user = useUser();

  // The initial filters are the search params from the URL, useful for when the user refreshes the page
  const initialFilters = {
    // Parse typeAbility from search params, default to true if not present
    typeAbility: searchParams.typeAbility !== undefined ? searchParams.typeAbility === "true" : true,
    // Parse typeItem from search params, default to true if not present
    typeItem: searchParams.typeItem !== undefined ? searchParams.typeItem === "true" : true,
    // Parse typeUnit from search params, default to true if not present
    typeUnit: searchParams.typeUnit !== undefined ? searchParams.typeUnit === "true" : true,
    // Get hasCatnip from search params, default to empty string
    hasCatnip: searchParams.hasCatnip || "",
    // Get hasDefense from search params, default to empty string
    hasDefense: searchParams.hasDefense || "",
    // Get hasAttack from search params, default to empty string
    hasAttack: searchParams.hasAttack || "",
    // Parse costMin from search params, default to 0 if not present
    costMin: searchParams.costMin !== undefined ? parseInt(searchParams.costMin) : 0,
    // Parse costMax from search params, default to 6 if not present
    costMax: searchParams.costMax !== undefined ? parseInt(searchParams.costMax) : 6,
    // Get sort from search params, default to "title" if not present
    sort: searchParams.sort || "title",
    // Parse showOnlyFavorites from search params, default to false if not present
    showOnlyFavorites: searchParams.showOnlyFavorites !== undefined ? searchParams.showOnlyFavorites === "true" : false,
  };

  // Initialize cards with filtered results
  // Initialize filters state with initial filters
  const [filters, setFilters] = useState(initialFilters);
  // Initialize cards state with filtered and sorted initial cards
  const [cards, setCards] = useState(() =>
    filterAndSortCards(initialCards, initialFilters, user?.uid)
  );

  // Extract unique card types from initialCards
  // Create array of unique card types, sorted alphabetically
  const uniqueTypes = Array.from(
    // Create Set from card types to get unique values
    new Set(initialCards.map((card) => card.type))
  ).sort();

  // Sync filters with URL search params
  useEffect(() => {
    // Update URL query params when filters change
    routerWithFilters(router, filters);
  }, [router, filters]); // Re-run effect when router or filters change

  // Filter and sort cards based on filter state
  useEffect(() => {
    // Filter and sort cards based on current filters
    const filteredCards = filterAndSortCards(initialCards, filters, user?.uid);

    // Update cards state with filtered results
    setCards(filteredCards);
  }, [filters, initialCards, user]); // Re-run effect when filters, initialCards, or user changes

  return (
    <>
      <CardFilters
        filters={filters}
        setFilters={setFilters}
        uniqueTypes={uniqueTypes}
      />

      <section className={styles.cardDeck}>
        {cards.map((card) => (
          <article
            key={card.id}
            className={`${styles.cardSingle} ${styles[`cardColor${card.type}`]}`}
          >
            <Link href={`cards/${card.id}`}>
              <div className={styles.cardBody}>
                <div
                  className={styles.cardCost}
                  aria-label={`Catnip ${card.cost}`}
                >
                  {card.cost}
                </div>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <h4 className={styles.cardType}>
                  {card.type}
                  {card?.subtype != null && (
                    <span aria-label={`Subtype ${card.subtype}`}>
                      , {card.subtype}
                    </span>
                  )}
                </h4>
                <div className={styles.cardImageContainer}>
                  {card?.catnip != null && (
                    <div
                      className={`${styles.cardStat} ${styles.cardStatCatnip} ${styles[`statColor${card.type}`]}`}
                      aria-label={`Catnip ${card.catnip}`}
                    >
                      <span
                        aria-hidden="true"
                        className={styles.cardStatIcon}
                      >
                        🌿
                      </span>
                      {card.catnip}
                    </div>
                  )}

                  {card?.defense != null && (
                    <div
                      className={`${styles.cardStat} ${styles.cardStatDefense} ${styles[`statColor${card.type}`]}`}
                      aria-label={`Defense ${card.defense}`}
                    >
                      <span
                        aria-hidden="true"
                        className={styles.cardStatIcon}
                      >
                        🛡️
                      </span>
                      {card.defense}
                    </div>
                  )}

                  {card?.attack != null && (
                    <div
                      className={`${styles.cardStat} ${styles.cardStatAttack} ${styles[`statColor${card.type}`]}`}
                      aria-label={`Attack ${card.attack}`}
                    >
                      <span
                        aria-hidden="true"
                        className={styles.cardStatIcon}
                      >
                        💥
                      </span>
                      {card.attack}
                    </div>
                  )}

                  {card?.lives != null && (
                    <div
                      className={`${styles.cardStat} ${styles.cardStatLives} ${styles[`statColor${card.type}`]}`}
                      aria-label={`Lives ${card.lives}`}
                    >
                      <span
                        aria-hidden="true"
                        className={styles.cardStatIcon}
                      >
                        🐱
                      </span>
                      {card.lives}
                    </div>
                  )}

                  <Image
                    priority
                    src={card.imageURL}
                    fill
                    alt={card.title}
                    className={styles.cardImage}
                  />
                </div>

                {card?.mechanics != null && (
                  <p className={styles.cardMechanics}>
                    <strong>{card.mechanics}</strong>
                  </p>
                )}

                <p className={styles.cardLore}>{card.lore}</p>
              </div>
            </Link>
          </article>
        ))}
      </section>
    </>
  );
}

