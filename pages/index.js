import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
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
      <section className="headingMd">
        <p>
          Next.js app for 901 Cocktails
        </p>
      </section>
      <section className="headingMd padding1px">
        <h2 className="headingLg">Choose a category</h2>
        <ul className="list">
          {data.categories.map(({ name, lists }) => (
            <li className="listItem">
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