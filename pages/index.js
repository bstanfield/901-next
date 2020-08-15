import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import { getCategories } from '../lib/data'
import Link from 'next/link'
import Date from '../components/date'

export async function getStaticProps() {
  const allCategories = getCategories()
  return {
    props: {
      allCategories
    }
  }
}

export default function Home({ allCategories }) {
  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <section className={utilStyles.headingMd}>
        <p>901 Cocktails</p>
        <p>
          (This is a sample website - you’ll be building a site like this on{' '}
          <a href="https://nextjs.org/learn">our Next.js tutorial</a>.)
        </p>
      </section>
      <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>
        <h2 className={utilStyles.headingLg}>901 Cocktails</h2>
        <ul className={utilStyles.list}>
          {allCategories.map(({ name, lists }) => (
            <li className={utilStyles.listItem}>
              <Link href="/articles/[id]" as={`/articles/thing`}>
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