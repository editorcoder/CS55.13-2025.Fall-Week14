/*
editorcoder
SRJC CS55.13 Fall 2025
Week 14: Assignment 14: Final Headless CMS-Powered App 
not-found.js
2025-11-22
*/

// 404 page

// Import Next.js components
import Link from 'next/link';

// Metadata for the 404 page
export const metadata = {
  // Page title for the 404 page
  title: 'Page Not Found',
  // Description for SEO
  description: 'The page you are looking for could not be found',
};

// Component for 404 page
export default function NotFound() {
  return (
    <div className="page-not-found">
      <h2>404</h2>
      <h3>Page Not Found</h3>
      <p>The page you are looking for could not be found.</p>
      <button><Link href="/">Return Home</Link></button>
    </div>
  );
}
