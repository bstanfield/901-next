import React from 'react';
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import { getData } from '../lib/data'
import { throttleCocktailsToDisplay, improvedGetRelevantCocktails, createSentence } from '../lib/helpers'
import Results from '../components/results'
import { useState, useEffect } from 'react'
import SearchBar from '../components/search'
import Suggestions from '../components/suggestions'

export default function Home({ data }) {
  const [displayMaximum, setDisplayMaximum] = useState(100)
  const [cocktailsToDisplay, setCocktailsToDisplay] = useState(data.cocktails)
  const [negativeMode, setNegativeMode] = useState(false)

  // Keywords are inputs typed into the search bar or picked from the list of suggestions by the user
  // Keywords look like this: {value: 'foo', label: 'foo', type: 'positive', bgColor: 'red' }
  const [keywords, setKeywords] = useState([])

  // "infinite scroll"
  useEffect(() => {
    document.addEventListener('scroll', () => throttleCocktailsToDisplay(document, setDisplayMaximum));
    return () => document.removeEventListener('scroll', throttleCocktailsToDisplay())
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
    const cocktailsToDisplay = improvedGetRelevantCocktails(data.cocktails, keywords)
    setCocktailsToDisplay(cocktailsToDisplay)
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
      <Results displayMaximum={displayMaximum} keywords={keywords} cocktails={cocktailsToDisplay} />
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