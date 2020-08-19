import Head from 'next/head'
import Link from 'next/link'

const name = '🍸 901'
export const siteTitle = '901 Cocktails'

export default function Layout({ children, home }) {
  return (
    <div className="container">
      <Head>
        <meta
          name="description"
          content="Search for the very best cocktails you can make with ingredients on hand."
        />
        <meta
          property="og:image"
          content={`https://i.imgur.com/adqY6pe.png`}
        />
        <meta name="og:title" content={siteTitle} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <header className="header">
        {home ? (
          <>
            <h1 className="heading2Xl">{name}</h1>
          </>
        ) : (
            <>
              <h2 className="headingLg">
                <Link href="/">
                  <a className="colorInherit">{name}</a>
                </Link>
              </h2>
            </>
          )}
      </header>
      <main>{children}</main>
      <div className="scrollToTop" onClick={() => window.scrollTo(0, 0)}>▲ Scroll to top</div>
      {!home && (
        <div className="styles.backToHome">
          <Link href="/">
            <a>← Back to home</a>
          </Link>
        </div>
      )}
    </div>
  )
}