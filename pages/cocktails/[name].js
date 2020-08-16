import Layout from '../../components/layout'
import Head from 'next/head'
import { getAllCocktailNames, getCocktailData } from '../../lib/data'

export default function Cocktail({ params }) {
  const cocktail = await getCocktailData(params.name)[0]
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