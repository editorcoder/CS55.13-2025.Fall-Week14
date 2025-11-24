/*
editorcoder
SRJC CS55.13 Fall 2025
Week 14: Assignment 14: Final Headless CMS-Powered App 
Footer.jsx
2025-11-22
*/

// Footer

// Footer component
export default function Footer() {
  // Get current year using Date object
  const currentYear = new Date().getFullYear();
  
  return (
    <footer>
      <p>Copyright © {currentYear} Reginald Rodriguez</p>
    </footer>
  );
}

