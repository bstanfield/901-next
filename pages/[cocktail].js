import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import { getData } from '../lib/data'
import { getCocktailById, getSimilarCocktails } from '../lib/helpers'
import Cocktail from '../components/cocktail'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function CocktailPage({ cocktail, similarCocktails }) {
  const [keywords, setKeywords] = useState([])
  const adjective = {
    4: 'Solid',
    4.5: 'Very good',
    5: 'Exceptional'
  }

  // If we want keywords, need to use storage
  // useEffect(() => {
  //   const localStorageFilters = JSON.parse(localStorage.getItem('filters'))
  //   if (localStorageFilters) {
  //     setFilters(localStorageFilters)
  //   }
  // }, [])

  return (
    <Layout>
      <Head>
        <title>{cocktail.name}&nbsp;({cocktail.rating === 4.5 ? '4½' : cocktail.rating}★) | {siteTitle}</title>
        <meta name="og:title" content={`${cocktail.name}(${cocktail.rating === 4.5 ? '4½' : cocktail.rating}★) | ${siteTitle}`} />
        <meta name="og:description" content={`${adjective[cocktail.rating]} cocktail with ${cocktail.ingredients[0]}, ${cocktail.ingredients[1]}, and ${cocktail.ingredients.length - 2} other ingredients.`} />
      </Head>
      <section className="padding1px">
        <label style={{ marginBottom: 24 }}>
          <Link href="/">&larr; HOME</Link>
        </label>
        <Cocktail details keywords={keywords} cocktail={cocktail} />
        <p>Similar cocktails:</p>
        {similarCocktails.slice(1, 4).map(cocktail => {
          return (<Cocktail key={cocktail.id} keywords={keywords} parent={similarCocktails[0]} cocktail={cocktail} />)
        })}
      </section>
    </Layout >
  )
}

export async function getServerSideProps(context) {
  const data = getData()
  const id = context.params.cocktail
  const cocktail = getCocktailById(data.cocktails, id)

  const similarCocktails = getSimilarCocktails(data.cocktails, cocktail.ingredients)

  return {
    props: {
      cocktail,
      similarCocktails,
    },
  }
}

// export async function getStaticPaths() {
//   const data = getData()
//   const ids = data.cocktails.map(cocktail => ({ params: { cocktail: cocktail.id } }))
//   return {
//     paths: ids,
//     fallback: false
//   }
// }

// export async function getStaticProps({ params }) {
//   const data = getData()
//   const id = params.cocktail
//   const cocktail = getCocktailById(data.cocktails, id)
//   const similarCocktails = getSimilarCocktails(data.cocktails, cocktail.ingredients)

//   return {
//     props: {
//       cocktail,
//       similarCocktails
//     }
//   }
// }