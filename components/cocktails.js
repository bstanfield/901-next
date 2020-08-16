import Head from 'next/head'
import Link from 'next/link'
import Cocktail from './cocktail'

export default function Cocktails({ cocktails, displayMaximum }) {
  let cocktailsToDisplay = cocktails.slice(0, displayMaximum)

  return (
    cocktailsToDisplay.map((cocktail) => (<Cocktail cocktail={cocktail} />))
  )
}

