/*
editorcoder
SRJC CS55.13 Fall 2025
Week 14: Assignment 14: Final Headless CMS-Powered App 
CardFilters.jsx
2025-11-22
*/

// Filters for Card Listings

// Mark this file as a client component
"use client";

// Import React hooks
import { useState } from "react";
// Import Tag component
import Tag from "./Tag.jsx";
// Import CardFilters CSS styles
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
            min="1"
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
            min="1"
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

// Component for level range filter with sliders
function LevelFilter({ levelMin, levelMax, onChange }) {
  return (
    <div>
      <label>
        Level:
        <div className={styles.costFilterContainer}>
          <span>Min: {levelMin}</span>
          <input
            type="range"
            min="2"
            max="8"
            value={levelMin}
            onChange={(e) => {
              // Parse new minimum value from input
              const newMin = parseInt(e.target.value);
              // If new min exceeds max, adjust max to match new min
              if (newMin > levelMax) {
                // Update both min and max to new min value
                onChange({ levelMin: newMin, levelMax: newMin });
              } else {
                // Update only min value
                onChange({ levelMin: newMin, levelMax });
              }
            }}
          />
        </div>
        <div className={styles.costFilterContainer}>
          <span>Max: {levelMax}</span>
          <input
            type="range"
            min="2"
            max="8"
            value={levelMax}
            onChange={(e) => {
              // Parse new maximum value from input
              const newMax = parseInt(e.target.value);
              // If new max is below min, adjust min to match new max
              if (newMax < levelMin) {
                // Update both min and max to new max value
                onChange({ levelMin: newMax, levelMax: newMax });
              } else {
                // Update only max value
                onChange({ levelMin, levelMax: newMax });
              }
            }}
          />
        </div>
      </label>
    </div>
  );
}

