/*
editorcoder
SRJC CS55.13 Fall 2025
Week 14: Assignment 14: Final Headless CMS-Powered App 
avatars.js
2025-11-22
*/

// Import got module
import { got } from "got"; 

// define REST endpoint URLs
const avatarDataURL =  // custom endpoint via ACF 
  "https://dev-basic-headless-cms-app.pantheonsite.io/wp-json/wp/v2/avatar?per_page=100&acf_format=standard";

// Helper function to fetch and parse JSON data from WordPress API
async function fetchAvatarsData() {

  let jsonObj; // Declare variable to store parsed JSON data

  try { // Begin error handling block
    // get JSON data from REST endpoint (got v14 automatically parses JSON)
    jsonObj = await got(avatarDataURL).json();
  } catch (error) { // Handle request errors
    jsonObj = []; // Set empty array as fallback
    console.log(error); // Log error for debugging
  } // End error handling block

  return jsonObj; // Return parsed JSON data

}

// Return all avatar IDs for static generation (server-side)
export async function getAllAvatarIds() { // Build Next.js dynamic route params for avatars

  const jsonObj = await fetchAvatarsData(); // Fetch avatars data from API

  const paths = jsonObj.map(item => { // Map each avatar to a params object
    return { // Return object in the shape Next.js expects
      params: { // Route parameters container
        id: item.id.toString() // Convert id to string as required by Next.js
      } // End params object
    } // End return object
  }); // End map function
  return paths; // Return array of path objects

}

// Return all avatar info, sorted by title alphabetically (server-side)
export async function getSortedAvatarsData() { // Read avatars and return metadata sorted by title

  const jsonObj = await fetchAvatarsData(); // Fetch avatars data from API

  // Sort array by title alphabetically
  jsonObj.sort(function (a, b) { // Sort array by title in alphabetical order
    const titleA = a.acf?.title || '';
    const titleB = b.acf?.title || '';
    return titleA.localeCompare(titleB); // Compare titles using locale-aware string comparison
  }); // End sort function

  // Process all avatars and get their image URLs
  const avatarData = jsonObj.map((item) => {
      return { // Return simplified avatar object
        id: item.id ? item.id.toString() : null, // Convert id to string
        title: item.acf?.title || '', // Avatar title
        archetype: item.acf?.archetype || null, // Avatar archetype
        catnip: item.acf?.catnip || null, // Catnip value
        defense: item.acf?.defense || null, // Defense value
        attack: item.acf?.attack || null, // Attack value
        lives: item.acf?.lives || null, // Lives value
        mechanics: item.acf?.mechanics || null, // Mechanics description
        lore: item.acf?.lore || '', // Lore description
        imageURL: item.acf?.photo?.url || '', // WordPress media image URL (from ACF photo object)
        photoArtist: item.acf?.photo_artist_name || '', // Photo artist name
        photoArtistURL: item.acf?.photo_artist_url || '', // Photo artist URL
        photoSourceURL: item.acf?.photo_source_url || '', // Photo source URL
      }; // End return object
    }); // End map function

  return avatarData; // Return array of avatar objects

}

// Return specific avatar data (server-side)
export async function getAvatarData(id) { // Read one avatar and return data plus metadata

  const jsonObj = await fetchAvatarsData(); // Fetch avatars data from API

  // find object value in array that has matching id
  const objMatch = jsonObj.filter(obj => { // Filter array to find avatar with matching ID
    return obj.id === parseInt(id) || obj.id.toString() === id.toString(); // Compare avatar id with requested id (handle both string and number)
  }); // End filter function

  // extract object value in filtered array if any
  let objReturned; // Declare variable to store matched avatar object
  if (objMatch.length > 0) { // Check if matching avatar was found
    objReturned = objMatch[0]; // Use first matching avatar
  } else { // Handle case when no avatar matches
    objReturned = {}; // Set empty object as fallback
  } // End if-else block

  return { // Return avatar data object
    id: objReturned.id ? objReturned.id.toString() : '', // Convert id to string or use empty string
    title: objReturned.acf?.title || '', // Avatar title
    archetype: objReturned.acf?.archetype || null, // Avatar archetype
    catnip: objReturned.acf?.catnip || null, // Catnip value
    defense: objReturned.acf?.defense || null, // Defense value
    attack: objReturned.acf?.attack || null, // Attack value
    lives: objReturned.acf?.lives || null, // Lives value
    mechanics: objReturned.acf?.mechanics || null, // Mechanics description
    lore: objReturned.acf?.lore || '', // Lore description
    imageURL: objReturned.acf?.photo?.url || '', // WordPress media image URL (from ACF photo object)
    photoArtist: objReturned.acf?.photo_artist_name || '', // Photo artist name
    photoArtistURL: objReturned.acf?.photo_artist_url || '', // Photo artist URL
    photoSourceURL: objReturned.acf?.photo_source_url || '', // Photo source URL
  }; // End return object

}

