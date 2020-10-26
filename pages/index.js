import React from 'react';
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import { getData } from '../lib/data'
import { watchScroll, getRelevantCocktails, improvedGetRelevantCocktails, createSentence, scale } from '../lib/helpers'
import Results from '../components/results'
import { useState, useEffect } from 'react'
import SearchBar from '../components/search'
import Suggestions from '../components/suggestions'

export default function Home({ data }) {
  const [displayMaximum, setDisplayMaximum] = useState(100)
  const [cocktailsToDisplay, setCocktailsToDisplay] = useState(data.cocktails)
  const [negativeMode, setNegativeMode] = useState(false)
  
  const [keywords, setKeywords] = useState([])
    // TODO: every keyword will look like this: {value: 'foo', label: 'foo', type: 'positive'}
  const [filters, setFilters] = useState([]) // from search bar
  const [values, setValues] = useState([])

  // "infinite scroll"
  useEffect(() => {
    watchScroll(document, setDisplayMaximum)
  }, [])

  // // localstorage
  // useEffect(() => {
  //   if (filters.length === 0) {
  //     const localStorageFilters = JSON.parse(localStorage.getItem('filters'))
  //     if (localStorageFilters) {
  //       const values = localStorageFilters.map(item => ({ value: item, label: item, color: '#00B8D9', isFixed: true }))
  //       setFilters(localStorageFilters)
  //       setValues(values)
  //     }
  //   }
  // }, [])

  useEffect(() => {
    // const cocktailsToDisplay = getRelevantCocktails(data.cocktails, filters)
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
  
        {/* <input checked={negativeMode} type="checkbox" id="negative" name="negative" value="negative" onClick={() => setNegativeMode(negativeMode ? false : true)} />
        <label style={{ display: 'inline', paddingLeft: 6 }} for="male">Inverse Search</label>
        <br /> */}

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