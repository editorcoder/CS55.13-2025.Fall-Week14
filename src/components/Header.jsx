/*
editorcoder
SRJC CS55.13 Fall 2025
Week 14: Assignment 14: Final Headless CMS-Powered App 
Header.jsx
2025-11-22
*/

// Header

// Import Next.js Link component
import Link from 'next/link';
// Import Header CSS styles
import styles from "./Header.module.css";

// Header component
export default function Header() {

  return (
    <header>
      <Link href="/" className={styles.logo}>
      <span aria-hidden="true" className={styles.logoIcon}>🐈</span>
        <h1>The Cat TCG Gallery</h1>
      </Link>
    </header>
  );
}
