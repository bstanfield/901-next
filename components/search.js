import Select from "react-select";
import { formatGroupLabel } from "../lib/search";
import { improvedGetRelevantCocktails } from "../lib/helpers";
import { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";

// Build a reverse lookup map: synonym -> canonical ingredient name
const buildSynonymLookup = (synonyms) => {
  const lookup = {};
  if (!synonyms) return lookup;

  for (const [canonical, synonymList] of Object.entries(synonyms)) {
    for (const synonym of synonymList) {
      lookup[synonym.toLowerCase()] = canonical;
    }
  }
  return lookup;
};

const loadData = (data, negativeMode) => {
  const ingredientsInSearchFormat = data.ingredients.map((i) => ({
    data: "ingredient",
    weight: i.weight,
    value: i.ingredient,
    strippedValue: i.ingredient
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""),
    label: negativeMode ? `-${i.ingredient}` : `${i.ingredient}`,
    type: negativeMode ? "negative" : "positive",
    bgColor: negativeMode ? "#ffbdbd" : "rgb(221, 237, 255)",
  }));
  const cocktailNamesInSearchFormat = data.cocktails.map((cocktail) => ({
    data: "cocktail",
    value: cocktail.name,
    strippedValue: cocktail.name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, ""),
    label: negativeMode ? `-${cocktail.name}` : cocktail.name,
    type: negativeMode ? "negative" : "positive",
    bgColor: negativeMode ? "#ffbdbd" : "rgb(221, 237, 255)",
  }));
  const listsInSearchFormat = data.categories
    .map((category) => category.lists)
    .flat()
    .map((list) => ({
      data: "category",
      value: list,
      strippedValue: list.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
      label: negativeMode ? `-${list}` : list,
      type: negativeMode ? "negative" : "positive",
      bgColor: negativeMode ? "#ffbdbd" : "rgb(221, 237, 255)",
    }));

  // Build synonym lookup from data.synonyms
  const synonymLookup = buildSynonymLookup(data.synonyms);

  // Build synonym list for fuzzy searching
  // Each entry has the synonym as strippedValue and the canonical ingredient name
  const synonymsForFuzzy = [];
  if (data.synonyms) {
    for (const [canonical, synonymList] of Object.entries(data.synonyms)) {
      for (const synonym of synonymList) {
        synonymsForFuzzy.push({
          synonym: synonym,
          strippedValue: synonym.toLowerCase(),
          canonical: canonical,
        });
      }
    }
  }

  return {
    ingredients: ingredientsInSearchFormat,
    cocktails: cocktailNamesInSearchFormat,
    lists: listsInSearchFormat,
    synonymLookup,
    synonymsForFuzzy,
  };
};

// Fuse.js configuration for fuzzy search
const fuseOptions = {
  keys: ["strippedValue"],
  threshold: 0.3, // 0 = exact match, 1 = match anything. 0.3 is stricter for typos
  distance: 50, // How close the match must be to the search term
  includeScore: true,
  minMatchCharLength: 2,
};

