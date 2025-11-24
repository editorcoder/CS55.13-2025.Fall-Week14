/*
editorcoder
SRJC CS55.13 Fall 2025
Week 14: Assignment 14: Final Headless CMS-Powered App 
Tag.jsx
2025-11-22
*/

// Card filter tag

// Tag component
export default function Tag({ type, value, updateField }) {
  return (
    <span className="">
      {value}
      <button
        type="button"
        aria-label="Remove"
        onClick={() => updateField(type, "")}
      >
        X
      </button>
    </span>
  );
}
