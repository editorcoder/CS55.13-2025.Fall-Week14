/*
editorcoder
SRJC CS55.13 Fall 2025
Week 14: Assignment 14: Final Headless CMS-Powered App 
CardListings.jsx
2025-11-24
*/

// Card listings component

// Mark this file as a client component
"use client";

// Import Next.js components
import Link from "next/link";
import Image from "next/image";
// Import Next.js hooks
import { useRouter, useSearchParams } from "next/navigation";
// Import React hooks
import { useState, useEffect, useRef } from "react";
// Import CardFilters component
import CardFilters from "./CardFilters.jsx";
// Import Card CSS styles
import styles from "./Card.module.css";

// Helper function to build query string from filters
function buildFilterQueryString(filters) {
  // Create new URLSearchParams object for building query string
  const queryParams = new URLSearchParams();

  // Iterate through all filter entries
  for (const [key, value] of Object.entries(filters)) {
    // Skip empty strings and default sort value
    if (value === "" || value === "title") {
      continue;
    }

    // Handle contentType - always add if not default
    if (key === "contentType") {
      if (value !== "Core Cards") {
        queryParams.append(key, value);
      }
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

    // Handle archetype filters - only add if false (unchecked)
    if (key === "archetypeIndoor" || key === "archetypeOutdoor" || key === "archetypeInOrOut") {
      // Only add to query params if filter is disabled
      if (value === false) {
        queryParams.append(key, "false");
      }
      continue;
    }

    // Handle environment filters - only add if false (unchecked)
    if (key === "environmentIndoor" || key === "environmentOutdoor") {
      // Only add to query params if filter is disabled
      if (value === false) {
        queryParams.append(key, "false");
      }
      continue;
    }

    // Handle cost filters separately - only add if not default
    if (key === "costMin") {
      // Get cost minimum, default to 1 if undefined
      const costMin = filters.costMin !== undefined ? filters.costMin : 1;
      // Only add to query params if not default value
      if (costMin !== 1) {
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

    // Handle level filters separately - only add if not default
    if (key === "levelMin") {
      // Get level minimum, default to 2 if undefined
      const levelMin = filters.levelMin !== undefined ? filters.levelMin : 2;
      // Only add to query params if not default value
      if (levelMin !== 2) {
        queryParams.append(key, value);
      }
      continue;
    }
    if (key === "levelMax") {
      // Get level maximum, default to 8 if undefined
      const levelMax = filters.levelMax !== undefined ? filters.levelMax : 8;
      // Only add to query params if not default value
      if (levelMax !== 8) {
        queryParams.append(key, value);
      }
      continue;
    }

    // Add other filter values to query params if defined
    if (value !== undefined) {
      queryParams.append(key, value);
    }
  }

  // Convert query params to string and return
  return queryParams.toString();
}

// Helper function to filter and sort core cards based on filter criteria
function filterAndSortCoreCards(corecards, filters) {
  // Create a copy of cards array to avoid mutating original
  let filteredCoreCards = [...corecards];

  // Apply type filters (only filter if at least one type is unchecked)
  // Check if each type filter is enabled (not false)
  const typeAbility = filters.typeAbility !== false;
  const typeItem = filters.typeItem !== false;
  const typeUnit = filters.typeUnit !== false;

  // Only filter if not all types are selected (default state)
  if (!typeAbility || !typeItem || !typeUnit) {
    // Filter core cards based on type
    filteredCoreCards = filteredCoreCards.filter((corecard) => {
      // Return true if card type matches enabled filter
      if (corecard.type === "Ability") return typeAbility;
      if (corecard.type === "Item") return typeItem;
      if (corecard.type === "Unit") return typeUnit;
      return false; // Unknown type, exclude it
    });
  }

  // Apply hasCatnip filter
  if (filters.hasCatnip === "Yes") {
    // Filter core cards that have catnip stat
    filteredCoreCards = filteredCoreCards.filter((corecard) => corecard.catnip != null);
  }

  // Apply hasDefense filter
  if (filters.hasDefense === "Yes") {
    // Filter core cards that have defense stat
    filteredCoreCards = filteredCoreCards.filter((corecard) => corecard.defense != null);
  }

  // Apply hasAttack filter
  if (filters.hasAttack === "Yes") {
    // Filter core cards that have attack stat
    filteredCoreCards = filteredCoreCards.filter((corecard) => corecard.attack != null);
  }

  // Apply cost filter
  // Get cost range from filters, default to 1-6 if undefined
  const costMin = filters.costMin !== undefined ? filters.costMin : 1;
  const costMax = filters.costMax !== undefined ? filters.costMax : 6;
  // Only filter if not default range (1-6)
  if (costMin !== 1 || costMax !== 6) {
    // Filter core cards within cost range
    filteredCoreCards = filteredCoreCards.filter((ccorecardard) => {
      // Get card cost, default to 0 if not present
      const cardCost = corecard.cost || 0;
      // Check if card cost is within range
      return cardCost >= costMin && cardCost <= costMax;
    });
  }

  // Apply sorting
  if (filters.sort === "title") {
    // Sort core cards alphabetically by title
    filteredCoreCards.sort((a, b) => a.title.localeCompare(b.title));
  } else if (filters.sort === "type") {
    // Sort core cards alphabetically by type
    filteredCoreCards.sort((a, b) => a.type.localeCompare(b.type));
  } else if (filters.sort === "cost") {
    // Sort cards numerically by cost
    filteredCoreCards.sort((a, b) => (a.cost || 0) - (b.cost || 0));
  }

  // Return filtered and sorted core cards
  return filteredCoreCards;
}

// Helper function to filter and sort avatars based on filter criteria
function filterAndSortAvatars(avatars, filters) {
  // Create a copy of avatars array to avoid mutating original
  let filteredAvatars = [...avatars];

  // Apply archetype filters (only filter if at least one archetype is unchecked)
  // Check if each archetype filter is enabled (not false)
  const archetypeIndoor = filters.archetypeIndoor !== false;
  const archetypeOutdoor = filters.archetypeOutdoor !== false;
  const archetypeInOrOut = filters.archetypeInOrOut !== false;

  // Only filter if not all archetypes are selected (default state)
  if (!archetypeIndoor || !archetypeOutdoor || !archetypeInOrOut) {
    // Filter avatars based on archetype
    filteredAvatars = filteredAvatars.filter((avatar) => {
      // Return true if avatar archetype matches enabled filter
      if (avatar.archetype === "Indoor") return archetypeIndoor;
      if (avatar.archetype === "Outdoor") return archetypeOutdoor;
      if (avatar.archetype === "In-or-Out") return archetypeInOrOut;
      return false; // Unknown archetype, exclude it
    });
  }

  // Apply sorting
  if (filters.sort === "title") {
    // Sort avatars alphabetically by title
    filteredAvatars.sort((a, b) => a.title.localeCompare(b.title));
  } else if (filters.sort === "archetype") {
    // Sort avatars alphabetically by archetype
    filteredAvatars.sort((a, b) => {
      const archetypeA = a.archetype || "";
      const archetypeB = b.archetype || "";
      return archetypeA.localeCompare(archetypeB);
    });
  }

  // Return filtered and sorted avatars
  return filteredAvatars;
}

// Helper function to filter and sort territories based on filter criteria
function filterAndSortTerritories(territories, filters) {
  // Create a copy of territories array to avoid mutating original
  let filteredTerritories = [...territories];

  // Apply environment filters (only filter if at least one environment is unchecked)
  // Check if each environment filter is enabled (not false)
  const environmentIndoor = filters.environmentIndoor !== false;
  const environmentOutdoor = filters.environmentOutdoor !== false;

  // Only filter if not all environments are selected (default state)
  if (!environmentIndoor || !environmentOutdoor) {
    // Filter territories based on environment
    filteredTerritories = filteredTerritories.filter((territory) => {
      // Return true if territory environment matches enabled filter
      if (territory.environment === "Indoor") return environmentIndoor;
      if (territory.environment === "Outdoor") return environmentOutdoor;
      return false; // Unknown environment, exclude it
    });
  }

  // Apply level filter
  // Get level range from filters, default to 2-8 if undefined
  const levelMin = filters.levelMin !== undefined ? filters.levelMin : 2;
  const levelMax = filters.levelMax !== undefined ? filters.levelMax : 8;
  // Only filter if not default range (2-8)
  if (levelMin !== 2 || levelMax !== 8) {
    // Filter territories within level range
    filteredTerritories = filteredTerritories.filter((territory) => {
      // Get territory level, default to 0 if not present
      const territoryLevel = territory.level || 0;
      // Check if territory level is within range
      return territoryLevel >= levelMin && territoryLevel <= levelMax;
    });
  }

  // Apply sorting
  if (filters.sort === "title") {
    // Sort territories alphabetically by title
    filteredTerritories.sort((a, b) => a.title.localeCompare(b.title));
  } else if (filters.sort === "environment") {
    // Sort territories alphabetically by environment
    filteredTerritories.sort((a, b) => {
      const environmentA = a.environment || "";
      const environmentB = b.environment || "";
      return environmentA.localeCompare(environmentB);
    });
  } else if (filters.sort === "level") {
    // Sort territories numerically by level
    filteredTerritories.sort((a, b) => (a.level || 0) - (b.level || 0));
  }

  // Return filtered and sorted territories
  return filteredTerritories;
}

// Main component for displaying card listings with filters
export default function CardListings({
  initialCards,
  initialAvatars,
  initialTerritories,
  searchParams: serverSearchParams,
}) {
  // Get router instance for navigation
  const router = useRouter();
  // Get search params from URL (client-side, updates on navigation)
  const clientSearchParams = useSearchParams();

  // Helper function to parse searchParams into filters object
  const parseSearchParamsToFilters = (params) => {
    // Convert URLSearchParams or object to a plain object for easier access
    const paramsObj =
      params instanceof URLSearchParams
        ? Object.fromEntries(params.entries())
        : params || {};

    const contentType = paramsObj.contentType || "Core Cards";

    // Base filters object
    const baseFilters = {
      // Get contentType from search params, default to "Core Cards" if not present
      contentType: contentType,
      // Get sort from search params, default to "title" if not present
      sort: paramsObj.sort || "title",
    };

    if (contentType === "Core Cards") {
      // Core Card specific filters
      return {
        ...baseFilters,
        // Parse typeAbility from search params, default to true if not present
        typeAbility:
          paramsObj.typeAbility !== undefined
            ? paramsObj.typeAbility === "true"
            : true,
        // Parse typeItem from search params, default to true if not present
        typeItem:
          paramsObj.typeItem !== undefined
            ? paramsObj.typeItem === "true"
            : true,
        // Parse typeUnit from search params, default to true if not present
        typeUnit:
          paramsObj.typeUnit !== undefined
            ? paramsObj.typeUnit === "true"
            : true,
        // Get hasCatnip from search params, default to empty string
        hasCatnip: paramsObj.hasCatnip || "",
        // Get hasDefense from search params, default to empty string
        hasDefense: paramsObj.hasDefense || "",
        // Get hasAttack from search params, default to empty string
        hasAttack: paramsObj.hasAttack || "",
        // Parse costMin from search params, default to 1 if not present
        costMin:
          paramsObj.costMin !== undefined ? parseInt(paramsObj.costMin) : 1,
        // Parse costMax from search params, default to 6 if not present
        costMax:
          paramsObj.costMax !== undefined ? parseInt(paramsObj.costMax) : 6,
      };
    } else if (contentType === "Avatars") {
      // Avatar-specific filters
      return {
        ...baseFilters,
        // Parse archetypeIndoor from search params, default to true if not present
        archetypeIndoor:
          paramsObj.archetypeIndoor !== undefined
            ? paramsObj.archetypeIndoor === "true"
            : true,
        // Parse archetypeOutdoor from search params, default to true if not present
        archetypeOutdoor:
          paramsObj.archetypeOutdoor !== undefined
            ? paramsObj.archetypeOutdoor === "true"
            : true,
        // Parse archetypeInOrOut from search params, default to true if not present
        archetypeInOrOut:
          paramsObj.archetypeInOrOut !== undefined
            ? paramsObj.archetypeInOrOut === "true"
            : true,
      };
    } else {
      // Territory-specific filters
      return {
        ...baseFilters,
        // Parse environmentIndoor from search params, default to true if not present
        environmentIndoor:
          paramsObj.environmentIndoor !== undefined
            ? paramsObj.environmentIndoor === "true"
            : true,
        // Parse environmentOutdoor from search params, default to true if not present
        environmentOutdoor:
          paramsObj.environmentOutdoor !== undefined
            ? paramsObj.environmentOutdoor === "true"
            : true,
        // Parse levelMin from search params, default to 2 if not present
        levelMin:
          paramsObj.levelMin !== undefined ? parseInt(paramsObj.levelMin) : 2,
        // Parse levelMax from search params, default to 8 if not present
        levelMax:
          paramsObj.levelMax !== undefined ? parseInt(paramsObj.levelMax) : 8,
      };
    }
  };

  // Use client-side search params (which update on navigation) for initial state
  // Convert URLSearchParams to object for initial filters
  const initialSearchParamsObj = clientSearchParams
    ? Object.fromEntries(clientSearchParams.entries())
    : serverSearchParams || {};

  // The initial filters are the search params from the URL, useful for when the user refreshes the page
  const initialFilters = parseSearchParamsToFilters(initialSearchParamsObj);

  // Initialize cards with filtered results
  // Initialize filters state with initial filters
  const [filters, setFilters] = useState(initialFilters);
  // Initialize content state with filtered and sorted initial data
  const [content, setContent] = useState(() => {
    const contentType = initialFilters.contentType || "Core Cards";
    if (contentType === "Core Cards") {
      return filterAndSortCoreCards(initialCards || [], initialFilters);
    } else if (contentType === "Avatars") {
      return filterAndSortAvatars(initialAvatars || [], initialFilters);
    } else {
      return filterAndSortTerritories(initialTerritories || [], initialFilters);
    }
  });

  // Ref to track if we're updating from URL to avoid infinite loops
  const isUpdatingFromUrl = useRef(false);
  // Ref to track the last query string we generated to avoid unnecessary URL updates
  const lastQueryString = useRef("");
  // Ref to track the last URL search params string to detect changes
  const lastSearchParamsString = useRef("");

  // Sync filters from URL search params when they change (e.g., browser back button)
  useEffect(() => {
    // Get current search params as string for comparison
    const currentSearchParamsString = clientSearchParams.toString();

    // Only proceed if search params have actually changed
    if (currentSearchParamsString === lastSearchParamsString.current) {
      return;
    }

    // Update the ref
    lastSearchParamsString.current = currentSearchParamsString;

    // Parse filters from current URL search params
    const filtersFromUrl = parseSearchParamsToFilters(clientSearchParams);

    // Compare with current filters to see if they're different
    const contentType = filters.contentType || "Core Cards";
    const contentTypeFromUrl = filtersFromUrl.contentType || "Core Cards";

    let filtersChanged =
      contentType !== contentTypeFromUrl ||
      filters.sort !== filtersFromUrl.sort;

    if (contentType === "Core Cards" && contentTypeFromUrl === "Core Cards") {
      filtersChanged =
        filtersChanged ||
        filters.typeAbility !== filtersFromUrl.typeAbility ||
        filters.typeItem !== filtersFromUrl.typeItem ||
        filters.typeUnit !== filtersFromUrl.typeUnit ||
        filters.hasCatnip !== filtersFromUrl.hasCatnip ||
        filters.hasDefense !== filtersFromUrl.hasDefense ||
        filters.hasAttack !== filtersFromUrl.hasAttack ||
        filters.costMin !== filtersFromUrl.costMin ||
        filters.costMax !== filtersFromUrl.costMax;
    } else if (contentType === "Avatars" && contentTypeFromUrl === "Avatars") {
      filtersChanged =
        filtersChanged ||
        filters.archetypeIndoor !== filtersFromUrl.archetypeIndoor ||
        filters.archetypeOutdoor !== filtersFromUrl.archetypeOutdoor ||
        filters.archetypeInOrOut !== filtersFromUrl.archetypeInOrOut;
    } else if (
      contentType === "Territories" &&
      contentTypeFromUrl === "Territories"
    ) {
      filtersChanged =
        filtersChanged ||
        filters.environmentIndoor !== filtersFromUrl.environmentIndoor ||
        filters.environmentOutdoor !== filtersFromUrl.environmentOutdoor ||
        filters.levelMin !== filtersFromUrl.levelMin ||
        filters.levelMax !== filtersFromUrl.levelMax;
    }

    // Only update if filters are different and we're not already updating from URL
    if (filtersChanged && !isUpdatingFromUrl.current) {
      isUpdatingFromUrl.current = true;
      setFilters(filtersFromUrl);
      // Reset flag after state update
      setTimeout(() => {
        isUpdatingFromUrl.current = false;
      }, 0);
    }
  }, [clientSearchParams, filters]); // Re-run effect when URL search params or filters change

  // Sync filters with URL search params
  useEffect(() => {
    // Only update URL if we're not updating from URL (to avoid loops)
    if (!isUpdatingFromUrl.current) {
      // Build query string from current filters
      const queryString = buildFilterQueryString(filters);

      // Only update URL if the query string has changed
      if (queryString !== lastQueryString.current) {
        lastQueryString.current = queryString;
        // Update URL with new query string
        router.push(`?${queryString}`);
      }
    }
  }, [router, filters]); // Re-run effect when router or filters change

  // Filter and sort content based on filter state
  useEffect(() => {
    // Filter and sort content based on current filters
    const contentType = filters.contentType || "Core Cards";
    let filteredContent;

    if (contentType === "Core Cards") {
      filteredContent = filterAndSortCoreCards(initialCards || [], filters);
    } else if (contentType === "Avatars") {
      filteredContent = filterAndSortAvatars(initialAvatars || [], filters);
    } else {
      filteredContent = filterAndSortTerritories(
        initialTerritories || [],
        filters
      );
    }

    // Update content state with filtered results
    setContent(filteredContent);
  }, [filters, initialCards, initialAvatars, initialTerritories]); // Re-run effect when filters or initial data change

  return (
    <>
      <CardFilters filters={filters} setFilters={setFilters} />

      <section className={styles.cardDeck}>
        {content.map((item) => {
          // Build query string from current filters
          const queryString = buildFilterQueryString(filters);
          const contentType = filters.contentType || "Core Cards";
          const isCoreCard = contentType === "Core Cards";
          const isTerritory = contentType === "Territories";
          const isAvatar = contentType === "Avatars";

          // Build href with query params if they exist
          let itemHref;
          if (isCoreCard) {
            itemHref = queryString
              ? `core-cards/${item.id}?${queryString}`
              : `core-cards/${item.id}`;
          } else if (isTerritory) {
            itemHref = queryString
              ? `territories/${item.id}?${queryString}`
              : `territories/${item.id}`;
          } else {
            itemHref = queryString
              ? `avatars/${item.id}?${queryString}`
              : `avatars/${item.id}`;
          }

          // Determine border class based on content type
          let borderClass = styles.cardBorderCore;
          if (contentType === "Avatars") {
            borderClass = styles.cardBorderAvatar;
          } else if (contentType === "Territories") {
            borderClass = styles.cardBorderTerritory;
          }

          // Determine background color class based on content type
          let backgroundColorClass = "";
          if (isCoreCard && item.type) {
            backgroundColorClass = styles[`cardColor${item.type}`];
          } else if (contentType === "Avatars") {
            backgroundColorClass = styles.cardColorAvatar;
          } else if (contentType === "Territories") {
            backgroundColorClass = styles.cardColorTerritory;
          }

          return (
            <article
              key={item.id}
              className={`${styles.cardSingle} ${borderClass} ${backgroundColorClass}`}
            >
              <Link href={itemHref}>
                <div className={styles.cardBody}>
                  {isCoreCard && item.cost != null && (
                    <div
                      className={styles.cardCost}
                      aria-label={`Cost ${item.cost}`}
                    >
                      {item.cost}
                    </div>
                  )}
                  {!isCoreCard && !isTerritory && item.archetype != null && (
                    <div
                      className={styles.cardArchetype}
                      aria-label={`Archetype ${item.archetype}`}
                    >
                      {item.archetype === "Indoor" && "🏠"}
                      {item.archetype === "Outdoor" && "🏞️"}
                      {item.archetype === "In-or-Out" && "🏘️"}
                    </div>
                  )}
                  {isTerritory && item.environment != null && (
                    <div
                      className={styles.cardArchetype}
                      aria-label={`Environment ${item.environment}`}
                    >
                      {item.environment === "Indoor" && "🏠"}
                      {item.environment === "Outdoor" && "🏞️"}
                    </div>
                  )}
                  <h3 className={styles.cardTitle}>{item.title}</h3>
                  {isCoreCard ? (
                    <h4 className={styles.cardType}>
                      {item.type}
                      {item?.subtype != null && (
                        <span aria-label={`Subtype ${item.subtype}`}>
                          {" "}
                          ({item.subtype})
                        </span>
                      )}
                    </h4>
                  ) : isTerritory ? (
                    <h4 className={styles.cardType}>Territory ({item.environment})</h4>
                  ) : (
                    <h4 className={styles.cardType}>
                      Avatar
                      {item?.archetype != null && (
                        <span aria-label={`Archetype ${item.archetype}`}>
                          {" "}
                          ({item.archetype})
                        </span>
                      )}
                    </h4>
                  )}
                  <div className={styles.cardImageContainer}>
                    {item?.catnip != null && (
                      <div
                        className={`${styles.cardStat} ${styles.cardStatCatnip} ${isCoreCard && item.type ? styles[`statColor${item.type}`] : ""}`}
                        aria-label={`Catnip ${item.catnip}`}
                      >
                        <span
                          aria-hidden="true"
                          className={styles.cardStatIcon}
                        >
                          🌿
                        </span>
                        {item.catnip}
                      </div>
                    )}
                    {isTerritory && item?.level != null && (
                      <div
                        className={`${styles.cardStat} ${styles.cardStatCatnip}`}
                        aria-label={`Level ${item.level}`}
                      >
                        <span
                          aria-hidden="true"
                          className={styles.cardStatIcon}
                        >
                          🌿
                        </span>
                        {item.level}
                      </div>
                    )}

                    {item?.defense != null && (
                      <div
                        className={`${styles.cardStat} ${styles.cardStatDefense} ${isCoreCard && item.type ? styles[`statColor${item.type}`] : ""}`}
                        aria-label={`Defense ${item.defense}`}
                      >
                        <span
                          aria-hidden="true"
                          className={styles.cardStatIcon}
                        >
                          🛡️
                        </span>
                        {item.defense}
                      </div>
                    )}

                    {item?.attack != null && (
                      <div
                        className={`${styles.cardStat} ${styles.cardStatAttack} ${isCoreCard && item.type ? styles[`statColor${item.type}`] : ""}`}
                        aria-label={`Attack ${item.attack}`}
                      >
                        <span
                          aria-hidden="true"
                          className={styles.cardStatIcon}
                        >
                          💥
                        </span>
                        {item.attack}
                      </div>
                    )}

                    {item?.lives != null && (
                      <div
                        className={`${styles.cardStat} ${styles.cardStatLives} ${isCoreCard && item.type ? styles[`statColor${item.type}`] : ""}`}
                        aria-label={`Lives ${item.lives}`}
                      >
                        <span
                          aria-hidden="true"
                          className={styles.cardStatIcon}
                        >
                          🐱
                        </span>
                        {item.lives}
                      </div>
                    )}

                    <Image
                      priority
                      src={item.imageURL}
                      fill
                      sizes="(max-width: 832px) 100vw, 21.6rem"
                      alt=""
                      className={styles.cardImage}
                    />
                  </div>

                  {item?.mechanics != null && (
                    <p className={styles.cardMechanics}>
                      <strong>{item.mechanics}</strong>
                    </p>
                  )}

                  <p className={styles.cardLore}>{item.lore}</p>
                </div>
              </Link>
            </article>
          );
        })}
      </section>
    </>
  );
}
