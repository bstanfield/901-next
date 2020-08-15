import Layout from '../components/layout'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function Results() {
  const router = useRouter()
  const { category, ingredients, name } = router.query
  return (
    <Layout>
      <Head>
        <title>901 Search</title>
      </Head>
      <article>
        <h1>Category: {category}</h1>
        Put data here:
        <ul>
          {/* {categories.map((category) => (<li>{category.name}</li>))} */}
          <li>No data yet</li>
        </ul>
      </article>
    </Layout>
  )
}

// export async function getStaticPaths() {
//   const paths = getAllArticleIds()
//   return {
//     paths,
//     fallback: false
//   }
// }

// export async function getStaticProps(context) {
//   console.log('context: ', context);
//   return {
//     props: context, // will be passed to the page component as props
//   }
// }