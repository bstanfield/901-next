import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import { getData } from '../lib/data'
import { getCocktailById, getSimilarCocktails } from '../lib/helpers'
import Cocktail from '../components/cocktail'
import Link from 'next/link'

export default function CocktailPage({ cocktail, similarCocktails }) {
  return (
    <Layout>
      <Head>
        <title>{cocktail.name} ({cocktail.rating === 4.5 ? '4½' : cocktail.rating}★) | {siteTitle}</title>
      </Head>
      <section className="headingMd padding1px">
        <label style={{ marginBottom: 24 }}>
          <Link href="/">&larr; HOME</Link>
        </label>
        <Cocktail details cocktail={cocktail} />
        <p>Similar cocktails:</p>
        {similarCocktails.slice(1, 4).map(cocktail => {
          return (<Cocktail parent={similarCocktails[0]} cocktail={cocktail} />)
        })}
      </section>
    </Layout >
  )
}

// export async function getServerSideProps(context) {
//   const data = getData()
//   const id = context.params.cocktail
//   const cocktail = getCocktailById(data.cocktails, id)

//   const similarCocktails = getSimilarCocktails(data.cocktails, cocktail.ingredients)

//   return {
//     props: {
//       cocktail,
//       similarCocktails,
//     },
//   }
// }

export async function getStaticPaths() {
  const data = getData()
  const ids = data.cocktails.map(cocktail => ({ params: { cocktail: cocktail.id } }))
  return {
    paths: ids,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const data = getData()
  const id = params.cocktail
  const cocktail = getCocktailById(data.cocktails, id)
  const similarCocktails = getSimilarCocktails(data.cocktails, cocktail.ingredients)

  return {
    props: {
      cocktail,
      similarCocktails
    }
  }
}