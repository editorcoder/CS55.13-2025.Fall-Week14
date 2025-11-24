/*
editorcoder
SRJC CS55.13 Fall 2025
Week 14: Assignment 14: Final Headless CMS-Powered App 
page.js
2025-11-22
*/

//dynamic territory page

// Import Next.js image component
import Image from "next/image";
// Import Suspense for client components using useSearchParams
import { Suspense } from "react";
// Import data handling functions
import {
  getAllTerritoryIds,
  getTerritoryData,
} from "@/lib/wordpress/territories";
// Import BackToHomeLink and ExtendedLore components
import BackToHomeLink from "@/components/BackToHomeLink";
import ExtendedLore from "@/components/ExtendedLore";
// Import custom CSS module for card styles
import styles from "@/components/Card.module.css";

// Dynamic metadata
export async function generateMetadata({ params }) {
  // Await params and extract the territory ID
  const { id } = await params;
  // Fetch territory data for metadata generation
  const territoryData = await getTerritoryData(id);
  // Return metadata object with title and description
  return {
    // Set page title to territory title
    title: territoryData.title,
    // Generate SEO description for the territory page
    description: `Learn about the ${territoryData.title} territory card in the Cat Trading Card Game`,
  };
}

// Generate static params
export async function generateStaticParams() {
  // Fetch all territory IDs for static generation
  const paths = await getAllTerritoryIds();
  // Map paths to params format required by Next.js
  return paths.map((path) => ({
    // Extract territory ID from path params
    id: path.params.id,
  }));
}

// Territories component
export default async function Territories({ params }) {

  // Await params before accessing properties
  // Extract territory ID from route parameters
  const { id } = await params;

  // Fetch territory data from WordPress using the territory ID
  const territoryData = await getTerritoryData(id);

  return (
    <>
      <section className={styles.cardPage}>
        <article className={`${styles.cardPageCard} ${styles.cardBorderTerritory} ${styles.cardColorTerritory}`}>
          <div className={styles.cardBody}>
            {territoryData?.environment != null && (
              <div
                className={styles.cardArchetype}
                aria-label={`Environment ${territoryData.environment}`}
              >
                {territoryData.environment === "Indoor" && "🏠"}
                {territoryData.environment === "Outdoor" && "🍂"}
              </div>
            )}
            <h3 className={styles.cardTitle}>{territoryData.title}</h3>
            <div className={styles.cardImageContainer}>
              {territoryData?.level != null && (
                <div
                  className={`${styles.cardStat} ${styles.cardStatCatnip}`}
                  aria-label={`Level ${territoryData.level}`}
                >
                  <span aria-hidden="true" className={styles.cardStatIcon}>
                    🌿
                  </span>
                  {territoryData.level}
                </div>
              )}

              <Image
                priority
                src={territoryData.imageURL}
                fill
                sizes="(max-width: 832px) 100vw, 21.6rem"
                alt=""
                className={styles.cardImage}
              />
            </div>

            {territoryData?.mechanics != null && (
              <p className={styles.cardMechanics}>
                <strong>{territoryData.mechanics}</strong>
              </p>
            )}

            <p className={styles.cardLore}>{territoryData.lore}</p>
          </div>
        </article>

        <article className={styles.cardPageDetails}>
          <h3>Territory Details</h3>

          <h4>Stats</h4>

          <div>
            {territoryData?.level != null && (
              <p>
                <span aria-hidden="true" className={styles.cardStatIcon}>
                  🌿
                </span>
                Level: {territoryData.level}
              </p>
            )}

            {territoryData?.environment != null && (
              <p>
                <span aria-hidden="true" className={styles.cardStatIcon}>
                  {territoryData.environment === "Indoor" && "🏠"}{" "}
                  {territoryData.environment === "Outdoor" && "🍂"}
                </span>
                Environment: {territoryData.environment}
              </p>
            )}
          </div>

          {territoryData?.mechanics != null && (
            <div>
              <h4>Mechanics</h4>
              <p>{territoryData.mechanics}</p>
            </div>
          )}

          {territoryData?.lore && (
            <div>
              <h4>Lore</h4>
              <p>{territoryData.lore}</p>
            </div>
          )}

          {/* ExtendedLore component with Gemini functionality */}
          <ExtendedLore
            lore={territoryData.lore}
            cardId={id}
            mechanics={territoryData.mechanics}
            title={territoryData.title}
          />

          <div>
            <h4>Credits</h4>
            <p className={styles.cardPhotoCredit}>
              <a href={territoryData.photoSourceURL} target="_blank">
                Photo
              </a>{" "}
              by{" "}
              <a href={territoryData.photoArtistURL} target="_blank">
                {territoryData.photoArtist}
              </a>
            </p>
          </div>

          <div className={styles.cardDetailsBackToHome}>
            <Suspense fallback={<p>Loading...</p>}>
              <BackToHomeLink />
            </Suspense>
          </div>
        </article>
      </section>
    </>
  );
}
