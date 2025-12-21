import Head from "next/head";
import Layout, { siteTitle } from "../components/layout";
import { getData } from "../lib/data";
import { getCocktailById, getSimilarCocktails } from "../lib/helpers";
import Cocktail from "../components/cocktail";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ChevronLeft, Link2, Check } from "lucide-react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import DrinkStepper from "../components/drinkStepper";

export default function CocktailPage({ cocktail, similarCocktails }) {
  const [keywords, setKeywords] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [drinkCount, setDrinkCount] = useState(1);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState("");

  const adjective = {
    4: "Solid",
    4.5: "Very good",
    5: "Exceptional",
  };

  // Load favorites from localStorage
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites");
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }
  }, []);

  // Set URL for copy link
  useEffect(() => {
    setUrl(window.location.href);
  }, []);

  return (
    <Layout>
      <Head>
        <title>
          {cocktail.name}&nbsp;(
          {cocktail.rating === 4.5 ? "4½" : cocktail.rating}★) | {siteTitle}
        </title>
        <meta
          name="og:title"
          content={`${cocktail.name}(${
            cocktail.rating === 4.5 ? "4½" : cocktail.rating
          }★) | ${siteTitle}`}
        />
        <meta
          name="og:description"
          content={`${adjective[cocktail.rating]} cocktail with ${
            cocktail.ingredients[0]
          }, ${cocktail.ingredients[1]}, and ${
            cocktail.ingredients.length - 2
          } other ingredients.`}
        />
      </Head>
      <section className="padding1px">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 4,
              transition: "background-color 0.15s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#f0f0f0";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <ChevronLeft size={30} color="#999" />
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <DrinkStepper
              value={drinkCount}
              onChange={setDrinkCount}
              min={1}
              max={10}
            />
            <CopyToClipboard text={url || ""} onCopy={() => setCopied(true)}>
              <button
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
                {copied ? (
                  <>
                    <Check size={16} />
                    Copied
                  </>
                ) : (
                  <>
                    <Link2 size={16} />
                    Copy
                  </>
                )}
              </button>
            </CopyToClipboard>
          </div>
        </div>
        <Cocktail
          details
          keywords={keywords}
          cocktail={cocktail}
          favorites={favorites}
          setFavorites={setFavorites}
          drinkCount={drinkCount}
        />
        <p>Similar cocktails:</p>
        {similarCocktails.slice(0, 3).map((cocktail) => {
          return (
            <Cocktail
              key={cocktail.id}
              keywords={keywords}
              parent={similarCocktails[0]}
              cocktail={cocktail}
              favorites={favorites}
              setFavorites={setFavorites}
            />
          );
        })}
      </section>
    </Layout>
  );
}

// export async function getServerSideProps(context) {
//   const data = getData()
//   const id = context.params.cocktail
//   const cocktail = getCocktailById(data.cocktails, id)

//   const similarCocktails = getSimilarCocktails(data.cocktails, cocktail.ingredients)

//   return {
//     props: {
//       cocktail,
//       similarCocktails,
//     },
//   }
// }

export async function getStaticPaths() {
  const data = getData();
  const ids = data.cocktails.map((cocktail) => ({
    params: { cocktail: cocktail.id },
  }));
  return {
    paths: ids,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const data = getData();
  const id = params.cocktail;
  const cocktail = getCocktailById(data.cocktails, id);
  const similarCocktails = getSimilarCocktails(
    data.cocktails,
    cocktail.ingredients,
    cocktail.id
  );

  return {
    props: {
      cocktail,
      similarCocktails,
    },
  };
}
