/*
editorcoder
SRJC CS55.13 Fall 2025
Week 14: Assignment 14: Final Headless CMS-Powered App 
page.js
2025-11-22
*/

// Home page

// Import data handling functions
import { getSortedCoreCardsData } from '@/lib/wordpress/core-cards'; 
import { getSortedAvatarsData } from '@/lib/wordpress/avatars'; 
import { getSortedTerritoriesData } from '@/lib/wordpress/territories'; 
// Import CardListings component
import CardListings from '@/components/CardListings'; 
// Import React components
import { Suspense } from 'react';

// Home component
export default async function Home({ searchParams }) {
  // Fetch all core-card, avatar, and territory data from WordPress
  const allCoreCardsData = await getSortedCoreCardsData();
  const allAvatarsData = await getSortedAvatarsData();
  const allTerritoriesData = await getSortedTerritoriesData();

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CardListings initialCards={allCoreCardsData} initialAvatars={allAvatarsData} initialTerritories={allTerritoriesData} searchParams={searchParams || {}} />
    </Suspense>
  );
}
