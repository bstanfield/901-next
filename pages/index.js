import React from 'react';
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import { getData } from '../lib/data'
import { watchScroll, getRelevantCocktails, createSentence, scale } from '../lib/helpers'
import CocktailList from '../components/results'
import { useState, useEffect } from 'react'
import SearchBar from '../components/search'
import Suggestions from '../components/suggestions'

export default function Home({ data }) {
  const [displayMaximum, setDisplayMaximum] = useState(100)
  const [cocktailsToDisplay, setCocktailsToDisplay] = useState(data.cocktails)
  const [filters, setFilters] = useState([]) // from search bar
  const [values, setValues] = useState([])

  // "infinite scroll"
  useEffect(() => {
    watchScroll(document, setDisplayMaximum)
  }, [])

  useEffect(() => {
    if (filters.length === 0) {
      const localStorageFilters = JSON.parse(localStorage.getItem('filters'))
      if (localStorageFilters) {
        const values = localStorageFilters.map(item => ({ value: item, label: item, color: '#00B8D9', isFixed: true }))
        setFilters(localStorageFilters)
        setValues(values)
      }
    }
  }, [])

  useEffect(() => {
    const cocktailsToDisplay = getRelevantCocktails(data.cocktails, filters)
    setCocktailsToDisplay(cocktailsToDisplay)
  }, [filters])

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <div style={{ marginBottom: 24 }}>
        <SearchBar data={data} values={values} setFilters={setFilters} setValues={setValues} />
        <Suggestions values={values} filters={filters} setValues={setValues} setFilters={setFilters} cocktails={data.cocktails} />
      </div>
      <label style={{ paddingLeft: 6, paddingBottom: 12, textTransform: 'none' }}> <span style={{ opacity: 0.6 }}>({cocktailsToDisplay.length}) Result{cocktailsToDisplay.length === 1 ? '' : 's'} </span><span dangerouslySetInnerHTML={{ __html: createSentence(filters) }}></span></label>
      <CocktailList displayMaximum={displayMaximum} filters={filters} cocktails={cocktailsToDisplay} />
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