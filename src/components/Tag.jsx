/*
editorcoder
SRJC CS55.13 Fall 2025
Custom Next.js App
Tag.jsx
2025-11-04
*/

// A tag is shown under the filter bar when a filter is selected.
// Tags show what filters have been selected
// On click, the tag is removed and the filter is reset

// Default export: Tag component for displaying active filters
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

