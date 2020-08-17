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
  const [displayMaximum, setDisplayMaximum] = useState(100)
  const [cocktailsToDisplay, setCocktailsToDisplay] = useState(data.cocktails)
  const [filters, setFilters] = useState([])
  const [sortBy, setSortBy] = useState('alphabetical')
  const [list, setList] = useState(null)

  useEffect(() => {
    watchScroll(document, setDisplayMaximum)
  }, [])

  useEffect(() => {
    const cocktailsToDisplay = getRelevantCocktails(data.cocktails, filters, list, sortBy)
    setCocktailsToDisplay(cocktailsToDisplay)
  }, [filters, list, sortBy])

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
        <p>App built by <a href="https://benstanfield.io">Ben Stanfield.</a></p>
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
                  fontSize: 20
                }),
                control: (styles) => ({
                  ...styles,
                  cursor: 'pointer',
                  border: '1px solid #333333',
                  fontSize: 20
                }),
              }
            }
            name="search-bar"
            options={groupedOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            formatGroupLabel={formatGroupLabel}
            placeholder="Search for ingredients or name"
            onChange={values => {
              if (values === null) {
                setFilters([])
                return
              }
              const filters = values.map(value => value.value)
              setFilters(filters)
            }}
          />
          <div className="sortingOptions">
            <label className="topLabel">Sort by</label>
            <SortingButton label="A-Z" value="alphabetical" selected={sortBy === "alphabetical"} setSortBy={setSortBy} />
            <SortingButton label="★ Rating" value="highest_rated" selected={sortBy === "highest_rated"} setSortBy={setSortBy} />
          </div>
          <div className="listOptions">
            <label className="topLabel">Lists</label>
            <ListButton label="Spicy" value="Spicy" selected={list === "Spicy"} setList={setList} />
            <ListButton label="Sweet" value="Sweet" selected={list === "Sweet"} setList={setList} />
            <ListButton label="Simple" value="Simple" selected={list === "Simple"} setList={setList} />
          </div>
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