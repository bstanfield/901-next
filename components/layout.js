import Head from 'next/head'
import { Fragment } from 'react'
import TipsButton from './tipsButton'

export const siteTitle = '901 Cocktails'

export default function Layout({ children, home, pantry, setPantry }) {
  return (
    <Fragment>
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
                  Recipes from the book <a target="_blank" rel="noopener" href="http://www.901cocktails.com">901 Cocktails</a>
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
