import React from 'react';
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import { getData } from '../lib/data'
import { throttleCocktailsToDisplay, improvedGetRelevantCocktails, getPopularIngredients, createSentence } from '../lib/helpers'
import Results from '../components/results'
import { useState, useEffect } from 'react'
import SearchBar from '../components/search'
import Suggestions from '../components/suggestions'
import PopularIngredientsBox from '../components/popularIngredientsBox';

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

  // "infinite scroll"
  useEffect(() => {
    document.addEventListener('scroll', () => throttleCocktailsToDisplay(document, setDisplayMaximum));
    return () => document.removeEventListener('scroll', throttleCocktailsToDisplay(document, setDisplayMaximum))
  }, [])

  // localstorage
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
  }, [keywords])

  return (
    <Layout home pantry={pantry} setPantry={setPantry}>
      <Head>
        <title>{siteTitle}</title>
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
      <Results displayMaximum={displayMaximum} keywords={keywords} cocktails={cocktailsToDisplay} mapping={data.ingredients_mapping} pantry={pantry} />
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