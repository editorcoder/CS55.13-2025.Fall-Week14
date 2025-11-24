/*
editorcoder
SRJC CS55.13 Fall 2025
Custom Next.js App
layout.js
2025-11-04
*/

// Import global CSS styles
import './globals.css';
// Import Header component
import Header from '../components/Header';
// Import Footer component
import Footer from '../components/Footer';
// Import server-side authentication function
import { getAuthenticatedAppForUser } from "../lib/firebase/serverApp";
// Force next.js to treat this route as server-side rendered
// Without this line, during the build process, next.js will treat this route as static and build a static HTML file for it
export const dynamic = "force-dynamic";

// Export metadata object for SEO and page information
export const metadata = {
  // Page title configuration
  title: {
    // Default page title
    default: 'The Cat Trading Card Game: Card Gallery',
    // Template for dynamic titles
    template: '%s | The Cat TCG Gallery'
  },
  // Page description for SEO
  description: 'Gallery of cards from The Cat Trading Card Game, a trading card game powered by cats',
  // Keywords for SEO
  keywords: ['cats', 'trading card game', 'cat game', 'tcg', 'cat', 'cat trading card game', 'cat tcg', 'trading cards'],
  // Author information
  authors: [{ name: 'editorcoder' }]
};

// Default export: Root layout component for the application
export default async function RootLayout({ children }) {
  // Get authenticated user from server-side Firebase app
  const { currentUser } = await getAuthenticatedAppForUser();
  return (
    <html lang="en">
      <body>
        <Header initialUser={currentUser?.toJSON()} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
