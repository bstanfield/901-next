import Head from 'next/head'
import { Fragment } from 'react'
import TipsButton from './tipsButton'

export const siteTitle = '901 Cocktails'
export const siteDescription = 'Find the best cocktails you can make with ingredients in your pantry.'
export const siteImage = 'https://i.imgur.com/PA7puwU.png'

export default function Layout({ children, home, pantry, setPantry }) {
  return (
    <Fragment>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,700;1,700&display=swap" rel="stylesheet" />
        <title>{siteTitle}</title>
        <meta name="title" content={siteTitle} />
        <meta name="description" content={siteDescription} />
        <meta name="og:description" content={siteDescription} />
        <meta property="og:image" content={siteImage} />
        <meta property="og:url" content='https://901.benstanfield.io' />
        <meta property="og:type" content="article" />
        {/* Twitter Card data */}
        <meta name="twitter:card" value="summary_large_image" />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:image" content={siteImage} />
      </Head>

      {home && <div className="navItems">
        <a
          onClick={() => {
            setPantry(!pantry)
            localStorage.setItem('pantry', !pantry)
          }}>
          {pantry ? 'Exit' : 'Enter'} Pantry
        </a>
        <span style={{ padding: '0px 10px', opacity: 0.5 }}>|</span>
        <a href="/tips">Tips</a>
      </div>}

      <div className="container">
        <header className="header">
          {home && (
            <div className="leader">
              <a className="noStyle" href="/">
                <h1 className="heading2Xl">
                  <i>901 Cocktails {pantry && 'Pantry'}</i>
                </h1>
              </a>
              <section className="intro">
                <p>
                  Recipes from the book <a target="_blank" rel="noopener" href="https://www.amazon.com/901-Very-Good-Cocktails-Practical/dp/0615708498">901 Cocktails</a>
                </p>
                <p>Website by <a rel="noopener" href="https://benstanfield.io">Ben Stanfield</a></p>
              </section>
            </div>
          )
          }
        </header >
        <main>{children}</main>
        <div className="scrollToTop" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          ▲ Scroll to top
        </div>
      </div >
      <script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
      <noscript><img src="https://queue.simpleanalyticscdn.com/noscript.gif" alt="" referrerPolicy="no-referrer-when-downgrade" /></noscript>
    </Fragment>
  )
}
