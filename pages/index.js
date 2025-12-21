import React from "react";
import Head from "next/head";
import Layout, {
  siteTitle,
  siteImage,
  siteDescription,
} from "../components/layout";
import { getData } from "../lib/data";
import {
  throttleCocktailsToDisplay,
  improvedGetRelevantCocktails,
  getPopularIngredients,
  createSentence,
} from "../lib/helpers";
import Results from "../components/results";
import { useState, useEffect } from "react";
import SearchBar from "../components/search";
import Suggestions from "../components/suggestions";
import PopularIngredientsBox from "../components/popularIngredientsBox";

// Build a descriptive sentence for the results based on keywords
function ResultsSentence({ count, keywords }) {
  if (keywords.length === 0) {
    return <>{count} cocktails</>;
  }

  // Separate positive and negative keywords by type
  const positiveIngredients = keywords.filter(
    (k) => k.data === "ingredient" && k.type === "positive"
  );
  const negativeIngredients = keywords.filter(
    (k) => k.data === "ingredient" && k.type === "negative"
  );
  const positiveCategories = keywords.filter(
    (k) => k.data === "category" && k.type === "positive"
  );
  const negativeCategories = keywords.filter(
    (k) => k.data === "category" && k.type === "negative"
  );
  const positiveCocktails = keywords.filter(
    (k) => k.data === "cocktail" && k.type === "positive"
  );
  const negativeCocktails = keywords.filter(
    (k) => k.data === "cocktail" && k.type === "negative"
  );
  const positiveFavorites = keywords.filter(
    (k) => k.data === "favorites" && k.type === "positive"
  );

  const parts = [];

  // Build sentence parts
  if (positiveIngredients.length > 0) {
    const names = positiveIngredients.map((k) => `"${k.value}"`);
    if (names.length === 1) {
      parts.push(<>contain {names[0]}</>);
    } else if (names.length === 2) {
      parts.push(
        <>
          contain {names[0]} and {names[1]}
        </>
      );
    } else {
      const last = names.pop();
      parts.push(
        <>
          contain {names.join(", ")}, and {last}
        </>
      );
    }
  }

  if (negativeIngredients.length > 0) {
    const names = negativeIngredients.map((k) => `"${k.value}"`);
    if (names.length === 1) {
      parts.push(<>without {names[0]}</>);
    } else if (names.length === 2) {
      parts.push(
        <>
          without {names[0]} or {names[1]}
        </>
      );
    } else {
      const last = names.pop();
      parts.push(
        <>
          without {names.join(", ")}, or {last}
        </>
      );
    }
  }

  if (positiveCategories.length > 0) {
    const names = positiveCategories.map((k) => `"${k.value}"`);
    if (names.length === 1) {
      parts.push(<>tagged {names[0]}</>);
    } else if (names.length === 2) {
      parts.push(
        <>
          tagged {names[0]} and {names[1]}
        </>
      );
    } else {
      const last = names.pop();
      parts.push(
        <>
          tagged {names.join(", ")}, and {last}
        </>
      );
    }
  }

  if (negativeCategories.length > 0) {
    const names = negativeCategories.map((k) => `"${k.value}"`);
    if (names.length === 1) {
      parts.push(<>not tagged {names[0]}</>);
    } else if (names.length === 2) {
      parts.push(
        <>
          not tagged {names[0]} or {names[1]}
        </>
      );
    } else {
      const last = names.pop();
      parts.push(
        <>
          not tagged {names.join(", ")}, or {last}
        </>
      );
    }
  }

  if (positiveCocktails.length > 0) {
    const names = positiveCocktails.map((k) => `"${k.value}"`);
    if (names.length === 1) {
      parts.push(<>similar to {names[0]}</>);
    } else {
      parts.push(<>similar to {names.join(" and ")}</>);
    }
  }

  if (negativeCocktails.length > 0) {
    const names = negativeCocktails.map((k) => `"${k.value}"`);
    if (names.length === 1) {
      parts.push(<>excluding {names[0]}</>);
    } else {
      parts.push(<>excluding {names.join(" and ")}</>);
    }
  }

  if (positiveFavorites.length > 0) {
    parts.push(<>in your favorites</>);
  }

  // Combine parts with commas
  if (parts.length === 0) {
    return <>{count} cocktails</>;
  }

  return (
    <>
      {count} cocktail{count === 1 ? "" : "s"}{" "}
      {parts.map((part, i) => (
        <React.Fragment key={i}>
          {i > 0 && ", "}
          {part}
        </React.Fragment>
      ))}
    </>
  );
}

