import Head from 'next/head'
import Script from 'next/script'
import { Fragment, memo, useCallback } from 'react'

export const siteTitle = '901 Cocktails'
export const siteDescription = 'Find the best cocktails you can make with ingredients in your pantry.'
export const siteImage = 'https://i.imgur.com/PA7puwU.png'

function Layout({ children, home, pantry, setPantry }) {
  const handlePantryClick = useCallback(() => {
    setPantry(!pantry)
    localStorage.setItem('pantry', !pantry)
  }, [pantry, setPantry])

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  return (
    <Fragment>
      <Head>
        {/* Load font with display=swap for better performance */}
        <link 
          href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,700;1,700&display=swap" 
          rel="stylesheet"
        />
        <title>{siteTitle}</title>
        <meta name="title" content={siteTitle} />
        <meta name="description" content={siteDescription} />
        <meta name="og:description" content={siteDescription} />
        <meta property="og:image" content={siteImage} />
        <meta property="og:url" content='https://901.benstanfield.io' />
        <meta property="og:type" content="article" />
        {/* Twitter Card data */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:description" content={siteDescription} />
        <meta name="twitter:title" content={siteTitle} />
        <meta name="twitter:image" content={siteImage} />
        {/* Viewport for mobile optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {home && <div className="navItems">
        <a onClick={handlePantryClick}>
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
                  Recipes from the book <a target="_blank" rel="noopener noreferrer" href="https://www.amazon.com/901-Very-Good-Cocktails-Practical/dp/0615708498">901 Cocktails</a>
                </p>
                <p>Website by <a rel="noopener noreferrer" href="https://benstanfield.io">Ben Stanfield</a></p>
              </section>
            </div>
          )
          }
        </header >
        <main>{children}</main>
        <div className="scrollToTop" onClick={handleScrollToTop}>
          ▲ Scroll to top
        </div>
      </div >
      
      {/* Load analytics script with afterInteractive strategy - doesn't block first load */}
      <Script 
        src="https://scripts.simpleanalyticscdn.com/latest.js"
        strategy="afterInteractive"
      />
      <noscript><img src="https://queue.simpleanalyticscdn.com/noscript.gif" alt="" referrerPolicy="no-referrer-when-downgrade" /></noscript>
    </Fragment>
  )
}

export default memo(Layout)
