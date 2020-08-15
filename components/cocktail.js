import Head from 'next/head'
import Link from 'next/link'

export default function Cocktail({ cocktail }) {
  let rating = '★★★★★'
  let opacity = 1;

  if (cocktail.rating == 4.0) {
    rating = '★★★★'
    opacity = 0.5
  } else if (cocktail.rating == 4.5) {
    rating = '★★★★½'
    opacity = 0.7
  } else {
    rating = '★★★★★'
    opacity = 1
  }

  return (
    <strong><p>{cocktail.name} <span style={{ opacity: opacity, fontSize: 14 }}>{rating}</span></p></strong >
  )
}