import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import { getData } from '../lib/data'
import Cocktails from '../components/cocktails'
import { useState, useEffect } from 'react'
import Categories from '../components/categories'

const getRelevantCocktails = (data, filter) => {
  const relevantCocktailsByTerm = data.cocktails.filter(cocktail => cocktail.lists.includes(filter))
  return relevantCocktailsByTerm
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
    if (filters.length === 0) return;
    const getCocktails = () => {
      const relevantCocktails = filters.map(filter => getRelevantCocktails(data, filter)).flat()
      const reducer = (accArr, currentCocktail) => {
        if (accArr.length === 0) {
          accArr.push(currentCocktail)
          return accArr
        }
        const truthyFilter = accArr.filter((cocktail) => cocktail.name === currentCocktail.name)
        if (truthyFilter.length === 0) {
          accArr.push(currentCocktail)
        }
        return accArr
      }
      const noDuplicates = relevantCocktails.reduce(reducer, [])
      setCocktailsToDisplay(noDuplicates)
    }
    getCocktails()

  }, [filters])

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
        <Categories setFilter={setFilters} categories={data.categories} />
        <Cocktails displayMaximum={displayMaximum} cocktails={cocktailsToDisplay} />
      </section>
    </Layout>
  )
}

export async function getStaticProps() {
  const data = getData()

  return {
    props: {
      data
    }
  }
}