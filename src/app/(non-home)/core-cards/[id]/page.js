/*
editorcoder
SRJC CS55.13 Fall 2025
Week 14: Assignment 14: Final Headless CMS-Powered App 
page.js
2025-11-24
*/

//dynamic core card page

// Import Next.js image component
import Image from "next/image";
// Import Suspense for client components using useSearchParams
import { Suspense } from "react";
// Import data handling functions
import { getAllCoreCardIds, getCoreCardData } from "@/lib/wordpress/core-cards";
// Import BackToHomeLink and ExtendedLore components
import BackToHomeLink from "@/components/BackToHomeLink";
import ExtendedLore from "@/components/ExtendedLore";
// Import custom CSS module for card styles
import styles from "@/components/Card.module.css";

// Dynamic metadata
export async function generateMetadata({ params }) {
  // Await params and extract the card ID
  const { id } = await params;
  // Fetch card data for metadata generation
  const coreCardData = await getCoreCardData(id);
  // Return metadata object with title and description
  return {
    // Set page title to card title
    title: coreCardData.title,
    // Generate SEO description for the card page
    description: `Learn about the ${coreCardData.title} core card in the Cat Trading Card Game`,
  };
}

// Generate static params
export async function generateStaticParams() {
  // Fetch all card IDs for static generation
  const paths = await getAllCoreCardIds();
  // Map paths to params format required by Next.js
  return paths.map((path) => ({
    // Extract card ID from path params
    id: path.params.id,
  }));
}

// Core Cards component
export default async function CoreCards({ params }) {
  // Await params before accessing properties
  // Extract card ID from route parameters
  const { id } = await params;

  // Fetch core card data from WordPress using the core card ID
  const coreCardData = await getCoreCardData(id);

  return (
    <>
      <section className={styles.cardPage}>
        <article
          id="card-page-card"
          className={`${styles.cardPageCard} ${styles.cardBorderCore} ${styles[`cardColor${coreCardData.type}`]}`}
        >
          <div className={styles.cardBody}>
            <div
              className={styles.cardCost}
              aria-label={`Catnip ${coreCardData.cost}`}
            >
              {coreCardData.cost}
            </div>
            <h3 className={styles.cardTitle}>{coreCardData.title}</h3>
            <h4 className={styles.cardType}>
              {coreCardData.type}
              {coreCardData?.subtype != null && (
                <span
                  aria-hidden="true"
                  aria-label={`Catnip ${coreCardData.subtype}`}
                >
                  {" "}
                  ({coreCardData.subtype})
                </span>
              )}
            </h4>
            <div className={styles.cardImageContainer}>
              {coreCardData?.catnip != null && (
                <div
                  className={`${styles.cardStat} ${styles.cardStatCatnip} ${styles[`statColor${coreCardData.type}`]}`}
                  aria-label={`Catnip ${coreCardData.catnip}`}
                >
                  <span aria-hidden="true" className={styles.cardStatIcon}>
                    🌿
                  </span>
                  {coreCardData.catnip}
                </div>
              )}

              {coreCardData?.defense != null && (
                <div
                  className={`${styles.cardStat} ${styles.cardStatDefense} ${styles[`statColor${coreCardData.type}`]}`}
                  aria-label={`Defense ${coreCardData.defense}`}
                >
                  <span aria-hidden="true" className={styles.cardStatIcon}>
                    🛡️
                  </span>
                  {coreCardData.defense}
                </div>
              )}

              {coreCardData?.attack != null && (
                <div
                  className={`${styles.cardStat} ${styles.cardStatAttack} ${styles[`statColor${coreCardData.type}`]}`}
                  aria-label={`Attack ${coreCardData.defense}`}
                >
                  <span aria-hidden="true" className={styles.cardStatIcon}>
                    💥
                  </span>
                  {coreCardData.attack}
                </div>
              )}

              {coreCardData?.lives != null && (
                <div
                  className={`${styles.cardStat} ${styles.cardStatLives} ${styles[`statColor${coreCardData.type}`]}`}
                  aria-label={`Lives ${coreCardData.lives}`}
                >
                  <span aria-hidden="true" className={styles.cardStatIcon}>
                    🐱
                  </span>
                  {coreCardData.lives}
                </div>
              )}

              <Image
                priority
                src={coreCardData.imageURL}
                fill
                sizes="(max-width: 832px) 100vw, 21.6rem"
                alt=""
                className={styles.cardImage}
              />
            </div>

            {coreCardData?.mechanics != null && (
              <p className={styles.cardMechanics}>
                <strong>{coreCardData.mechanics}</strong>
              </p>
            )}

            <p className={styles.cardLore}>{coreCardData.lore}</p>
          </div>
        </article>

        <article className={styles.cardPageDetails}>
          <div className={styles.cardDetailsHeader}>
            <h3>Card Details:</h3>
            <a href="#card-page-card" className={styles.showCardLink}>
              show card
            </a>
          </div>
          <p>
            Title:{" "}
            <span className={styles.detailsTitle}>{coreCardData.title}</span>
          </p>
          <p>Content Type: Core Card</p>
          <p>Type: {coreCardData.type}</p>
          {coreCardData?.subtype != null && (
            <p>Subtype: {coreCardData.subtype}</p>
          )}

          <h4>Stats</h4>

          <div>
            {coreCardData?.cost != null && <p>Cost: {coreCardData.cost}</p>}

            {coreCardData?.catnip != null && (
              <p>
                <span aria-hidden="true" className={styles.cardStatIcon}>
                  🌿
                </span>
                Catnip: {coreCardData.catnip}
              </p>
            )}

            {coreCardData?.defense != null && (
              <p>
                <span aria-hidden="true" className={styles.cardStatIcon}>
                  🛡️
                </span>
                Defense: {coreCardData.defense}
              </p>
            )}

            {coreCardData?.attack != null && (
              <p>
                <span aria-hidden="true" className={styles.cardStatIcon}>
                  💥
                </span>
                Attack: {coreCardData.attack}
              </p>
            )}

            {coreCardData?.lives != null && (
              <p>
                <span aria-hidden="true" className={styles.cardStatIcon}>
                  🐱
                </span>
                Lives: {coreCardData.lives}
              </p>
            )}
          </div>

          {coreCardData?.mechanics != null && (
            <div>
              <h4>Mechanics</h4>
              <p>{coreCardData.mechanics}</p>
            </div>
          )}

          {/* ExtendedLore component with Gemini functionality */}
          <ExtendedLore
            lore={coreCardData.lore}
            cardId={id}
            mechanics={coreCardData.mechanics}
            title={coreCardData.title}
          />

          <div>
            <h4>Credits</h4>
            <p className={styles.cardPhotoCredit}>
              <a href={coreCardData.photoSourceURL} target="_blank">
                Photo
              </a>{" "}
              by{" "}
              <a href={coreCardData.photoArtistURL} target="_blank">
                {coreCardData.photoArtist}
              </a>
            </p>
          </div>

      
        </article>
      </section>

      <div className={styles.backToHome}>
        <Suspense fallback={<p>Loading...</p>}>
          <BackToHomeLink />
        </Suspense>
      </div>
    </>
  );
}
