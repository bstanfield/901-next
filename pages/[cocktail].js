import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import { getData } from '../lib/data'
import { getCocktailById } from '../lib/helpers'
import Cocktail from '../components/cocktail'
import Link from 'next/link'

export default function CocktailPage({ cocktail }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className="headingMd padding1px">
        <div style={{ marginBottom: 24 }}>
          <Link href="/">&larr; Back</Link>
        </div>
        <Cocktail cocktail={cocktail} />
      </section>
    </Layout >
  )
}

export async function getServerSideProps(context) {
  const data = getData()
  const id = context.params.cocktail
  const cocktail = getCocktailById(data.cocktails, id)

  return {
    props: {
      cocktail,
    },
  }
}