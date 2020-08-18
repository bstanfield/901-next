import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import { useRouter } from 'next/router'
// import { getData } from '../lib/data'
// import { watchScroll, getRelevantCocktails } from '../lib/helpers'
// import { formatGroupLabel } from '../lib/search'
// import Cocktails from '../components/cocktails'
// import { useState, useEffect } from 'react'
// import Select from 'react-select';
// import SortingButton from '../components/sortingButton'
// import ListButton from '../components/listButton'

export default function Cocktail() {
  const router = useRouter()
  const { cocktail } = router.query
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className="headingMd intro">
        <p>
          Data from the book <a target="_blank" href="http://www.901cocktails.com">901 Very Good Cocktails</a>.
        </p>
        <p>App built by <a href="https://benstanfield.io">Ben Stanfield.</a></p>
      </section>
      <section className="headingMd padding1px">
        <div style={{ marginBottom: 24 }}>
          <h2 className="headingLg">{cocktail}</h2>
        </div>
        {/* <Cocktails displayMaximum={displayMaximum} filters={filters} cocktails={cocktailsToDisplay} /> */}
      </section>
    </Layout >
  )
}

// export async function getStaticProps() {
//   const data = getData()

//   return {
//     props: {
//       data,
//     }
//   }
// }