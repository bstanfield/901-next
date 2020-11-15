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
    setCocktailsToDisplay(
      improvedGetRelevantCocktails(data.cocktails, keywords)
    )
    showPopularIngredients &&
      setPopularIngredients(getPopularIngredients(cocktailsToDisplay, keywords))

    // Bring this back if you want to use ingredient weights
    // setCocktailsToDisplay(cocktailsToDisplay.sort((a, b) => {
    //   const aWeight = a.ingredients.map(i => data.ingredients_mapping[i]).reduce((a, b) => a + b) / a.lines.length
    //   const bWeight = b.ingredients.map(i => data.ingredients_mapping[i]).reduce((a, b) => a + b) / b.lines.length
    //   if (aWeight > bWeight) {
    //     return -1
    //   }
    //   if (bWeight > aWeight) {
    //     return 1
    //   }
    //   return 0
    // }))
  }, [keywords])

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div style={{ marginBottom: 24 }}>
        <SearchBar data={data} keywords={keywords} setKeywords={setKeywords} negativeMode={negativeMode} setNegativeMode={setNegativeMode} />
        <Suggestions cocktails={data.cocktails} keywords={keywords} setKeywords={setKeywords} negativeMode={negativeMode} />
      </div>
      <label style={{ paddingLeft: 6, paddingBottom: 12, textTransform: 'none' }}> <span style={{ opacity: 0.6 }}>({cocktailsToDisplay.length}) Result{cocktailsToDisplay.length === 1 ? '' : 's'} </span><span dangerouslySetInnerHTML={{ __html: createSentence(keywords) }}></span></label>

      {keywords.length > 0 &&
        <PopularIngredientsBox
          props={{
            popularIngredients,
            cocktailsToDisplay,
            keywords,
            showPopularIngredients,
            setShowPopularIngredients,
            setPopularIngredients,
            getPopularIngredients,
          }}
        />}
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