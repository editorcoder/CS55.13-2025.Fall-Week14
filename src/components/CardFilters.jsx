/*
editorcoder
SRJC CS55.13 Fall 2025
Custom Next.js App
CardFilters.jsx
2025-11-04
*/

// Mark this file as a client component
"use client";

// The filters shown on the card listings page

// Import Tag component for displaying filter tags
import Tag from "./Tag.jsx";
// Import custom hook to get current user
import { useUser } from "../lib/getUser";
// Import CSS module styles
import styles from "./CardFilters.module.css";

// Component for select dropdown filter
function FilterSelect({ label, options, value, onChange, name }) {
  return (
    <div>
      <label>
        {label}
        <select value={value} onChange={onChange} name={name}>
          {options.map((option, index) => (
            <option value={option} key={index}>
              {option === "" ? "All" : option}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

// Component for checkbox filter
function FilterCheckbox({ label, checked, onChange, name }) {
  return (
    <div>
      <label className={styles.checkboxLabel}>
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          name={name}
        />
        <span>{label}</span>
      </label>
    </div>
  );
}

// Component for cost range filter with sliders
function CostFilter({ costMin, costMax, onChange }) {
  return (
    <div>
      <label>
        Cost:
        <div className={styles.costFilterContainer}>
          <span>Min: {costMin}</span>
          <input
            type="range"
            min="0"
            max="6"
            value={costMin}
            onChange={(e) => {
              // Parse new minimum value from input
              const newMin = parseInt(e.target.value);
              // If new min exceeds max, adjust max to match new min
              if (newMin > costMax) {
                // Update both min and max to new min value
                onChange({ costMin: newMin, costMax: newMin });
              } else {
                // Update only min value
                onChange({ costMin: newMin, costMax });
              }
            }}
          />
        </div>
        <div className={styles.costFilterContainer}>
          <span>Max: {costMax}</span>
          <input
            type="range"
            min="0"
            max="6"
            value={costMax}
            onChange={(e) => {
              // Parse new maximum value from input
              const newMax = parseInt(e.target.value);
              // If new max is below min, adjust min to match new max
              if (newMax < costMin) {
                // Update both min and max to new max value
                onChange({ costMin: newMax, costMax: newMax });
              } else {
                // Update only max value
                onChange({ costMin, costMax: newMax });
              }
            }}
          />
        </div>
      </label>
    </div>
  );
}

// Default export: Main card filters component
export default function CardFilters({ filters, setFilters, uniqueTypes }) {
  // Get current user from custom hook
  const user = useUser();

  // Handler for select dropdown changes
  const handleSelectionChange = (event, name) => {
    // Update filters state with new value for specified field
    setFilters((prevFilters) => ({
      // Spread previous filters to preserve other values
      ...prevFilters,
      // Update the specified filter field with new value
      [name]: event.target.value,
    }));
  };

  // Handler for checkbox filter changes
  const handleCheckboxChange = (name) => {
    // Update filters state, toggling between "Yes" and empty string
    setFilters((prevFilters) => ({
      // Spread previous filters to preserve other values
      ...prevFilters,
      // Toggle checkbox value: if "Yes", set to empty string, otherwise set to "Yes"
      [name]: prevFilters[name] === "Yes" ? "" : "Yes",
    }));
  };

  // Handler for card type checkbox changes
  const handleTypeCheckboxChange = (typeName) => {
    // Update filters state, toggling boolean value for card type
    setFilters((prevFilters) => ({
      // Spread previous filters to preserve other values
      ...prevFilters,
      // Toggle boolean value for the specified type
      [typeName]: !prevFilters[typeName],
    }));
  };

  // Handler for favorites filter toggle
  const handleFavoritesChange = () => {
    // Update filters state, toggling showOnlyFavorites boolean
    setFilters((prevFilters) => ({
      // Spread previous filters to preserve other values
      ...prevFilters,
      // Toggle showOnlyFavorites boolean value
      showOnlyFavorites: !prevFilters.showOnlyFavorites,
    }));
  };

  // Handler for cost range filter changes
  const handleCostChange = ({ costMin, costMax }) => {
    // Update filters state with new cost range values
    setFilters((prevFilters) => ({
      // Spread previous filters to preserve other values
      ...prevFilters,
      // Update cost minimum and maximum values
      costMin,
      costMax,
    }));
  };

  // Helper function to update a single filter field
  const updateField = (type, value) => {
    // Update filters state with new value for specified field
    setFilters({ ...filters, [type]: value });
  };

  // Get sort display text
  // Helper function to convert sort value to readable text
  const getSortDisplayText = (sort) => {
    // Return default "Title" if sort is falsy
    if (!sort) return "Title";
    // Return "Title" for title sort
    if (sort === "title") return "Title";
    // Return "Type" for type sort
    if (sort === "type") return "Type";
    // Return "Cost" for cost sort
    if (sort === "cost") return "Cost";
    // Return original sort value if not recognized
    return sort;
  };

  return (
    <section className={styles.filter}>
      <details className={styles["filter-menu"]}>
        <summary>
          <div>
            <h2>Show Filters</h2>
            <p className={styles["sorted-by"]}>Sorted by {getSortDisplayText(filters.sort || "title")}</p>
          </div>
        </summary>

        <form
          method="GET"
          onSubmit={(event) => {
            event.preventDefault();
            event.target.parentNode.removeAttribute("open");
          }}
        >
          <fieldset className={styles["card-stats-group"]}>
            <legend>Filter by Card Type</legend>
            <div className={styles["checkbox-group"]}>
              <FilterCheckbox
                label="Ability"
                checked={filters.typeAbility !== false}
                onChange={() => handleTypeCheckboxChange("typeAbility")}
                name="typeAbility"
              />

              <FilterCheckbox
                label="Item"
                checked={filters.typeItem !== false}
                onChange={() => handleTypeCheckboxChange("typeItem")}
                name="typeItem"
              />

              <FilterCheckbox
                label="Unit"
                checked={filters.typeUnit !== false}
                onChange={() => handleTypeCheckboxChange("typeUnit")}
                name="typeUnit"
              />

              {user && (
                <FilterCheckbox
                  label="Show Only Favorites"
                  checked={filters.showOnlyFavorites === true}
                  onChange={handleFavoritesChange}
                  name="showOnlyFavorites"
                />
              )}
            </div>
          </fieldset>

          <fieldset className={styles["card-stats-group"]}>
            <legend>Filter by Card Stats</legend>
            <div className={styles["checkbox-group"]}>
              <FilterCheckbox
                label="Has Catnip"
                checked={filters.hasCatnip === "Yes"}
                onChange={() => handleCheckboxChange("hasCatnip")}
                name="hasCatnip"
              />

              <FilterCheckbox
                label="Has Defense"
                checked={filters.hasDefense === "Yes"}
                onChange={() => handleCheckboxChange("hasDefense")}
                name="hasDefense"
              />

              <FilterCheckbox
                label="Has Attack"
                checked={filters.hasAttack === "Yes"}
                onChange={() => handleCheckboxChange("hasAttack")}
                name="hasAttack"
              />
            </div>

            <CostFilter
              costMin={filters.costMin !== undefined ? filters.costMin : 0}
              costMax={filters.costMax !== undefined ? filters.costMax : 6}
              onChange={handleCostChange}
            />
          </fieldset>

          <fieldset className={styles["card-stats-group"]}>
            <legend>Sorting</legend>
            <FilterSelect
              label="Sort by"
              options={["title", "type", "cost"]}
              value={filters.sort || "title"}
              onChange={(event) => handleSelectionChange(event, "sort")}
              name="sort"
            />
          </fieldset>

          <footer className={styles["filter-footer"]}>
            <menu>
              <button
                className={styles["button--cancel"]}
                type="reset"
                onClick={() => {
                  setFilters({
                    typeAbility: true,
                    typeItem: true,
                    typeUnit: true,
                    hasCatnip: "",
                    hasDefense: "",
                    hasAttack: "",
                    costMin: 0,
                    costMax: 6,
                    sort: "title",
                    showOnlyFavorites: false,
                  });
                }}
              >
                Reset
              </button>
              <button type="submit" className={styles["button--confirm"]}>
                Submit
              </button>
            </menu>
          </footer>
        </form>
      </details>

      <div className={styles.tags}>
        {/* Handle cost range tag separately */}
        {(() => {
          // Get cost minimum from filters, default to 0 if undefined
          const costMin = filters.costMin !== undefined ? filters.costMin : 0;
          // Get cost maximum from filters, default to 6 if undefined
          const costMax = filters.costMax !== undefined ? filters.costMax : 6;
          // Only show cost tag if not default range (0-6)
          if (costMin !== 0 || costMax !== 6) {
            return (
              <Tag
                key="cost-range"
                type="costRange"
                value={`Cost: ${costMin}-${costMax}`}
                updateField={(type, value) => {
                  // Reset cost filters to default range (0-6)
                  setFilters({ ...filters, costMin: 0, costMax: 6 });
                }}
              />
            );
          }
          // Return null if default range (don't show tag)
          return null;
        })()}

        {/* Handle type filter tags separately */}
        {(() => {
          // Initialize array to store disabled type tags
          const typeTags = [];
          // Add "Ability" to array if typeAbility filter is disabled
          if (filters.typeAbility === false) {
            typeTags.push("Ability");
          }
          // Add "Item" to array if typeItem filter is disabled
          if (filters.typeItem === false) {
            typeTags.push("Item");
          }
          // Add "Unit" to array if typeUnit filter is disabled
          if (filters.typeUnit === false) {
            typeTags.push("Unit");
          }
          
          // Map each disabled type to a Tag component
          return typeTags.map((typeTag) => (
            <Tag
              key={`type-${typeTag}`}
              type={`type${typeTag}`}
              value={typeTag}
              updateField={(type, value) => {
                // Construct filter key for the type
                const typeKey = `type${typeTag}`;
                // Re-enable the type filter by setting it to true
                setFilters({ ...filters, [typeKey]: true });
              }}
            />
          ));
        })()}

        {/* Handle Show Only Favorites tag separately */}
        {filters.showOnlyFavorites === true && (
          <Tag
            key="showOnlyFavorites"
            type="showOnlyFavorites"
            value="❤️ Favorite"
            updateField={(type, value) => {
              // Disable favorites filter by setting to false
              setFilters({ ...filters, showOnlyFavorites: false });
            }}
          />
        )}

        {/* Handle other filter tags */}
        {Object.entries(filters).map(([type, value]) => {
          // The main filter bar already specifies what
          // sorting is being used. So skip showing the
          // sorting as a 'tag'
          // Skip sort filter, empty values, and default title sort
          if (type === "sort" || value === "" || value === "title") {
            return null;
          }

          // Skip cost filters as they're handled separately above
          if (type === "costMin" || type === "costMax") {
            return null;
          }

          // Skip type filters as they're handled separately above
          if (type === "typeAbility" || type === "typeItem" || type === "typeUnit") {
            return null;
          }

          // Skip showOnlyFavorites as it's handled separately below
          if (type === "showOnlyFavorites") {
            return null;
          }

          // Map filter types to display text with emojis
          // Initialize display value with original value
          let displayValue = value;
          // Set display text for catnip filter
          if (type === "hasCatnip" && value === "Yes") {
            displayValue = "🌿 Catnip";
          // Set display text for defense filter
          } else if (type === "hasDefense" && value === "Yes") {
            displayValue = "🛡️ Defense";
          // Set display text for attack filter
          } else if (type === "hasAttack" && value === "Yes") {
            displayValue = "💥 Attack";
          }

          // Return Tag component for this filter
          return (
            <Tag
              key={`${type}-${value}`}
              type={type}
              value={displayValue}
              updateField={updateField}
            />
          );
        })}
      </div>
    </section>
  );
}

