import React from 'react';
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import { getData } from '../lib/data'
import { watchScroll, getRelevantCocktails } from '../lib/helpers'
import CocktailList from '../components/results'
import { useState, useEffect } from 'react'
import SearchBar from '../components/searchBar';
import Suggestions from '../components/suggestions';

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
      <section className="headingMd intro">
        <p>
          Data from the book <a target="_blank" href="http://www.901cocktails.com">901 Cocktails</a>.
        </p>
        <p>App built by <a href="https://benstanfield.io">Ben Stanfield.</a></p>
      </section>
      <section className="headingMd padding1px">
        <div style={{ marginBottom: 24 }}>
          <h2 className="headingLg">({cocktailsToDisplay.length}) Cocktails</h2>
          <SearchBar data={data} values={values} setFilters={setFilters} setValues={setValues} />
          <Suggestions values={values} filters={filters} setValues={setValues} setFilters={setFilters} />
        </div>
        <CocktailList displayMaximum={displayMaximum} filters={filters} cocktails={cocktailsToDisplay} />
      </section>
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