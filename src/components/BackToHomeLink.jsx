/*
editorcoder
SRJC CS55.13 Fall 2025
Week 14: Assignment 14: Final Headless CMS-Powered App 
BackToHomeLink.jsx
2025-11-24
*/

// Back to home page link component that preserves filter query parameters

// Mark this file as a client component
"use client";

// Import Next.js components
import Link from "next/link";
// Import Next.js hooks
import { useSearchParams } from "next/navigation";

// Back to home page link component
export default function BackToHomeLink() {
  // Get current search params from URL
  const searchParams = useSearchParams();
  // Build query string from current search params
  const queryString = searchParams.toString();
  // Build href with query params if they exist, otherwise just home page
  const homeHref = queryString ? `/?${queryString}` : "/";

  return (
      <Link href={homeHref}><button>← Back to home</button></Link>
  );
}
