import React from 'react';
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import { getData } from '../lib/data'
import { watchScroll, getRelevantCocktails } from '../lib/helpers'
import { formatGroupLabel } from '../lib/search'
import Cocktails from '../components/cocktails'
import { useState, useEffect } from 'react'
import Select from 'react-select';
import SortingButton from '../components/sortingButton'
import ListButton from '../components/listButton'

export default function Home({ data }) {
  // const [sortBy, setSortBy] = useState('alphabetical')
  const [displayMaximum, setDisplayMaximum] = useState(100)
  const [cocktailsToDisplay, setCocktailsToDisplay] = useState(data.cocktails)
  const [filters, setFilters] = useState([]) // from search bar
  const [values, setValues] = useState([])
  // const [lists, setLists] = useState([])

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
    const cocktailsToDisplay = getRelevantCocktails(data.cocktails, filters, 'alphabetical')
    setCocktailsToDisplay(cocktailsToDisplay)
  }, [filters])

  const ingredientsInSearchFormat = data.ingredients.map((ingredient) => {
    return { value: ingredient, label: ingredient, isFixed: true }
  })

  const cocktailNamesInSearchFormat = data.cocktails.map((cocktail) => {
    return { value: cocktail.name, label: cocktail.name, isFixed: true }
  })

  const getCategoriesInSearchFormat = (categories) => {
    const lists = []
    for (const category in categories) {
      categories[category].lists.map(list => lists.push(list))
    }
    const correctFormat = lists.map(list => ({ value: list, label: list, isFixed: true }))
    return correctFormat
  }

  const listsInSearchFormat = getCategoriesInSearchFormat(data.categories)

  const groupedOptions = [
    {
      label: 'Ingredients',
      options: ingredientsInSearchFormat,
    },
    {
      label: 'Categories',
      options: listsInSearchFormat,
    },
    {
      label: 'Cocktails',
      options: cocktailNamesInSearchFormat,
    }
  ];

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className="headingMd intro">
        <p>
          Data from the book <a target="_blank" href="http://www.901cocktails.com">901 Very Good Cocktails</a>.
        </p>
        <p>App built by <a href="https://benstanfield.io">Ben Stanfield.</a></p>
      </section>
      <section className="headingMd padding1px">
        <div style={{ marginBottom: 24 }}>
          <h2 className="headingLg">({cocktailsToDisplay.length}) Cocktails</h2>
          <Select
            isMulti
            autoFocus
            styles={
              {
                option: (styles, state) => ({
                  ...styles,
                  cursor: 'pointer',
                  fontSize: 18,
                }),
                control: (styles) => ({
                  ...styles,
                  cursor: 'pointer',
                  border: '1px solid #333333',
                  fontSize: 18
                }),
                multiValue: (styles) => ({
                  ...styles,
                  backgroundColor: 'rgb(221, 237, 255)',
                  border: '1px solid rgb(0, 93, 214)',
                })
              }
            }
            name="search-bar"
            options={groupedOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            value={values}
            formatGroupLabel={formatGroupLabel}
            placeholder="Search by ingredient or category"
            onChange={vals => {
              if (vals === null) {
                setFilters([])
                localStorage.setItem('filters', JSON.stringify([]));
                setValues([])
                return
              }
              const filters = vals.map(val => val.value)
              setFilters(filters)
              localStorage.setItem('filters', JSON.stringify(filters));
              setValues(vals)
            }}
          />
          <div className="listOptions">
            <label className="topLabel">Suggestions</label>
            <ListButton label="Sweet" values={values} setValues={setValues} filters={filters} setFilters={setFilters} />
            <ListButton label="Simple" values={values} setValues={setValues} filters={filters} setFilters={setFilters} />
            <ListButton label="Cheap (potentially)" values={values} setValues={setValues} filters={filters} setFilters={setFilters} />
            <ListButton label="Mad men" values={values} setValues={setValues} filters={filters} setFilters={setFilters} />
            <ListButton label="Tiki time" values={values} setValues={setValues} filters={filters} setFilters={setFilters} />
            <ListButton label="Complicated" values={values} setValues={setValues} filters={filters} setFilters={setFilters} />
            <ListButton label="Herbaceous" values={values} setValues={setValues} filters={filters} setFilters={setFilters} />
            <ListButton label="Smoky" values={values} setValues={setValues} filters={filters} setFilters={setFilters} />
            <ListButton label="Lemon" values={values} setValues={setValues} filters={filters} setFilters={setFilters} />
            <ListButton label="Lime" values={values} setValues={setValues} filters={filters} setFilters={setFilters} />
            <ListButton label="Whiskey, bourbon" values={values} setValues={setValues} filters={filters} setFilters={setFilters} />
          </div>
        </div>
        <Cocktails displayMaximum={displayMaximum} filters={filters} cocktails={cocktailsToDisplay} />
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