import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import { getData } from '../lib/data'
import Cocktails from '../components/cocktails'
import { useState, useEffect } from 'react'
import Categories from '../components/categories'
import Select from 'react-select';

const groupStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};
const groupBadgeStyles = {
  backgroundColor: '#EBECF0',
  borderRadius: '2em',
  color: '#172B4D',
  display: 'inline-block',
  fontSize: 12,
  fontWeight: 'normal',
  lineHeight: '1',
  minWidth: 1,
  padding: '0.16666666666667em 0.5em',
  textAlign: 'center',
};

const formatGroupLabel = data => (
  <div style={groupStyles}>
    <span>{data.label}</span>
    <span style={groupBadgeStyles}>{data.options.length}</span>
  </div>
);

const getRelevantCocktails = (data, filters) => {
  console.log('filters: ', filters)
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

  useEffect(() => {
    document.addEventListener('scroll', () => {
      if (window.scrollY > 4000 && window.scrollY < 10000) {
        setDisplayMaximum(400)
      }
      if (window.scrollY > 10000) {
        setDisplayMaximum(901)
      }
    });
  }, [])

  useEffect(() => {
    if (filters.length === 0) return setCocktailsToDisplay(data.cocktails);
    const getCocktails = () => {
      const relevantCocktails = getRelevantCocktails(data, filters)
      // const reducer = (accArr, currentCocktail) => {
      //   if (accArr.length === 0) {
      //     accArr.push(currentCocktail)
      //     return accArr
      //   }
      //   const truthyFilter = accArr.filter((cocktail) => cocktail.name === currentCocktail.name)
      //   if (truthyFilter.length === 0) {
      //     accArr.push(currentCocktail)
      //   }
      //   return accArr
      // }
      // const noDuplicates = relevantCocktails.reduce(reducer, [])
      setCocktailsToDisplay(relevantCocktails)
    }
    getCocktails()

  }, [filters])

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
      <section className="headingMd">
        <p>
          Next.js app for 901 Cocktails
        </p>
      </section>
      <section className="headingMd padding1px">
        <h2 className="headingLg">({cocktailsToDisplay.length}) Cocktails</h2>
        <Select
          isMulti
          name="search-bar"
          options={groupedOptions}
          className="basic-multi-select"
          classNamePrefix="select"
          formatGroupLabel={formatGroupLabel}
          placeholder="Filter by ingredient or drink name"
          onChange={values => {
            if (values === null) {
              setFilters([])
              return
            }
            const filters = values.map(value => value.value)
            setFilters(filters)
          }}
        />
        <br />
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