export default function Search({
  data,
  values,
  pantry,
  keywords,
  negativeMode,
  setFilters,
  setValues,
  setKeywords,
  setNegativeMode,
  favorites = [],
}) {
  const [loadedData, setLoadedData] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [groupedOptions, setGroupedOptions] = useState([]);

  // Create Fuse instances for fuzzy search - memoized based on loadedData
  const fuseInstances = useMemo(() => {
    if (!loadedData.ingredients) return null;
    return {
      ingredients: new Fuse(loadedData.ingredients, fuseOptions),
      lists: new Fuse(loadedData.lists, fuseOptions),
      cocktails: new Fuse(loadedData.cocktails, fuseOptions),
      synonyms: loadedData.synonymsForFuzzy
        ? new Fuse(loadedData.synonymsForFuzzy, fuseOptions)
        : null,
    };
  }, [loadedData]);

  // Favorites filter option
  const favoritesOption = {
    data: "favorites",
    value: "❤️ Favorites",
    strippedValue: "favorites",
    label: `❤️ Favorites (${favorites.length})`,
    type: "positive",
    bgColor: "rgb(221, 237, 255)",
  };

  // Reloads data with negative or positive param
  useEffect(() => {
    setLoadedData(loadData(data, negativeMode));
  }, [negativeMode]);

  useEffect(() => {
    setGroupedOptions([
      {
        label: "Filters",
        options: favorites.length > 0 ? [favoritesOption] : [],
      },
      {
        label: "Ingredients",
        options: loadedData.ingredients,
      },
      {
        label: "Categories",
        options: loadedData.lists,
      },
      {
        label: "Cocktails",
        options: loadedData.cocktails,
      },
    ]);
  }, [loadedData, favorites.length]);

  const filterAndIgnoreExistingMatches = (
    input,
    items,
    existingMatches,
    filterType = 0
  ) => {
    const filterTypes = ["precise", "exact", "partial-match"];
    // input = user input
    // items = ingredients, lists, or cocktails
    // existingMatches = [value1, value2]
    const matches = items.filter((item) => {
      if (existingMatches.includes(item.value)) {
        return false;
      } else {
        if (filterTypes[filterType] === "precise") {
          return item.strippedValue.toLowerCase() === input;
        } else if (filterTypes[filterType] === "exact") {
          // looks for exact matches at same slice length, not whiskey = whiskey but whiskey = whiskey, bourbon (-bourbon)
          return (
            item.strippedValue.toLowerCase().slice(0, input.length) === input
          );
        } else if (filterTypes[filterType] === "partial-match") {
          return item.strippedValue.toLowerCase().includes(input);
        }
      }
    });

    matches.map((match) => existingMatches.push(match.value));
    return matches.sort((a, b) => a.value.length - b.value.length);
  };

  const filterOptions = (rawInput, pantry) => {
    const input = rawInput.toLowerCase().trim();

    let { ingredients, lists, cocktails, synonymLookup } = loadedData;
    let existingMatches = [];

    // Precise matches = priority #0 (highest priority for direct ingredient matches)
    let p0_ingredients = filterAndIgnoreExistingMatches(
      input,
      ingredients,
      existingMatches
    );

    // Finds permutations ahead of time for precise matches
    let limit = 0;
    for (const i in p0_ingredients) {
      if (limit >= 8) break;
      const keywordsPlusIngredient = keywords.concat([p0_ingredients[i]]);
      const relevantCocktails = improvedGetRelevantCocktails(
        data.cocktails,
        keywordsPlusIngredient,
        pantry
      );
      p0_ingredients[
        i
      ].label = `${p0_ingredients[i].value} <span style="position: absolute; right: 16px; opacity: 0.6">${relevantCocktails.length} pairings</span>`;
      p0_ingredients[i]["count"] = relevantCocktails.length;
      limit++;
    }

    p0_ingredients = p0_ingredients.sort((a, b) => b.count - a.count);

    // Direct matches = priority #1
    let p1_ingredients = filterAndIgnoreExistingMatches(
      input,
      ingredients,
      existingMatches,
      1
    );
    // Finds permutations ahead of time
    for (const i in p1_ingredients) {
      if (limit >= 8) break;
      const keywordsPlusIngredient = keywords.concat([p1_ingredients[i]]);
      const relevantCocktails = improvedGetRelevantCocktails(
        data.cocktails,
        keywordsPlusIngredient,
        pantry
      );
      p1_ingredients[
        i
      ].label = `${p1_ingredients[i].value} <span style="position: absolute; right: 16px; opacity: 0.6">${relevantCocktails.length} pairings</span>`;
      p1_ingredients[i]["count"] = relevantCocktails.length;
      limit++;
    }

    p1_ingredients = p1_ingredients.sort((a, b) => b.count - a.count);

    const p1_lists = filterAndIgnoreExistingMatches(
      input,
      lists,
      existingMatches,
      1
    );
    const p1_cocktails = filterAndIgnoreExistingMatches(
      input,
      cocktails,
      existingMatches,
      1
    );

    // Includes = priority #2
    const p2_ingredients = filterAndIgnoreExistingMatches(
      input,
      ingredients,
      existingMatches,
      2
    );
    const p2_lists = filterAndIgnoreExistingMatches(
      input,
      lists,
      existingMatches,
      2
    );
    const p2_cocktails = filterAndIgnoreExistingMatches(
      input,
      cocktails,
      existingMatches,
      2
    );

    // Synonym matches = priority #3 (after direct ingredient matches)
    // If user types a synonym, show the canonical ingredient (but only if not already matched directly)
    let synonym_ingredients = [];
    if (synonymLookup && input.length >= 2) {
      // Check for exact synonym match
      const canonicalIngredient = synonymLookup[input];
      if (canonicalIngredient) {
        const matchedIngredient = ingredients.find(
          (i) => i.value === canonicalIngredient
        );
        if (
          matchedIngredient &&
          !existingMatches.includes(matchedIngredient.value)
        ) {
          // Clone the ingredient and add the matched synonym for display
          const ingredientWithSynonym = {
            ...matchedIngredient,
            matchedSynonym: input,
          };
          synonym_ingredients.push(ingredientWithSynonym);
          existingMatches.push(matchedIngredient.value);
        }
      }

      // Also check for partial synonym matches (e.g., "lux" should match "luxardo" -> "Maraschino")
      for (const [synonym, canonical] of Object.entries(synonymLookup)) {
        if (synonym.startsWith(input) || synonym.includes(input)) {
          const matchedIngredient = ingredients.find(
            (i) => i.value === canonical
          );
          if (
            matchedIngredient &&
            !existingMatches.includes(matchedIngredient.value)
          ) {
            // Clone the ingredient and add the matched synonym for display
            const ingredientWithSynonym = {
              ...matchedIngredient,
              matchedSynonym: synonym,
            };
            synonym_ingredients.push(ingredientWithSynonym);
            existingMatches.push(matchedIngredient.value);
          }
        }
      }

      // Fuzzy search on synonyms (e.g., "luxerdo" should match "luxardo" -> "Maraschino")
      if (fuseInstances && fuseInstances.synonyms) {
        const fuzzySynonymResults = fuseInstances.synonyms.search(input);
        for (const result of fuzzySynonymResults.slice(0, 8)) {
          const { synonym, canonical } = result.item;
          const matchedIngredient = ingredients.find(
            (i) => i.value === canonical
          );
          if (
            matchedIngredient &&
            !existingMatches.includes(matchedIngredient.value)
          ) {
            // Clone the ingredient and add the matched synonym for display
            const ingredientWithSynonym = {
              ...matchedIngredient,
              matchedSynonym: synonym,
            };
            synonym_ingredients.push(ingredientWithSynonym);
            existingMatches.push(matchedIngredient.value);
          }
        }
      }
    }

    // Add pairing counts for synonym matches
    for (const i in synonym_ingredients) {
      const keywordsPlusIngredient = keywords.concat([synonym_ingredients[i]]);
      const relevantCocktails = improvedGetRelevantCocktails(
        data.cocktails,
        keywordsPlusIngredient,
        pantry
      );
      // Show the matched synonym in parentheses with 50% opacity
      const synonymDisplay = synonym_ingredients[i].matchedSynonym
        ? ` <span style="opacity: 0.5">(${synonym_ingredients[i].matchedSynonym})</span>`
        : "";
      synonym_ingredients[
        i
      ].label = `${synonym_ingredients[i].value}${synonymDisplay} <span style="position: absolute; right: 16px; opacity: 0.6">${relevantCocktails.length} pairings</span>`;
      synonym_ingredients[i]["count"] = relevantCocktails.length;
    }

    // Fuzzy matches = priority #4 (for typo tolerance)
    // Uses Fuse.js to find similar matches that weren't caught by exact/partial matching
    let fuzzy_ingredients = [];
    let fuzzy_lists = [];
    let fuzzy_cocktails = [];

    if (fuseInstances && input.length >= 2) {
      // Get fuzzy results and filter out already-matched items
      fuzzy_ingredients = fuseInstances.ingredients
        .search(input)
        .filter((result) => !existingMatches.includes(result.item.value))
        .slice(0, 8)
        .map((result) => {
          existingMatches.push(result.item.value);
          return result.item;
        });

      fuzzy_lists = fuseInstances.lists
        .search(input)
        .filter((result) => !existingMatches.includes(result.item.value))
        .slice(0, 5)
        .map((result) => {
          existingMatches.push(result.item.value);
          return result.item;
        });

      fuzzy_cocktails = fuseInstances.cocktails
        .search(input)
        .filter((result) => !existingMatches.includes(result.item.value))
        .slice(0, 8)
        .map((result) => {
          existingMatches.push(result.item.value);
          return result.item;
        });
    }

    // Check if "favorites" matches the search input
    const favoritesMatches =
      favorites.length > 0 && "favorites".includes(input);

    return [
      {
        label: "Filters",
        options: favoritesMatches ? [favoritesOption] : [],
      },
      {
        label: "Ingredients",
        options: [
          ...p0_ingredients,
          ...p1_ingredients,
          ...p2_ingredients,
          ...synonym_ingredients,
          ...fuzzy_ingredients,
        ],
      },
      {
        label: "Categories",
        options: [...p1_lists, ...p2_lists, ...fuzzy_lists],
      },
      {
        label: "Cocktails",
        options: [...p1_cocktails, ...p2_cocktails, ...fuzzy_cocktails],
      },
    ];

    // option = cocktail obj
    // rawInput = keywords, split on space

    // TODO:
    // Set order of operations for filtering (start w/ direct matches)
    // const words = rawInput.split(' ');
    // const results = words.reduce(
    //   (acc, cur) => acc && option.label.toLowerCase().slice(0, cur.length).includes(cur.toLowerCase()),
    //   true,
    // );
    // return results
  };

  return (
    <Select
      isMulti
      autoFocus
      closeMenuOnSelect={false}
      isLoading={isLoading}
      styles={{
        placeholder: (styles) => ({
          ...styles,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif !important",
          fontWeight: 400,
          opacity: 0.8,
        }),
        input: (styles) => ({
          ...styles,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
          fontSize: 18,
          fontWeight: 400,
          color: "#333333",
        }),
        option: (styles) => ({
          ...styles,
          cursor: "pointer",
          fontSize: 18,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
        }),
        control: (styles) => ({
          ...styles,
          cursor: "pointer",
          border: negativeMode ? "1px solid red" : "1px solid grey",
          fontSize: 18,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
          fontWeight: 300,
          color: "#333333 !important",
          opacity: 1,
          backgroundColor: negativeMode ? "#ef404017" : "white",
          webkitBoxShadow: "-1px 4px 14px -6px rgba(148,148,148,0.5)",
          boxShadow: "-1px 4px 14px -6px rgba(148,148,148,0.5)",
          "&:hover": {
            border: negativeMode
              ? "1px solid red !important"
              : "1px solid blue !important",
          },
        }),
        multiValue: (styles, { data }) => ({
          ...styles,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
          backgroundColor: data.bgColor || "rgb(221, 237, 255)",
          border: "1px solid rgb(0, 93, 214)",
          fontWeight: 400,
        }),
      }}
      name="search-bar"
      options={groupedOptions}
      className="basic-multi-select"
      classNamePrefix="select"
      value={keywords}
      // Disable react-select's internal filtering since we do our own in filterOptions
      // This is crucial for fuzzy search to work - otherwise react-select filters out fuzzy matches
      filterOption={() => true}
      formatOptionLabel={function (data) {
        return <span dangerouslySetInnerHTML={{ __html: data.label }} />;
      }}
      instanceId={1}
      inputValue={inputValue}
      formatGroupLabel={formatGroupLabel}
      placeholder='Search for "sweet" or "bourbon"'
      // Allow cmd-A / ctrl-A to select all text in the input
      onKeyDown={(e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "a") {
          e.preventDefault();
          // Use event.target directly - it's the actual input element
          const input = e.target;
          if (input && input.select) {
            input.select();
          }
        }
      }}
      // Checks for someone entering or exiting negative mode
      onInputChange={(input, type) => {
        // Determines if negative search is on/off
        if (input === "") {
          setNegativeMode(false);
        }
        if (negativeMode) {
          setInputValue(input);
        }
        // Removes "-" sign and enables negative search
        if (input === "-" || input === "!") {
          setNegativeMode(true);
          setInputValue(" ");
        } else {
          setInputValue(input);
        }
        // Prevents loading symbol from showing on basic click in/out of input box
        if (type.action !== "menu-close" && type.action !== "input-blur") {
          setIsLoading(true);
          setGroupedOptions(filterOptions(input, pantry));
        }
        // On menu-close, set data back to original values
        if (type.action === "menu-close") {
          setGroupedOptions([
            {
              label: "Filters",
              options: favorites.length > 0 ? [favoritesOption] : [],
            },
            {
              label: "Ingredients",
              options: loadedData.ingredients,
            },
            {
              label: "Categories",
              options: loadedData.lists,
            },
            {
              label: "Cocktails",
              options: loadedData.cocktails,
            },
          ]);
        }
        setTimeout(() => setIsLoading(false), 1000);
      }}
      onChange={(vals) => {
        if (vals === null) {
          setKeywords([]);
          {
            !pantry && localStorage.setItem("keywords", JSON.stringify([]));
          }
          {
            pantry &&
              localStorage.setItem("pantryKeywords", JSON.stringify([]));
          }
          return;
        }
        // Removes [X results] part of label from keywords for visual pleasantry
        setKeywords(() => {
          vals.map((val) => (val.label = val.label.split("<")[0]));
          return vals;
        });
        {
          !pantry && localStorage.setItem("keywords", JSON.stringify(vals));
        }
        {
          pantry &&
            localStorage.setItem("pantryKeywords", JSON.stringify(vals));
        }
      }}
    />
  );
}
