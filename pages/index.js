import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Head from 'next/head'
import dynamic from 'next/dynamic'
import Layout, { siteTitle, siteImage, siteDescription } from '../components/layout'
import { getData } from '../lib/data'
import { throttleCocktailsToDisplay, improvedGetRelevantCocktails, getPopularIngredients } from '../lib/helpers'
import Results from '../components/results'
import Suggestions from '../components/suggestions'

// Dynamically import SearchBar (contains heavy react-select library)
// This reduces First Load JS significantly
const SearchBar = dynamic(() => import('../components/search'), {
  ssr: false,
  loading: () => (
    <div style={{ 
      height: 38, 
      border: '1px solid grey', 
      borderRadius: 4, 
      backgroundColor: 'white',
      boxShadow: '-1px 4px 14px -6px rgba(148,148,148,0.5)',
      display: 'flex',
      alignItems: 'center',
      paddingLeft: 12,
      color: '#999',
      fontSize: 18
    }}>
      Loading search...
    </div>
  )
})

export default function Home({ data }) {
  const [displayMaximum, setDisplayMaximum] = useState(100)
  const [cocktailsToDisplay, setCocktailsToDisplay] = useState(data.cocktails)
  const [negativeMode, setNegativeMode] = useState(false)
  const [popularIngredients, setPopularIngredients] = useState([])
  const [showPopularIngredients, setShowPopularIngredients] = useState(false)
  // Keywords are inputs typed into the search bar or picked from the list of suggestions by the user
  // Keywords look like this: {value: 'foo', label: 'foo', type: 'positive', bgColor: 'red' }
  const [keywords, setKeywords] = useState([])
  const [pantry, setPantry] = useState(false)

  // Memoize the scroll handler to prevent recreating on each render
  const handleScroll = useCallback(() => {
    throttleCocktailsToDisplay(document, setDisplayMaximum);
  }, []);

  // "infinite scroll" with passive listener for better performance
  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  // localstorage - load initial state
  useEffect(() => {
    // Pantry
    const localStoragePantry = JSON.parse(localStorage.getItem('pantry'))
    if (localStoragePantry) {
      setPantry(localStoragePantry)
      const localStoragePantryKeywords = JSON.parse(localStorage.getItem('pantryKeywords'))
      if (localStoragePantryKeywords) {
        setKeywords(localStoragePantryKeywords)
      }
    }

    // Default
    if (keywords.length === 0 && !localStoragePantry) {
      const localStorageKeywords = JSON.parse(localStorage.getItem('keywords'))
      if (localStorageKeywords) {
        setKeywords(localStorageKeywords)
      }
    }

    if (!pantry) {
      const localStorageKeywords = JSON.parse(localStorage.getItem('keywords'))
      if (localStorageKeywords) {
        setKeywords(localStorageKeywords)
      } else {
        setKeywords([])
      }
    }
  }, [pantry])

  // Memoize cocktail filtering for performance
  useEffect(() => {
    // This is an important fn that gets cocktails based off of keywords entered by user.
    const cocktails = improvedGetRelevantCocktails(data.cocktails, keywords, pantry)
    setCocktailsToDisplay(cocktails)

    // Only search for popular ingredients if there is already a keyword being searched for.
    if (keywords.length > 0) {
      const ingredients = getPopularIngredients(data.cocktails, cocktails, keywords, pantry)
      setPopularIngredients(ingredients)
    } else {
      setPopularIngredients([])
    }
  }, [keywords, pantry, data.cocktails])

  return (
    <Layout home pantry={pantry} setPantry={setPantry}>
      <Head>
        <title>{siteTitle}</title>
        <meta name="title" content={siteTitle} />
        <meta name="description" content={siteDescription} />
        <meta name="og:description" content={siteDescription} />
        <meta property="og:image" content={siteImage} />
        <meta property="og:url" content='https://901.benstanfield.io' />
        <meta property="og:type" content="article" />
        {/* Twitter Card data */}
        <meta name="twitter:card" value="summary_large_image" />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:image" content={siteImage} />
      </Head>
      <div style={{ marginBottom: 24 }}>
        <SearchBar pantry={pantry} data={data} keywords={keywords} setKeywords={setKeywords} negativeMode={negativeMode} setNegativeMode={setNegativeMode} />
        <Suggestions props={{
          popularIngredients,
          cocktailsToDisplay,
          keywords,
          showPopularIngredients,
          setKeywords,
          setShowPopularIngredients,
          setPopularIngredients,
          pantry
        }} />
        {pantry &&
          <div className="listOptions">
            <p style={{ fontStyle: 'italic', marginTop: -4, fontSize: 15 }}>Search and save items to your pantry. Results are drinks that can be made with some or all of your pantry items.</p>
          </div>
        }
      </div>
      <label style={{ paddingLeft: 6, paddingBottom: 8, textTransform: 'none' }}> <span>({cocktailsToDisplay.length}) Result{cocktailsToDisplay.length === 1 ? '' : 's'} </span></label>

      <hr />
      <Results displayMaximum={displayMaximum} keywords={keywords} cocktails={cocktailsToDisplay} mapping={data.ingredients_mapping} pantry={pantry} setKeywords={setKeywords} />
    </Layout >
  )
}

export async function getStaticProps() {
  const data = getData()

  return {
    props: {
      data,
    }
  }
}