import Head from "next/head";
import { Fragment } from "react";
import TipsButton from "./tipsButton";
import AnimatedNumber from "./animatedNumber";

export const siteTitle = "901 Cocktails";
export const siteDescription =
  "Find the best cocktails you can make with ingredients in your pantry.";
export const siteImage = "https://i.imgur.com/PA7puwU.png";
export const appVersion = "2.011";

export default function Layout({
  children,
  home,
  pantry,
  setPantry,
  cocktailCount,
  favorites = [],
  keywords = [],
  setKeywords,
}) {
  const favoritesOption = {
    data: "favorites",
    value: "❤️ Favorites",
    strippedValue: "favorites",
    label: "❤️ Favorites",
    type: "positive",
    bgColor: "rgb(221, 237, 255)",
  };

  const isFavoritesActive = keywords.some((kw) => kw.data === "favorites");

  const toggleFavorites = () => {
    if (!setKeywords) return;

    if (isFavoritesActive) {
      // Remove favorites filter
      const newKeywords = keywords.filter((kw) => kw.data !== "favorites");
      setKeywords(newKeywords);
      localStorage.setItem("keywords", JSON.stringify(newKeywords));
    } else {
      // Add favorites filter
      const newKeywords = [...keywords, favoritesOption];
      setKeywords(newKeywords);
      localStorage.setItem("keywords", JSON.stringify(newKeywords));
    }
  };
  return (
    <Fragment>
      <span
        style={{
          position: "fixed",
          top: 8,
          left: 8,
          fontSize: 11,
          fontFamily:
            "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
          color: "#999",
          zIndex: 1000,
        }}
      >
        v{appVersion}
      </span>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,700;1,700&display=swap"
          rel="stylesheet"
        />
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

      {home && (
        <div
          className="navItems"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "nowrap",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {favorites.length > 0 && (
            <button
              onClick={toggleFavorites}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                height: 32,
                padding: "0 12px",
                backgroundColor: isFavoritesActive ? "#e8f4f8" : "#f5f5f5",
                border: "1px solid #ccc",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 14,
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
                color: "#333",
                boxSizing: "content-box",
                fontWeight: isFavoritesActive ? 600 : 400,
              }}
            >
              {isFavoritesActive ? "✓ " : ""}Favorites ({favorites.length})
            </button>
          )}
          <button
            onClick={() => {
              setPantry(!pantry);
              localStorage.setItem("pantry", !pantry);
            }}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              height: 32,
              padding: "0 12px",
              backgroundColor: "#f5f5f5",
              border: "1px solid #ccc",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 14,
              fontFamily:
                "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
              color: "#333",
              boxSizing: "content-box",
            }}
          >
            {pantry ? "Exit" : "Enter"} Pantry
          </button>
          <a
            href="/tips"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              height: 32,
              padding: "0 12px",
              backgroundColor: "#f5f5f5",
              border: "1px solid #ccc",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 14,
              fontFamily:
                "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif",
              color: "#333",
              boxSizing: "content-box",
              textDecoration: "none",
            }}
          >
            Tips
          </a>
        </div>
      )}

      <div className="container">
        <header className="header">
          {home && (
            <div className="leader">
              <a className="noStyle" href="/">
                <h1 className="heading2Xl">
                  <i>
                    <AnimatedNumber value={cocktailCount || 901} /> Cocktails{" "}
                    {pantry && "Pantry"}
                  </i>
                </h1>
              </a>
              <section className="intro">
                <p>
                  Recipes from the book{" "}
                  <a
                    target="_blank"
                    rel="noopener"
                    href="https://www.amazon.com/901-Very-Good-Cocktails-Practical/dp/0615708498"
                  >
                    901 Cocktails
                  </a>
                </p>
                <p>
                  Website by{" "}
                  <a rel="noopener" href="https://benstanfield.io">
                    Ben Stanfield
                  </a>
                </p>
              </section>
            </div>
          )}
        </header>
        <main>{children}</main>
        <div
          className="scrollToTop"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ▲ Scroll to top
        </div>
      </div>
      <script
        async
        defer
        src="https://scripts.simpleanalyticscdn.com/latest.js"
      ></script>
      <noscript>
        <img
          src="https://queue.simpleanalyticscdn.com/noscript.gif"
          alt=""
          referrerPolicy="no-referrer-when-downgrade"
        />
      </noscript>
    </Fragment>
  );
}
