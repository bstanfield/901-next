/** @jsxImportSource @emotion/react */

import Link from "next/link";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import {
  starsBox,
  cocktailName,
  starStyles,
  fadedStarStyles,
  halfStar,
  ingredients,
  instructions,
  listTags,
  copyLink,
  origin,
  cocktailContainer,
  noStyleLink,
} from "../styles/classes";

export default function Cocktail({
  cocktail,
  keywords,
  details,
  mapping,
  setKeywords,
  pantry,
  favorites = [],
  setFavorites,
}) {
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  const isFavorite = favorites.includes(cocktail.id);

  const toggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();

    let newFavorites;
    if (isFavorite) {
      newFavorites = favorites.filter((id) => id !== cocktail.id);
    } else {
      newFavorites = [...favorites, cocktail.id];
    }

    if (setFavorites) {
      setFavorites(newFavorites);
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
    }
  };

  // Used for "copy link"
  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  String.prototype.insert = function (index, value) {
    return this.substr(0, index) + value + this.substr(index);
  };

  String.prototype.indexOfEnd = function (string) {
    var io = this.indexOf(string);
    return io == -1 ? -1 : io + string.length;
  };

  // Create star meter for 4, 4.5, or 5-star cocktail.
  let rating;
  const star = <span css={starStyles(details)}>★</span>;
  const fadedStar = <span css={[starStyles(details), fadedStarStyles]}>★</span>;
  const partialStar = (
    <span css={starStyles(details)}>
      ★<span css={halfStar(details)}></span>
    </span>
  );
  switch (cocktail.rating) {
    case 4.0:
      rating = (
        <>
          {star}
          {star}
          {star}
          {star}
          {fadedStar}
        </>
      );
      break;
    case 4.5:
      rating = (
        <>
          {star}
          {star}
          {star}
          {star}
          {partialStar}
        </>
      );
      break;
    default:
      rating = (
        <>
          {star}
          {star}
          {star}
          {star}
          {star}
        </>
      );
  }

  // Might have more mappings in future. For now, rye = whiskey and scotch
  const checkAlternatives = (line, keyword) => {
    let alternativeMatch = false;
    const alternatives = {
      whiskey: ["rye", "scotch"],
    };

    const selectedAlternatives = alternatives[keyword.toLowerCase()];
    if (selectedAlternatives) {
      for (const alternative of selectedAlternatives) {
        if (line.toLowerCase().includes(alternative)) {
          alternativeMatch = true;
        }
      }
    }
    return alternativeMatch;
  };

  const findSelectedLines = (lines, keyword) => {
    // Ignore keywords that are searches for categories (lists) or cocktail names
    if (
      keyword.data === "category" ||
      keyword.data === "cocktail" ||
      keyword.type === "negative"
    ) {
      return null;
    }

    const { value: keywordValue } = keyword;
    let partialMatches = [];
    let perfectMatch = [];

    // Removes commas, parentheses, etc. from a keywordValue
    const fragments = keywordValue
      .replace(/[^\w\s]/gi, "")
      .split(" ")
      .map((str) => str.trim().toLowerCase());

    for (const line of lines) {
      const lineFragments = line.split(" ");

      // for keywordValues like [whiskey, rye]
      if (fragments.length > 1) {
        let fragmentCount = fragments.length;
        let fragmentMatches = 0;

        for (const fragment of fragments) {
          if (line.toLowerCase().includes(fragment)) {
            fragmentMatches++;
          }
        }

        // As long as there is a 50%+ match, consider that partial match
        if (fragmentMatches >= fragmentCount / 2) {
          partialMatches.push({
            line,
            matches: fragmentMatches,
            potentialMatches: lineFragments.length,
            keywordValue,
          });
        }
      } else {
        const alternative = checkAlternatives(line, keywordValue);
        if (alternative) {
          perfectMatch.push(line);
        }
        // This else block is for single-word keywords
        if (line.toLowerCase().includes(keywordValue.toLowerCase())) {
          perfectMatch.push(line);
        }
      }
    }

    // perfect match
    if (perfectMatch.length > 0) return perfectMatch[0];

    // no matches
    if (partialMatches.length === 0) {
      return null;
    }

    // search all partial matches for best match
    const highestPartialMatch = partialMatches.reduce((acc, partialMatch) => {
      if (!acc) {
        return partialMatch;
      }
      if (acc.matches > partialMatch.matches) {
        return acc;
      }
      if (acc.matches === partialMatch.matches) {
        if (
          acc.matches - acc.potentialMatches >
          partialMatch.matches - partialMatch.potentialMatches
        ) {
          return acc;
        }
      }
      return partialMatch;
    });
    return highestPartialMatch.line;
  };

  // Used to bold tags
  const keywordValues = keywords.map((kw) => kw.value);

  // Handler for clicking a tag to add it to search
  const handleTagClick = (tagName) => {
    // Skip if tag is already in keywords
    if (keywordValues.includes(tagName)) return;

    const newKeyword = {
      data: "category",
      value: tagName,
      strippedValue: tagName.normalize("NFD").replace(/[\u0300-\u036f]/g, ""),
      label: tagName,
      type: "positive",
      bgColor: "rgb(221, 237, 255)",
    };

    const newKeywords = [...keywords, newKeyword];
    setKeywords(newKeywords);

    // Persist to localStorage
    if (!pantry) {
      localStorage.setItem("keywords", JSON.stringify(newKeywords));
    } else {
      localStorage.setItem("pantryKeywords", JSON.stringify(newKeywords));
    }
  };

  // Used to bold line items
  const selectedLines = keywords.map((kw) =>
    findSelectedLines(cocktail.lines, kw)
  );

  // Details parameter is for the detailed cocktail pages (i.e. .../manhattan, .../last_word, etc.)
  return (
    <>
      <div
        key={cocktail.name}
        css={cocktailContainer}
        style={{ position: "relative" }}
      >
        {/* Favorite heart icon */}
        {setFavorites && (
          <button
            onClick={toggleFavorite}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
            style={{
              position: "absolute",
              right: 8,
              top: 8,
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 8,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "transform 0.15s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Heart
              size={24}
              fill={isFavorite ? "#e53e3e" : "none"}
              color={isFavorite ? "#e53e3e" : "#999"}
              strokeWidth={1.5}
            />
          </button>
        )}
        <strong>
          {details ? (
            <div css={cocktailName(details)}>{cocktail.name}</div>
          ) : (
            <Link href={`/${cocktail.id}`}>
              <span css={noStyleLink}>
                <div css={cocktailName(details)}>{cocktail.name}</div>
              </span>
            </Link>
          )}

          <div css={starsBox(details)}>{rating}</div>

          <ul css={ingredients(details)}>
            {!details &&
              cocktail.lines.map((line) => (
                <li
                  key={line}
                  style={{ fontSize: details ? 22 : 18, fontWeight: 400 }}
                >
                  {selectedLines.includes(line) ? (
                    <span style={{ fontWeight: 700 }}>{line}</span>
                  ) : (
                    line
                  )}
                </li>
              ))}
          </ul>
          {details &&
            cocktail.lines.map((line) => (
              <div className="checkableIngredients">
                <label>
                  <input type="checkbox" name={line} value={line} key={line} />
                  &nbsp;{line}
                </label>
              </div>
            ))}

          <p css={instructions(details)}>{cocktail.description}</p>

          {details && cocktail.origin && (
            <p css={origin}>Origin: {cocktail.origin}</p>
          )}

          <div css={listTags(details)}>
            {cocktail.lists.map((list) => (
              <span
                key={list}
                style={{
                  fontSize: details ? 18 : 16,
                  margin: details ? 3 : 2,
                  fontWeight: keywordValues.includes(list) ? 700 : 400,
                  cursor:
                    setKeywords && !keywordValues.includes(list)
                      ? "pointer"
                      : "default",
                }}
                onClick={() => setKeywords && handleTagClick(list)}
              >
                {keywordValues.includes(list) && "✔ "}
                {list}
              </span>
            ))}
          </div>

          {details && (
            <div css={copyLink}>
              <CopyToClipboard text={url || ""} onCopy={() => setCopied(true)}>
                <button>
                  {copied ? "✅ Copied to clipboard" : "🔗 Copy link"}
                </button>
              </CopyToClipboard>
            </div>
          )}
        </strong>
      </div>
      <hr />
    </>
  );
}
