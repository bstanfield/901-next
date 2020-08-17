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

  // include sortBy if sorting returns
  useEffect(() => {
    const cocktailsToDisplay = getRelevantCocktails(data.cocktails, filters, 'alphabetical')
    setCocktailsToDisplay(cocktailsToDisplay)
  }, [filters])

  const ingredientsInSearchFormat = data.ingredients.map((ingredient) => {
    return { value: ingredient, label: ingredient, color: '#00B8D9', isFixed: true }
  })

  const cocktailNamesInSearchFormat = data.cocktails.map((cocktail) => {
    return { value: cocktail.name, label: cocktail.name, color: '#00B8D9', isFixed: true }
  })

  const getCategoriesInSearchFormat = (categories) => {
    const lists = []
    for (const category in categories) {
      categories[category].lists.map(list => lists.push(list))
    }
    const correctFormat = lists.map(list => ({ value: list, label: list, color: '#00B8D9', isFixed: true }))
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
                  fontSize: 18
                }),
                control: (styles) => ({
                  ...styles,
                  cursor: 'pointer',
                  border: '1px solid #333333',
                  fontSize: 18
                }),
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
                setValues([])
                return
              }
              const filters = vals.map(val => val.value)
              setFilters(filters)
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
            {/* <ListButton label="Simple" lists={lists} setLists={setLists} />
            <ListButton label="Cheap (potentially)" lists={lists} setLists={setLists} /> */}
          </div>
        </div>
        <Cocktails displayMaximum={displayMaximum} filters={filters} cocktails={cocktailsToDisplay} />
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