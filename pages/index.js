import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getData } from '../lib/data'
import Link from 'next/link'

export async function getStaticProps() {
  const data = getData()

  return {
    props: {
      data
    }
  }
}

export default function Home({ data }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>
          Next.js app for 901 Very Good Cocktails
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>Choose a category</h2>
        <ul className={utilStyles.list}>
          {data.categories.map(({ name, lists }) => (
            <li className={utilStyles.listItem}>
              <Link href="/search?category=[id]" as={`/search?category=${name}`}>
                <a>{name}</a>
              </Link>
              <br />
            </li>
          ))}
        </ul>
      </section>
    </Layout>
  )
}