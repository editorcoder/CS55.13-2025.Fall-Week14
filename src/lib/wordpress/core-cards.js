/*
editorcoder
SRJC CS55.13 Fall 2025
Week 14: Assignment 14: Final Headless CMS-Powered App 
core-cards.js
2025-11-22
*/

// Import got module
import { got } from "got"; 

// define REST endpoint URLs
const coreCardDataURL =  // custom endpoint via ACF 
  "https://dev-basic-headless-cms-app.pantheonsite.io/wp-json/wp/v2/core-card?per_page=100";
const mediaURL = //  out-of-the-box media endpoint
  "https://dev-basic-headless-cms-app.pantheonsite.io/wp-json/wp/v2/media/";

// Helper function to fetch and parse JSON data from WordPress API
async function fetchCoreCardsData() {

  let jsonObj; // Declare variable to store parsed JSON data

  try { // Begin error handling block
    // get JSON data from REST endpoint (got v14 automatically parses JSON)
    jsonObj = await got(coreCardDataURL).json();
  } catch (error) { // Handle request errors
    jsonObj = []; // Set empty array as fallback
    console.log(error); // Log error for debugging
  } // End error handling block

  return jsonObj; // Return parsed JSON data

}

// Helper function to fetch WordPress media data by media ID
async function fetchMediaData(mediaId) {

  let mediaObj; // Declare variable to store parsed media data

  try { // Begin error handling block
    // Construct WordPress media API endpoint URL for specific media ID
    const mediaIdURL = `${mediaURL}${mediaId}`;
    // get JSON data from REST endpoint (got v14 automatically parses JSON)
    mediaObj = await got(mediaIdURL).json();
  } catch (error) { // Handle request errors
    mediaObj = null; // Set null as fallback
    console.log(`Error fetching media ${mediaId}:`, error); // Log error for debugging
  } // End error handling block

  return mediaObj; // Return parsed media data or null
}

// Return all core card IDs for static generation (server-side)
export async function getAllCoreCardIds() { // Build Next.js dynamic route params for core cards

  const jsonObj = await fetchCoreCardsData(); // Fetch core cards data from API

  const paths = jsonObj.map(item => { // Map each core card to a params object
    return { // Return object in the shape Next.js expects
      params: { // Route parameters container
        id: item.id.toString() // Convert id to string as required by Next.js
      } // End params object
    } // End return object
  }); // End map function
  return paths; // Return array of path objects

}

// Return all core card info, sorted by title alphabetically (server-side)
export async function getSortedCoreCardsData() { // Read core cards and return metadata sorted by title

  const jsonObj = await fetchCoreCardsData(); // Fetch core cards data from API

  // Sort array by title alphabetically
  jsonObj.sort(function (a, b) { // Sort array by title in alphabetical order
    const titleA = a.acf?.title || '';
    const titleB = b.acf?.title || '';
    return titleA.localeCompare(titleB); // Compare titles using locale-aware string comparison
  }); // End sort function

  // Process all core cards and get their image URLs
  const coreCardData = await Promise.all(
    jsonObj.map(async (item) => {
      // Fetch media URL if photo ID exists
      let imageURL = ''; // Initialize image URL variable
      const photoId = item.acf?.photo; // Get photo media ID from ACF
      if (photoId && typeof photoId === 'number') { // Check if photo ID exists and is a number
        const mediaData = await fetchMediaData(photoId); // Fetch media data from WordPress API
        if (mediaData && mediaData.source_url) { // Check if media data was fetched successfully
          imageURL = mediaData.source_url; // Extract source URL from media response
        } // End if block
      } // End if block

      return { // Return simplified core card object
        id: item.id ? item.id.toString() : null, // Convert id to string
        title: item.acf?.title || '', // Core care title
        type: item.acf?.type || '', // Core Card type
        subtype: item.acf?.subtype || null, // Core card subtype
        cost: item.acf?.cost || null, // Card cost
        catnip: item.acf?.catnip || null, // Catnip value
        defense: item.acf?.defense || null, // Defense value
        attack: item.acf?.attack || null, // Attack value
        lives: item.acf?.lives || null, // Lives value
        mechanics: item.acf?.mechanics || null, // Mechanics description
        lore: item.acf?.lore || '', // Lore description
        imageURL: imageURL, // WordPress media image URL (fetched from media API)
        photoArtist: item.acf?.photo_artist_name || '', // Photo artist name
        photoArtistURL: item.acf?.photo_artist_url || '', // Photo artist URL
        photoSourceURL: item.acf?.photo_source_url || '', // Photo source URL
      } // End return object
    }) // End map function
  ); // End Promise.all

  return coreCardData; // Return array of core card objects

}

// Return specific core card data (server-side)
export async function getCoreCardData(id) { // Read one core card and return data plus metadata

  const jsonObj = await fetchCoreCardsData(); // Fetch core cards data from API

  // find object value in array that has matching id
  const objMatch = jsonObj.filter(obj => { // Filter array to find core card with matching ID
    return obj.id === parseInt(id) || obj.id.toString() === id.toString(); // Compare core card id with requested id (handle both string and number)
  }); // End filter function

  // extract object value in filtered array if any
  let objReturned; // Declare variable to store matched core card object
  if (objMatch.length > 0) { // Check if matching core card was found
    objReturned = objMatch[0]; // Use first matching core card
  } else { // Handle case when no core card matches
    objReturned = {}; // Set empty object as fallback
  } // End if-else block

  // Fetch media URL if photo ID exists
  let imageURL = ''; // Initialize image URL variable
  const photoId = objReturned.acf?.photo; // Get photo media ID from ACF
  if (photoId && typeof photoId === 'number') { // Check if photo ID exists and is a number
    const mediaData = await fetchMediaData(photoId); // Fetch media data from WordPress API
    if (mediaData && mediaData.source_url) { // Check if media data was fetched successfully
      imageURL = mediaData.source_url; // Extract source URL from media response
    } // End if block
  } // End if block

  return { // Return core card data object
    id: objReturned.id ? objReturned.id.toString() : '', // Convert id to string or use empty string
    title: objReturned.acf?.title || '', // Core card title
    type: objReturned.acf?.type || '', // Core card type
    subtype: objReturned.acf?.subtype || null, // Core card subtype
    cost: objReturned.acf?.cost || null, // Core card cost
    catnip: objReturned.acf?.catnip || null, // Catnip value
    defense: objReturned.acf?.defense || null, // Defense value
    attack: objReturned.acf?.attack || null, // Attack value
    lives: objReturned.acf?.lives || null, // Lives value
    mechanics: objReturned.acf?.mechanics || null, // Mechanics description
    lore: objReturned.acf?.lore || '', // Lore description
    imageURL: imageURL, // WordPress media image URL (fetched from media API)
    photoArtist: objReturned.acf?.photo_artist_name || '', // Photo artist name
    photoArtistURL: objReturned.acf?.photo_artist_url || '', // Photo artist URL
    photoSourceURL: objReturned.acf?.photo_source_url || '', // Photo source URL
  }; // End return object

}

