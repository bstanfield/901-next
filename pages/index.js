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

  // "infinite scroll"
  useEffect(() => {
    document.addEventListener('scroll', () => throttleCocktailsToDisplay(document, setDisplayMaximum));
    return () => document.removeEventListener('scroll', throttleCocktailsToDisplay(document, setDisplayMaximum))
  }, [])

  // localstorage
  useEffect(() => {
    if (keywords.length === 0) {
      const localStorageKeywords = JSON.parse(localStorage.getItem('keywords'))
      if (localStorageKeywords) {
        setKeywords(localStorageKeywords)
      }
    }
  }, [])

  useEffect(() => {
    // This is an important fn that gets cocktails based off of keywords entered by user.
    const cocktails = improvedGetRelevantCocktails(data.cocktails, keywords)
    setCocktailsToDisplay(cocktails)

    // Only search for popular ingredients if there is already a keyword being searched for.
    if (keywords.length > 0) {
      const ingredients = getPopularIngredients(cocktails, keywords)
      setPopularIngredients(ingredients)
    } else {
      setPopularIngredients([])
    }
  }, [keywords])

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div style={{ marginBottom: 24 }}>
        <SearchBar data={data} keywords={keywords} setKeywords={setKeywords} negativeMode={negativeMode} setNegativeMode={setNegativeMode} />
        <Suggestions props={{
          popularIngredients,
          cocktailsToDisplay,
          keywords,
          showPopularIngredients,
          setKeywords,
          setShowPopularIngredients,
          setPopularIngredients,
          getPopularIngredients,
        }} />
      </div>
      <label style={{ paddingLeft: 6, paddingBottom: 8, textTransform: 'none' }}> <span>({cocktailsToDisplay.length}) Result{cocktailsToDisplay.length === 1 ? '' : 's'} </span></label>
      <hr />
      <Results displayMaximum={displayMaximum} keywords={keywords} cocktails={cocktailsToDisplay} mapping={data.ingredients_mapping} />
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