export default function Home({ data }) {
  const [displayMaximum, setDisplayMaximum] = useState(100);
  const [cocktailsToDisplay, setCocktailsToDisplay] = useState(data.cocktails);
  const [negativeMode, setNegativeMode] = useState(false);
  const [popularIngredients, setPopularIngredients] = useState([]);
  const [showPopularIngredients, setShowPopularIngredients] = useState(false);
  // Keywords are inputs typed into the search bar or picked from the list of suggestions by the user
  // Keywords look like this: {value: 'foo', label: 'foo', type: 'positive', bgColor: 'red' }
  const [keywords, setKeywords] = useState([]);
  const [pantry, setPantry] = useState(false);
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // "infinite scroll"
  useEffect(() => {
    document.addEventListener("scroll", () =>
      throttleCocktailsToDisplay(document, setDisplayMaximum)
    );
    return () =>
      document.removeEventListener(
        "scroll",
        throttleCocktailsToDisplay(document, setDisplayMaximum)
      );
  }, []);

  // localstorage
  useEffect(() => {
    // Pantry
    const localStoragePantry = JSON.parse(localStorage.getItem("pantry"));
    if (localStoragePantry) {
      setPantry(localStoragePantry);
      const localStoragePantryKeywords = JSON.parse(
        localStorage.getItem("pantryKeywords")
      );
      if (localStoragePantryKeywords) {
        setKeywords(localStoragePantryKeywords);
      }
    }

    // Default
    if (keywords.length === 0 && !localStoragePantry) {
      const localStorageKeywords = JSON.parse(localStorage.getItem("keywords"));
      if (localStorageKeywords) {
        setKeywords(localStorageKeywords);
      }
    }

    if (!pantry) {
      const localStorageKeywords = JSON.parse(localStorage.getItem("keywords"));
      if (localStorageKeywords) {
        setKeywords(localStorageKeywords);
      } else {
        setKeywords([]);
      }
    }
  }, [pantry]);

  useEffect(() => {
    // This is an important fn that gets cocktails based off of keywords entered by user.
    const cocktails = improvedGetRelevantCocktails(
      data.cocktails,
      keywords,
      pantry,
      favorites
    );
    setCocktailsToDisplay(cocktails);

    // Only search for popular ingredients if there is already a keyword being searched for.
    if (keywords.length > 0) {
      const ingredients = getPopularIngredients(
        data.cocktails,
        cocktails,
        keywords,
        pantry,
        favorites
      );
      setPopularIngredients(ingredients);
    } else {
      setPopularIngredients([]);
    }
  }, [keywords, favorites]);

  return (
    <Layout
      home
      pantry={pantry}
      setPantry={setPantry}
      cocktailCount={cocktailsToDisplay.length}
      favorites={favorites}
      keywords={keywords}
      setKeywords={setKeywords}
    >
      <Head>
        <title>{siteTitle}</title>
        <meta name="title" content={siteTitle} />
        <meta name="description" content={siteDescription} />
        <meta name="og:description" content={siteDescription} />
        <meta property="og:image" content={siteImage} />
        <meta property="og:url" content="https://901.benstanfield.io" />
        <meta property="og:type" content="article" />
        {/* Twitter Card data */}
        <meta name="twitter:card" value="summary_large_image" />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:image" content={siteImage} />
      </Head>
      <div style={{ marginBottom: 24 }}>
        <SearchBar
          pantry={pantry}
          data={data}
          keywords={keywords}
          setKeywords={setKeywords}
          negativeMode={negativeMode}
          setNegativeMode={setNegativeMode}
          favorites={favorites}
        />
        <Suggestions
          props={{
            popularIngredients,
            cocktailsToDisplay,
            keywords,
            showPopularIngredients,
            setKeywords,
            setShowPopularIngredients,
            setPopularIngredients,
            pantry,
          }}
        />
        {pantry && (
          <div className="listOptions">
            <p style={{ fontStyle: "italic", marginTop: -4, fontSize: 15 }}>
              Search and save items to your pantry. Results are drinks that can
              be made with some or all of your pantry items.
            </p>
          </div>
        )}
      </div>
      <label
        style={{ paddingLeft: 6, paddingBottom: 8, textTransform: "none" }}
      >
        {" "}
        <span>
          {pantry ? (
            keywords.length === 0 ? (
              <>Add items to your pantry</>
            ) : (
              <>
                {cocktailsToDisplay.length} cocktail
                {cocktailsToDisplay.length === 1 ? "" : "s"} from{" "}
                {keywords.length} pantry item
                {keywords.length === 1 ? "" : "s"}
                <span style={{ opacity: 0.6 }}> · Near-matches included</span>
              </>
            )
          ) : (
            <ResultsSentence
              count={cocktailsToDisplay.length}
              keywords={keywords}
            />
          )}
        </span>
      </label>

      <hr />
      <Results
        displayMaximum={displayMaximum}
        keywords={keywords}
        cocktails={cocktailsToDisplay}
        mapping={data.ingredients_mapping}
        pantry={pantry}
        setKeywords={setKeywords}
        favorites={favorites}
        setFavorites={setFavorites}
      />
    </Layout>
  );
}

export async function getStaticProps() {
  const data = getData();

  return {
    props: {
      data,
    },
  };
}
