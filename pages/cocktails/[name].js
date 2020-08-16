import Layout from '../../components/layout'
import Head from 'next/head'
import { getAllCocktailNames, getCocktailData } from '../../lib/data'

export default function Cocktail({ cocktail }) {
  console.log('cocktail: ', cocktail)
  return (
    <Layout>
      <Head>
        <title>{cocktail.name}</title>
      </Head>
      <article>
        <h1>{cocktail.name}</h1>
        Put data here:
        <ul>
        </ul>
      </article>
    </Layout>
  )
}

export async function getStaticPaths() {
  const paths = getAllCocktailNames()
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  const cocktail = await getCocktailData(params.name)[0]
  return {
    props: {
      cocktail
    }
  }
}