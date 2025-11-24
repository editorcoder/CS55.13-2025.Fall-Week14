/*
editorcoder
SRJC CS55.13 Fall 2025
Custom Next.js App
page.js
2025-11-04
*/

//home page

// load data handling functions
import { getCardInfo } from '../lib/firebase/serverFirestoreData'; // server-side version
// Import client component for filtering and displaying cards
import CardListings from '../components/CardListings'; // client component for filtering

// App Router: Convert to async server component with direct data fetching
export default async function Home({ searchParams }) {
  // App Router: Direct data fetching from Firestore instead of getStaticProps
  // Fetch all card data from Firestore
  const allData = await getCardInfo();

  return (
    <CardListings initialCards={allData} searchParams={searchParams || {}} />
  );
}
