/*
editorcoder
SRJC CS55.13 Fall 2025
Custom Next.js App
page.js
2025-11-04
*/

//dynamic card page

// load Next.js image component
import Image from 'next/image';

// Layout is now handled by App Router's nested layout system
// load data handling functions
import { getCardIds, getCardSpecified } from '../../../../lib/firebase/serverFirestoreData';

// Import FavoriteButton component
import FavoriteButton from '../../../../components/FavoriteButton';
// Import CardLikesCounter component for real-time updates
import CardLikesCounter from '../../../../components/CardLikesCounter';
// Import ExtendedLore component for interactive lore feature
import ExtendedLore from '../../../../components/ExtendedLore';

// Import custom CSS module for card styles
import styles from '../../../../components/Card.module.css';

// App Router: Add metadata export (dynamic)
export async function generateMetadata({ params }) {
  // Await params and extract the card ID
  const { id } = await params;
  // Fetch card data for metadata generation
  const cardData = await getCardSpecified(id);
  // Return metadata object with title and description
  return {
    // Set page title to card title
    title: cardData.title,
    // Generate SEO description for the card page
    description: `Learn about the ${cardData.title} card in the Cat Trading Card Game`,
  };
}

// App Router: Generate static params instead of getStaticPaths
// This pre-generates pages for existing cards at build time for better performance
export async function generateStaticParams() {
  // Fetch all card IDs for static generation
  const paths = await getCardIds();
  // Map paths to params format required by Next.js
  return paths.map((path) => ({
    // Extract card ID from path params
    id: path.params.id,
  }));
}

// App Router: Convert to async server component with direct data fetching
export default async function Cards({ params }) { // card component
  // App Router: Await params before accessing properties
  // Extract card ID from route parameters
  const { id } = await params;
  // App Router: Direct data fetching instead of getStaticProps
  // Fetch card data from Firestore using the card ID
  const cardData = await getCardSpecified(id);

  return (
    <>

      <section className={styles.cardPage}>

        <article className={`${styles.cardPageCard} ${styles[`cardColor${cardData.type}`]}`}>
          <div className={styles.cardBody}>
            <div className={styles.cardCost} aria-label={`Catnip ${cardData.cost}`}>{cardData.cost}</div>
            <h3 className={styles.cardTitle}>{cardData.title}</h3>
            <h4 className={styles.cardType}>{cardData.type}
              {cardData?.subtype != null && (
                <span aria-hidden="true" aria-label={`Catnip ${cardData.subtype}`}>, {cardData.subtype}</span>
              )}
            </h4>
            <div className={styles.cardImageContainer}>

              {cardData?.catnip != null && (
                <div className={`${styles.cardStat} ${styles.cardStatCatnip} ${styles[`statColor${cardData.type}`]}`} aria-label={`Catnip ${cardData.catnip}`}>
                  <span aria-hidden="true" className={styles.cardStatIcon}>🌿</span>{cardData.catnip}
                </div>
              )}

              {cardData?.defense != null && (
                <div className={`${styles.cardStat} ${styles.cardStatDefense} ${styles[`statColor${cardData.type}`]}`} aria-label={`Defense ${cardData.defense}`}>
                  <span aria-hidden="true" className={styles.cardStatIcon}>🛡️</span>{cardData.defense}
                </div>
              )}

              {cardData?.attack != null && (
                <div className={`${styles.cardStat} ${styles.cardStatAttack} ${styles[`statColor${cardData.type}`]}`} aria-label={`Attack ${cardData.defense}`}>
                  <span aria-hidden="true" className={styles.cardStatIcon}>💥</span>{cardData.attack}
                </div>
              )}

              {cardData?.lives != null && (
                <div className={`${styles.cardStat} ${styles.cardStatLives} ${styles[`statColor${cardData.type}`]}`} aria-label={`Lives ${cardData.lives}`}>
                  <span aria-hidden="true" className={styles.cardStatIcon}>🐱</span>{cardData.lives}
                </div>
              )}

              <Image
                priority
                src={cardData.imageURL}
                fill
                alt={`${cardData.title}`}
                className={styles.cardImage}
              />
            </div>

            {cardData?.mechanics != null && (
              <p className={styles.cardMechanics}><strong>{cardData.mechanics}</strong></p>
            )}


            <p className={styles.cardLore}>{cardData.lore}</p>


          </div>
        </article>

        <article className={styles.cardPageDetails}>
          <FavoriteButton
            cardId={id}
            initialFavoritedBy={cardData.favoritedBy || []}
          />

          <h3>Card Details</h3>

          <h4>Stats</h4>

          <div className="cardDetailsStats">

            {cardData?.cost != null && (
              <p>Cost: {cardData.cost}</p>
            )}

            {cardData?.catnip != null && (
              <p><span aria-hidden="true" className={styles.cardStatIcon}>🌿</span>Catnip: {cardData.catnip}</p>
            )}

            {cardData?.defense != null && (
              <p><span aria-hidden="true" className={styles.cardStatIcon}>🛡️</span>Defense: {cardData.defense}</p>
            )}

            {cardData?.attack != null && (
              <p><span aria-hidden="true" className={styles.cardStatIcon}>💥</span>Attack: {cardData.attack}</p>
            )}

            {cardData?.lives != null && (
              <p><span aria-hidden="true" className={styles.cardStatIcon}>🐱</span>Lives: {cardData.lives}</p>
            )}

          </div>

          {cardData?.mechanics != null && (
            <div className="cardDetailsMechanics">
              <h4>Mechanics</h4>
              <p>{cardData.mechanics}</p>
            </div>
          )}

          <ExtendedLore lore={cardData.lore} cardId={id} mechanics={cardData.mechanics} title={cardData.title} />

          <div className="cardDetailsPhoto">
            <h4>Credits</h4>
            <p className={styles.cardPhotoCredit}><a href={cardData.photoSourceURL} target="_blank">Photo</a> by <a href={cardData.photoArtistURL} target="_blank">{cardData.photoArtist}</a></p>
          </div>

          <CardLikesCounter cardId={id} initialLikes={cardData.numberOfLikes || 0} />

        </article>



      </section>


    </>
  );
}
