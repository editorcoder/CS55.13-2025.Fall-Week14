/*
editorcoder
SRJC CS55.13 Fall 2025
Week 14: Assignment 14: Final Headless CMS-Powered App 
layout.js
2025-11-22
*/

// Root layout

// Import global CSS styles
import './globals.css';
// Import Header and Footer components
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Force Next.js to treat this route as server-side rendered
export const dynamic = "force-dynamic";

// Default metadata
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
  authors: [{ name: 'editorcoder' }],
  icons: {
    icon: 'https://dev-basic-headless-cms-app.pantheonsite.io/wp-content/uploads/2025/11/favicon-32x32-1.png',
  }
};

// Root layout component
export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
