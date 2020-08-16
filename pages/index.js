import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import { getData } from '../lib/data'
import { sortCocktails, watchScroll } from '../lib/helpers'
import { groupBadgeStyles, formatGroupLabel, groupStyles } from '../lib/search'
import Cocktails from '../components/cocktails'
import { useState, useEffect } from 'react'
import Select from 'react-select';
import SortingButton from '../components/sortingButton'

const getRelevantCocktails = (data, filters) => {
  const relevantCocktails = data.cocktails.filter(cocktail => {
    let count = 0
    let filterCount = filters.length
    for (const filter in filters) {
      if (cocktail.ingredients.includes(filters[filter]) || cocktail.name.includes(filters[filter])) {
        count++
      }
    }
    if (filterCount === count) {
      return true
    }
    return false
  })
  return relevantCocktails
}

export default function Home({ data }) {
  const [displayMaximum, setDisplayMaximum] = useState(100)
  const [cocktailsToDisplay, setCocktailsToDisplay] = useState(data.cocktails)
  const [filters, setFilters] = useState([])
  const [sortBy, setSortBy] = useState('alphabetical')

  useEffect(() => {
    watchScroll(document, setDisplayMaximum)
  }, [])

  useEffect(() => {
    if (filters.length === 0) return setCocktailsToDisplay(data.cocktails);
    const getCocktails = () => {
      const relevantCocktails = getRelevantCocktails(data, filters)
      const sortedCocktails = sortCocktails(relevantCocktails, sortBy)
      setCocktailsToDisplay(sortedCocktails.flat())
    }
    getCocktails()

  }, [filters])

  useEffect(() => {
    const sortedCocktails = sortCocktails(cocktailsToDisplay, sortBy)
    setCocktailsToDisplay(sortedCocktails.flat())

  }, [sortBy])

  const ingredientsInSearchFormat = data.ingredients.map((ingredient) => {
    return { value: ingredient, label: ingredient, color: '#00B8D9', isFixed: true }
  })

  const cocktailNamesInSearchFormat = data.cocktails.map((cocktail) => {
    return { value: cocktail.name, label: cocktail.name, color: '#00B8D9', isFixed: true }
  })

  const groupedOptions = [
    {
      label: 'Ingredients',
      options: ingredientsInSearchFormat,
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
          Reviews and data by <a target="_blank" href="http://www.901cocktails.com/about.html">Stew Ellington</a>.
        </p>
        <p>Website built by <a href="https://benstanfield.io">Ben Stanfield.</a></p>
      </section>
      <section className="headingMd padding1px">
        <div style={{ marginBottom: 24 }}>
          <h2 className="headingLg">({cocktailsToDisplay.length}) Cocktails</h2>
          <Select
            isMulti
            styles={
              {
                option: (styles, state) => ({
                  ...styles,
                  cursor: 'pointer',
                }),
                control: (styles) => ({
                  ...styles,
                  cursor: 'pointer',
                }),
              }
            }
            name="search-bar"
            options={groupedOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            formatGroupLabel={formatGroupLabel}
            placeholder="Filter by ingredient or name"
            onChange={values => {
              if (values === null) {
                setFilters([])
                return
              }
              const filters = values.map(value => value.value)
              setFilters(filters)
            }}
          />
          <SortingButton label="Alphabetical" value="alphabetical" selected={sortBy === "alphabetical"} setSortBy={setSortBy} />
          <SortingButton label="Rating" value="highest_rated" selected={sortBy === "highest_rated"} setSortBy={setSortBy} />
        </div>
        {/* <Categories setFilter={setFilters} categories={data.categories} /> */}
        <Cocktails displayMaximum={displayMaximum} cocktails={cocktailsToDisplay} />
      </section>
    </Layout>
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