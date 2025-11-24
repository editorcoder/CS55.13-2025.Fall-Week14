/*
editorcoder
SRJC CS55.13 Fall 2025
Custom Next.js App
Footer.jsx
2025-11-04
*/

// Default export: Footer component
export default function Footer() {
  // Get current year using Date object
  const currentYear = new Date().getFullYear();
  
  return (
    <footer>
      <p>Copyright © {currentYear} Reginald Rodriguez</p>
    </footer>
  );
}