// Main card filters component
export default function CardFilters({ filters, setFilters }) {
  // State to track whether the filters section is open
  const [isOpen, setIsOpen] = useState(false);

  // Handler for select dropdown changes
  const handleSelectionChange = (event, name) => {
    // Update filters state with new value for specified field
    setFilters((prevFilters) => {
      const newValue = event.target.value;
      const updatedFilters = {
        // Spread previous filters to preserve other values
        ...prevFilters,
        // Update the specified filter field with new value
        [name]: newValue,
      };

      // If contentType is changing, reset sort if it's invalid for the new type
      if (name === "contentType") {
        const validCoreCardSorts = ["title", "type", "cost"];
        const validAvatarSorts = ["title", "archetype"];
        const validTerritorySorts = ["title", "environment", "level"];
        const currentSort = prevFilters.sort || "title";

        if (
          newValue === "Core Cards" &&
          !validCoreCardSorts.includes(currentSort)
        ) {
          updatedFilters.sort = "title";
        } else if (
          newValue === "Avatars" &&
          !validAvatarSorts.includes(currentSort)
        ) {
          updatedFilters.sort = "title";
        } else if (
          newValue === "Territories" &&
          !validTerritorySorts.includes(currentSort)
        ) {
          updatedFilters.sort = "title";
        }
      }

      return updatedFilters;
    });
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

  // Handler for level range filter changes
  const handleLevelChange = ({ levelMin, levelMax }) => {
    // Update filters state with new level range values
    setFilters((prevFilters) => ({
      // Spread previous filters to preserve other values
      ...prevFilters,
      // Update level minimum and maximum values
      levelMin,
      levelMax,
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
    // Return "Archetype" for archetype sort
    if (sort === "archetype") return "Archetype";
    // Return "Environment" for environment sort
    if (sort === "environment") return "Environment";
    // Return "Level" for level sort
    if (sort === "level") return "Level";
    // Return original sort value if not recognized
    return sort;
  };

  return (
    <section className={styles.filter}>
      <details
        className={styles["filter-menu"]}
        open={isOpen}
        onToggle={(e) => setIsOpen(e.target.open)}
      >
        <summary>
          <div>
            <h2>{isOpen ? "Hide Filters" : "Show Filters"}</h2>
            <p className={styles["sorted-by"]}>
              {(filters.contentType || "Core Cards") === "Core Cards"
                ? "Displaying Core Cards"
                : (filters.contentType || "Core Cards") === "Avatars"
                  ? "Displaying Avatar Cards"
                  : "Displaying Territory Cards"}
            </p>
            <span className={styles["sorted-by-separator"]}> | </span>
            <p className={styles["sorted-by"]}>
              Sorted by {getSortDisplayText(filters.sort || "title")}
            </p>
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
            <legend>Show</legend>
            <FilterSelect
              label="Content Type"
              options={["Core Cards", "Avatars", "Territories"]}
              value={filters.contentType || "Core Cards"}
              onChange={(event) => handleSelectionChange(event, "contentType")}
              name="contentType"
            />
          </fieldset>

          {(filters.contentType || "Core Cards") === "Core Cards" ? (
            <>
              <fieldset className={styles["card-stats-group"]}>
                <legend>Filter by Core Card Type</legend>
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
                </div>
              </fieldset>

              <fieldset className={styles["card-stats-group"]}>
                <legend>Filter by Core Card Stats</legend>
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
                  costMin={filters.costMin !== undefined ? filters.costMin : 1}
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
            </>
          ) : (filters.contentType || "Core Cards") === "Avatars" ? (
            <>
              <fieldset className={styles["card-stats-group"]}>
                <legend>Filter by Avatar Archetype</legend>
                <div className={styles["checkbox-group"]}>
                  <FilterCheckbox
                    label="Indoor"
                    checked={filters.archetypeIndoor !== false}
                    onChange={() => handleTypeCheckboxChange("archetypeIndoor")}
                    name="archetypeIndoor"
                  />

                  <FilterCheckbox
                    label="Outdoor"
                    checked={filters.archetypeOutdoor !== false}
                    onChange={() =>
                      handleTypeCheckboxChange("archetypeOutdoor")
                    }
                    name="archetypeOutdoor"
                  />

                  <FilterCheckbox
                    label="In-or-Out"
                    checked={filters.archetypeInOrOut !== false}
                    onChange={() =>
                      handleTypeCheckboxChange("archetypeInOrOut")
                    }
                    name="archetypeInOrOut"
                  />
                </div>
              </fieldset>

              <fieldset className={styles["card-stats-group"]}>
                <legend>Sorting</legend>
                <FilterSelect
                  label="Sort by"
                  options={["title", "archetype"]}
                  value={filters.sort || "title"}
                  onChange={(event) => handleSelectionChange(event, "sort")}
                  name="sort"
                />
              </fieldset>
            </>
          ) : (
            <>
              <fieldset className={styles["card-stats-group"]}>
                <legend>Filter by Territory Environment</legend>
                <div className={styles["checkbox-group"]}>
                  <FilterCheckbox
                    label="Indoor"
                    checked={filters.environmentIndoor !== false}
                    onChange={() =>
                      handleTypeCheckboxChange("environmentIndoor")
                    }
                    name="environmentIndoor"
                  />

                  <FilterCheckbox
                    label="Outdoor"
                    checked={filters.environmentOutdoor !== false}
                    onChange={() =>
                      handleTypeCheckboxChange("environmentOutdoor")
                    }
                    name="environmentOutdoor"
                  />
                </div>
              </fieldset>

              <fieldset className={styles["card-stats-group"]}>
                <legend>Filter by Territory Stats</legend>
                <LevelFilter
                  levelMin={
                    filters.levelMin !== undefined ? filters.levelMin : 2
                  }
                  levelMax={
                    filters.levelMax !== undefined ? filters.levelMax : 8
                  }
                  onChange={handleLevelChange}
                />
              </fieldset>

              <fieldset className={styles["card-stats-group"]}>
                <legend>Sorting</legend>
                <FilterSelect
                  label="Sort by"
                  options={["title", "environment", "level"]}
                  value={filters.sort || "title"}
                  onChange={(event) => handleSelectionChange(event, "sort")}
                  name="sort"
                />
              </fieldset>
            </>
          )}

          <footer className={styles["filter-footer"]}>
            <menu>
              <button
                className={styles["button--cancel"]}
                type="reset"
                onClick={() => {
                  const contentType = filters.contentType || "Core Cards";
                  if (contentType === "Core Cards") {
                    setFilters({
                      contentType: "Core Cards",
                      typeAbility: true,
                      typeItem: true,
                      typeUnit: true,
                      hasCatnip: "",
                      hasDefense: "",
                      hasAttack: "",
                      costMin: 1,
                      costMax: 6,
                      sort: "title",
                    });
                  } else if (contentType === "Avatars") {
                    setFilters({
                      contentType: "Avatars",
                      archetypeIndoor: true,
                      archetypeOutdoor: true,
                      archetypeInOrOut: true,
                      sort: "title",
                    });
                  } else {
                    setFilters({
                      contentType: "Territories",
                      environmentIndoor: true,
                      environmentOutdoor: true,
                      levelMin: 2,
                      levelMax: 8,
                      sort: "title",
                    });
                  }
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
        {/* Handle cost range tag separately (only for Core Cards) */}
        {(filters.contentType || "Core Cards") === "Core Cards" &&
          (() => {
            // Get cost minimum from filters, default to 1 if undefined
            const costMin = filters.costMin !== undefined ? filters.costMin : 1;
            // Get cost maximum from filters, default to 6 if undefined
            const costMax = filters.costMax !== undefined ? filters.costMax : 6;
            // Only show cost tag if not default range (1-6)
            if (costMin !== 1 || costMax !== 6) {
              return (
                <Tag
                  key="cost-range"
                  type="costRange"
                  value={`Cost: ${costMin}-${costMax}`}
                  updateField={(type, value) => {
                    // Reset cost filters to default range (1-6)
                    setFilters({ ...filters, costMin: 1, costMax: 6 });
                  }}
                />
              );
            }
            // Return null if default range (don't show tag)
            return null;
          })()}

        {/* Handle type filter tags separately (for Core Cards) */}
        {(filters.contentType || "Core Cards") === "Core Cards" &&
          (() => {
            // Check if filtering is active (at least one type is disabled)
            const typeAbility = filters.typeAbility !== false;
            const typeItem = filters.typeItem !== false;
            const typeUnit = filters.typeUnit !== false;
            const isFilteringActive = !typeAbility || !typeItem || !typeUnit;

            // Only show tags when filtering is active
            if (!isFilteringActive) {
              return null;
            }

            // Initialize array to store enabled type tags
            const typeTags = [];
            // Add "Ability" to array if typeAbility filter is enabled
            if (typeAbility) {
              typeTags.push("Ability");
            }
            // Add "Item" to array if typeItem filter is enabled
            if (typeItem) {
              typeTags.push("Item");
            }
            // Add "Unit" to array if typeUnit filter is enabled
            if (typeUnit) {
              typeTags.push("Unit");
            }

            // Map each enabled type to a Tag component
            return typeTags.map((typeTag) => (
              <Tag
                key={`type-${typeTag}`}
                type={`type${typeTag}`}
                value={typeTag}
                updateField={(type, value) => {
                  // Construct filter key for the type
                  const typeKey = `type${typeTag}`;
                  // Disable the type filter by setting it to false
                  setFilters({ ...filters, [typeKey]: false });
                }}
              />
            ));
          })()}

        {/* Handle archetype filter tags separately (for Avatars) */}
        {(filters.contentType || "Core Cards") === "Avatars" &&
          (() => {
            // Check if filtering is active (at least one archetype is disabled)
            const archetypeIndoor = filters.archetypeIndoor !== false;
            const archetypeOutdoor = filters.archetypeOutdoor !== false;
            const archetypeInOrOut = filters.archetypeInOrOut !== false;
            const isFilteringActive = !archetypeIndoor || !archetypeOutdoor || !archetypeInOrOut;

            // Only show tags when filtering is active
            if (!isFilteringActive) {
              return null;
            }

            // Initialize array to store enabled archetype tags
            const archetypeTags = [];
            // Add "Indoor" to array if archetypeIndoor filter is enabled
            if (archetypeIndoor) {
              archetypeTags.push("Indoor");
            }
            // Add "Outdoor" to array if archetypeOutdoor filter is enabled
            if (archetypeOutdoor) {
              archetypeTags.push("Outdoor");
            }
            // Add "In-or-Out" to array if archetypeInOrOut filter is enabled
            if (archetypeInOrOut) {
              archetypeTags.push("In-or-Out");
            }

            // Map each enabled archetype to a Tag component
            return archetypeTags.map((archetypeTag) => {
              // Map display name to filter key
              let archetypeKey;
              if (archetypeTag === "Indoor") {
                archetypeKey = "archetypeIndoor";
              } else if (archetypeTag === "Outdoor") {
                archetypeKey = "archetypeOutdoor";
              } else if (archetypeTag === "In-or-Out") {
                archetypeKey = "archetypeInOrOut";
              } else {
                archetypeKey = `archetype${archetypeTag}`;
              }
              return (
                <Tag
                  key={`archetype-${archetypeTag}`}
                  type={archetypeKey}
                  value={archetypeTag}
                  updateField={(type, value) => {
                    // Disable the archetype filter by setting it to false
                    setFilters({ ...filters, [archetypeKey]: false });
                  }}
                />
              );
            });
          })()}

        {/* Handle level range tag separately (only for Territories) */}
        {(filters.contentType || "Core Cards") === "Territories" &&
          (() => {
            // Get level minimum from filters, default to 2 if undefined
            const levelMin =
              filters.levelMin !== undefined ? filters.levelMin : 2;
            // Get level maximum from filters, default to 8 if undefined
            const levelMax =
              filters.levelMax !== undefined ? filters.levelMax : 8;
            // Only show level tag if not default range (2-8)
            if (levelMin !== 2 || levelMax !== 8) {
              return (
                <Tag
                  key="level-range"
                  type="levelRange"
                  value={`Level: ${levelMin}-${levelMax}`}
                  updateField={(type, value) => {
                    // Reset level filters to default range (2-8)
                    setFilters({ ...filters, levelMin: 2, levelMax: 8 });
                  }}
                />
              );
            }
            // Return null if default range (don't show tag)
            return null;
          })()}

        {/* Handle environment filter tags separately (for Territories) */}
        {(filters.contentType || "Core Cards") === "Territories" &&
          (() => {
            // Check if filtering is active (at least one environment is disabled)
            const environmentIndoor = filters.environmentIndoor !== false;
            const environmentOutdoor = filters.environmentOutdoor !== false;
            const isFilteringActive = !environmentIndoor || !environmentOutdoor;

            // Only show tags when filtering is active
            if (!isFilteringActive) {
              return null;
            }

            // Initialize array to store enabled environment tags
            const environmentTags = [];
            // Add "Indoor" to array if environmentIndoor filter is enabled
            if (environmentIndoor) {
              environmentTags.push("Indoor");
            }
            // Add "Outdoor" to array if environmentOutdoor filter is enabled
            if (environmentOutdoor) {
              environmentTags.push("Outdoor");
            }

            // Map each enabled environment to a Tag component
            return environmentTags.map((environmentTag) => (
              <Tag
                key={`environment-${environmentTag}`}
                type={`environment${environmentTag}`}
                value={environmentTag}
                updateField={(type, value) => {
                  // Construct filter key for the environment
                  const environmentKey = `environment${environmentTag}`;
                  // Disable the environment filter by setting it to false
                  setFilters({ ...filters, [environmentKey]: false });
                }}
              />
            ));
          })()}

        {/* Handle other filter tags */}
        {Object.entries(filters).map(([type, value]) => {
          // The main filter bar already specifies what
          // sorting is being used. So skip showing the
          // sorting as a 'tag'
          // Skip sort filter, empty values, and default title sort
          if (type === "sort" || value === "" || value === "title") {
            return null;
          }

          // Skip cost filters as they're handled separately above (only for Core Cards)
          if (
            (filters.contentType || "Core Cards") === "Core Cards" &&
            (type === "costMin" || type === "costMax")
          ) {
            return null;
          }

          // Skip level filters as they're handled separately above (only for Territories)
          if (
            (filters.contentType || "Core Cards") === "Territories" &&
            (type === "levelMin" || type === "levelMax")
          ) {
            return null;
          }

          // Skip type filters as they're handled separately above
          if (
            type === "typeAbility" ||
            type === "typeItem" ||
            type === "typeUnit"
          ) {
            return null;
          }

          // Skip archetype filters as they're handled separately above
          if (type === "archetypeIndoor" || type === "archetypeOutdoor" || type === "archetypeInOrOut") {
            return null;
          }

          // Skip environment filters as they're handled separately above
          if (type === "environmentIndoor" || type === "environmentOutdoor") {
            return null;
          }

          // Skip contentType as it's not shown as a tag
          if (type === "contentType") {
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
