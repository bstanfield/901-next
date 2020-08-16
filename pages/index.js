import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import { getData } from '../lib/data'
import Cocktails from '../components/cocktails'
import { useState, useEffect } from 'react'

export async function getStaticProps() {
  const data = getData()

  return {
    props: {
      data
    }
  }
}

export default function Home({ data }) {
  const [displayMaximum, setDisplayMaximum] = useState(100)

  useEffect(() => {
    document.addEventListener('scroll', () => {
      console.log('scroll y: ', window.scrollY)
      if (window.scrollY > 4000 && window.scrollY < 10000) {
        setDisplayMaximum(400)
      }
      if (window.scrollY > 10000) {
        setDisplayMaximum(1000)
      }
    });
  }, [])

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
        <Cocktails displayMaximum={displayMaximum} cocktails={data.cocktails} />
      </section>
    </Layout>
  )
}