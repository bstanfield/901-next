import Layout from '../../components/layout'
import Head from 'next/head'
import { getAllArticleIds, getArticleData } from '../../lib/data'

export default function Article({ article }) {
  const categories = JSON.parse(article.fileContents);
  return (
    <Layout>
      <Head>
        <title>{article.id}</title>
      </Head>
      <article>
        <h1>{article.id}</h1>
        <div>
          No date
        </div>
        Put data here:
        <ul>
          {categories.map((category) => (<li>{category.name}</li>))}
        </ul>
      </article>
    </Layout>
  )
}

export async function getStaticPaths() {
  const paths = getAllArticleIds()
  return {
    paths,
    fallback: false
  }
}

export async function getStaticProps({ params }) {
  // Fetch necessary data for the blog post using params.id
  const article = await getArticleData(params.id)
  return {
    props: {
      article
    }
  }
}