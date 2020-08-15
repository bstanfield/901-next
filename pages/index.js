import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import { getData } from '../lib/data'
import Link from 'next/link'
import Cocktail from '../components/cocktail'

export async function getStaticProps() {
  const data = getData()

  return {
    props: {
      data
    }
  }
}

export default function Home({ data }) {
  console.log('data.cocktails: ', data.cocktails);
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
        <h2 className="headingLg">Cocktails</h2>
        {data.cocktails.map((cocktail) => (<Cocktail cocktail={cocktail} />))}
      </section>
    </Layout>
  )
}