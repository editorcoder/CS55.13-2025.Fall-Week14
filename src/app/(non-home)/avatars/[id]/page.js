/*
editorcoder
SRJC CS55.13 Fall 2025
Week 14: Assignment 14: Final Headless CMS-Powered App 
page.js
2025-11-24
*/

//dynamic avatar page

// Import Next.js image component
import Image from "next/image";
// Import Suspense for client components using useSearchParams
import { Suspense } from "react";
// Import data handling functions
import {
  getAllAvatarIds,
  getAvatarData,
} from "@/lib/wordpress/avatars";
// Import BackToHomeLink and ExtendedLore components
import BackToHomeLink from "@/components/BackToHomeLink";
import ExtendedLore from "@/components/ExtendedLore";
// Import custom CSS module for card styles
import styles from "@/components/Card.module.css";

// Dynamic metadata
export async function generateMetadata({ params }) {
  // Await params and extract the avatar ID
  const { id } = await params;
  // Fetch avatar data for metadata generation
  const avatarData = await getAvatarData(id);
  // Return metadata object with title and description
  return {
    // Set page title to avatar title
    title: avatarData.title,
    // Generate SEO description for the avatar page
    description: `Learn about the ${avatarData.title} avatar card in the Cat Trading Card Game`,
  };
}

// Generate static params
export async function generateStaticParams() {
  // Fetch all avatar IDs for static generation
  const paths = await getAllAvatarIds();
  // Map paths to params format required by Next.js
  return paths.map((path) => ({
    // Extract avatar ID from path params
    id: path.params.id,
  }));
}

// Avatars component
export default async function Avatars({ params }) {

  // Await params before accessing properties
  // Extract avatar ID from route parameters
  const { id } = await params;

  // Fetch avatar data from WordPress using the avatar ID
  const avatarData = await getAvatarData(id);

  return (
    <>
      <section className={styles.cardPage}>
        <article id="card-page-card" className={`${styles.cardPageCard} ${styles.cardBorderAvatar} ${styles.cardColorAvatar}`}>
          <div className={styles.cardBody}>
            {avatarData?.archetype != null && (
              <div
                className={styles.cardArchetype}
                aria-label={`Archetype ${avatarData.archetype}`}
              >
                {avatarData.archetype === "Indoor" && "🏠"}
                {avatarData.archetype === "Outdoor" && "🏞️"}
                {avatarData.archetype === "In-or-Out" && "🏘️"}
              </div>
            )}
            <h3 className={styles.cardTitle}>{avatarData.title}</h3>
            <h4 className={styles.cardType}>
              Avatar
              {avatarData?.archetype != null && (
                <span
                  aria-hidden="true"
                  aria-label={`Archetype ${avatarData.archetype}`}
                >
                  {" "}
                  ({avatarData.archetype})
                </span>
              )}
            </h4>
            <div className={styles.cardImageContainer}>


              {avatarData?.defense != null && (
                <div
                  className={`${styles.cardStat} ${styles.cardStatDefense}`}
                  aria-label={`Defense ${avatarData.defense}`}
                >
                  <span aria-hidden="true" className={styles.cardStatIcon}>
                    🛡️
                  </span>
                  {avatarData.defense}
                </div>
              )}

              {avatarData?.attack != null && (
                <div
                  className={`${styles.cardStat} ${styles.cardStatAttack}`}
                  aria-label={`Attack ${avatarData.attack}`}
                >
                  <span aria-hidden="true" className={styles.cardStatIcon}>
                    💥
                  </span>
                  {avatarData.attack}
                </div>
              )}

              {avatarData?.lives != null && (
                <div
                  className={`${styles.cardStat} ${styles.cardStatLives}`}
                  aria-label={`Lives ${avatarData.lives}`}
                >
                  <span aria-hidden="true" className={styles.cardStatIcon}>
                    🐱
                  </span>
                  {avatarData.lives}
                </div>
              )}

              <Image
                priority
                src={avatarData.imageURL}
                fill
                sizes="(max-width: 832px) 100vw, 21.6rem"
                alt=""
                className={styles.cardImage}
              />
            </div>

            <p className={styles.cardMechanics}>
              <strong>{avatarData.mechanics}</strong>
            </p>

            <p className={styles.cardLore}>{avatarData.lore}</p>
          </div>
        </article>

        <article className={styles.cardPageDetails}>
          <div className={styles.cardDetailsHeader}>
            <h3>Card Details:</h3>
            <a href="#card-page-card" className={styles.showCardLink}>show card</a>
          </div>
          <p>Title: <span className={styles.detailsTitle}>{avatarData.title}</span></p>
          <p>Content Type: Avatar</p>
          <p>Archetype: {avatarData.archetype === "Indoor" && "🏠"} {avatarData.archetype === "Outdoor" && "🏞️"} {avatarData.archetype === "In-or-Out" && "🏘️"}{avatarData.archetype}</p>

          <h4>Stats</h4>

          <div>

            {avatarData?.defense != null && (
              <p>
                <span aria-hidden="true" className={styles.cardStatIcon}>
                  🛡️
                </span>
                Defense: {avatarData.defense}
              </p>
            )}

            {avatarData?.attack != null && (
              <p>
                <span aria-hidden="true" className={styles.cardStatIcon}>
                  💥
                </span>
                Attack: {avatarData.attack}
              </p>
            )}

            {avatarData?.lives != null && (
              <p>
                <span aria-hidden="true" className={styles.cardStatIcon}>
                  🐱
                </span>
                Lives: {avatarData.lives}
              </p>
            )}
          </div>

          {avatarData?.mechanics != null && (
            <div>
              <h4>Mechanics</h4>
              <p>{avatarData.mechanics}</p>
            </div>
          )}

          {/* ExtendedLore component with Gemini functionality */}
          <ExtendedLore
            lore={avatarData.lore}
            cardId={id}
            mechanics={avatarData.mechanics}
            title={avatarData.title}
          />

          <div>
            <h4>Credits</h4>
            <p className={styles.cardPhotoCredit}>
              <a href={avatarData.photoSourceURL} target="_blank">
                Photo
              </a>{" "}
              by{" "}
              <a href={avatarData.photoArtistURL} target="_blank">
                {avatarData.photoArtist}
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
