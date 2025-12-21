import React from 'react';
import Head from 'next/head'
import Layout, { siteTitle } from '../components/layout'
import Results from '../components/results'
import SearchBar from '../components/search'
import Suggestions from '../components/suggestions'

export default function Tips() {

  return (
    <Layout home>
      <Head>
        <title>{siteTitle}</title>
      </Head>
      <h1>🔮 Tips & Tricks</h1>
      <hr />
      <h2>Keywords</h2>
      <p>Anything you type into the search bar is a <strong>keyword.</strong> A keyword falls into one of three categories: <strong>Ingredients</strong> (like Gin, Lemon Juice, and Angostura Bitters), <strong>Tags</strong> (like Sweet, Creamy, and Mad Men), or <strong>Cocktails</strong> (like Old Fashioned, Manhattan, and Aviation).</p>
      <p>When you start searching, results are pulled from all three categories, with ingredients always shown first because that's the most common keyword search.</p>

      <br />

      <h2>Negative search</h2>
      <p>To <strong>negate</strong> ingredients, tags, or cocktail names from your search, type "-" (minus symbol) before entering in a keyword in the search bar, and the search bar will turn red. All search results will show a "-" in front of them, to denote they will be negated from your search.</p>
      <img src="./negative-search.gif" />

      <br />

      <h2>Detailed view</h2>
      <p>Click on a cocktail to enter <strong>detailed view.</strong> Each cocktail has a dedicated URL (/old-fashioned, etc.), and can be shared directly. Scroll down the detailed view to browse cocktails with similar ingredients.</p>
      <img src="./detailed-view.gif" />

      <br />

      <h2>Preview keyword combinations</h2>
      <p>When you search for a new keyword, the top 3 results will display a number in brackets next to it. These numbers represent the number of <strong>possible combinations</strong> this keyword has with your existing keywords (if you have any). For example, there are 244 results for cocktails with "Gin", but only 12 with "Ginger Ale". If you are already searching for "Vodka" and you type in "Ginger Ale" the number of possible combinations will be [1], which is the cocktail "Back-Porch Lemonade". </p>
      <img src="./preview-combinations.gif" />

      <h2>Pantry</h2>
      <p>Switch into <strong>Pantry</strong> mode to search and save items you have in stock. These items will persist in your pantry until you delete them, and cocktail results will display for <strong>any combination of ingredients</strong> in your pantry. Pantry search results also include cocktails that you're one ingredient off from being able to make, in case you're able to substitute in an ingredient.</p>
      <img src="./pantry.gif" />
    </Layout >
  )
}
