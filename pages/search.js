import Layout from '../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { getData } from '../lib/data'
import { useState, useEffect } from 'react'
import Cocktails from '../components/cocktails'
import Categories from '../components/categories'

const getRelevantCocktails = (data, filter) => {
  const relevantCocktailsByTerm = data.cocktails.filter(cocktail => cocktail.lists.includes(filter))
  return relevantCocktailsByTerm
}

export default function Search({ data }) {
  const [key, setKey] = useState(0)
  const router = useRouter()
  let relevantCocktails = [];
  console.log('key: ', router.query)

  useEffect(() => {
    console.log('setting key: ', router.query.key)
    setKey(router.query.key)
  }, [router])

  useEffect(() => {
    if (router.query.key !== undefined) {
      const getCocktails = () => {
        const filters = router.query.terms.split(',')
        const relevantCocktails = filters.map(filter => getRelevantCocktails(data, filter)).flat()
        console.log('relevant: ', relevantCocktails)
      }
      getCocktails()
    }
  }, [key])

  return (
    <Layout home>
      <Head>
        <title>901 Search</title>
      </Head>
      <section className="headingMd">
        <p>
          Next.js app for 901 Cocktails
      </p>
      </section>
      <section className="headingMd padding1px">
        <h2 className="headingLg">({relevantCocktails.length}) Cocktails</h2>
        <Categories categories={data.categories} />
        <Cocktails cocktails={relevantCocktails} />
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

// export async function getStaticPaths() {
//   const paths = getAllArticleIds()
//   return {
//     paths,
//     fallback: false
//   }
// }