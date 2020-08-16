import Head from 'next/head'
import Link from 'next/link'
import Cocktail from './cocktail'

export default function Cocktails({ cocktails, displayMaximum }) {
  if (cocktails == []) {
    return (null);
  }

  let cocktailsToDisplay = cocktails.slice(0, displayMaximum || 901)

  return (
    cocktailsToDisplay.map((cocktail) => (<Cocktail cocktail={cocktail} />))
  )
}

