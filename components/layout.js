import Head from 'next/head'

export const siteTitle = '901 Cocktails'

export default function Layout({ children, home }) {
  return (
    <div className="container">
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,700;1,700&display=swap" rel="stylesheet" />
        <meta
          name="description"
          content="Search for the very best cocktails you can make with ingredients on hand."
        />
        <meta
          property="og:image"
          content="https://i.imgur.com/PA7puwU.png"
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header className="header">
        {home && (
          <div className="leader">
            <h1 className="heading2Xl"><i>901 Cocktails</i></h1>
            <section className="intro">
              <p>
                Recipes from Stew Ellington's book <a target="_blank" rel="noopener" href="http://www.901cocktails.com">901 Cocktails</a>.
              </p>
              <p>Website built by <a href="https://benstanfield.io">Ben Stanfield</a>.</p>
            </section>
          </div>
        )
        }
      </header >
      <main>{children}</main>
      <div className="scrollToTop" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>▲ Scroll to top</div>
    </div >
  )
}
