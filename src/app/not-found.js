/*
editorcoder
SRJC CS55.13 Fall 2025
Custom Next.js App
not-found.js
2025-11-04
*/

// Import Link component from Next.js for client-side navigation
import Link from 'next/link';

// Export metadata object for the 404 page
export const metadata = {
  // Page title for the 404 page
  title: 'Page Not Found',
  // Description for SEO
  description: 'The page you are looking for could not be found',
};

// Default export: NotFound component for 404 pages
export default function NotFound() {
  return (
    <div className="container text-center mt-5">
      <h1 className="display-1">404</h1>
      <h2 className="display-4">Page Not Found</h2>
      <p className="lead">The page you are looking for could not be found.</p>
      <Link href="/" className="btn btn-primary btn-lg">
        Return Home
      </Link>
    </div>
  );
}
