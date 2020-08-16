import Head from 'next/head'
import Link from 'next/link'
import { differenceInMilliseconds } from 'date-fns';

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
    <>
      <div style={{ paddingLeft: 26, paddingTop: 16, paddingBottom: 8 }}>
        <strong>
          <p style={{ display: 'inline' }}>{cocktail.name}</p>
          <span style={{ marginLeft: 6, opacity: opacity, fontSize: 14, }}>
            {rating}
          </span>
          <ul style={{ margin: 0, paddingLeft: 32, paddingTop: 8 }}>
            {cocktail.lines.map((line) => <li style={{ fontSize: 16, fontWeight: 400 }}>{line}</li>)}
          </ul>



          <i><p style={{ fontSize: 16, fontWeight: 400 }}>{cocktail.description}</p></i>
          {cocktail.origin && (<p style={{ marginTop: '-8px', padding: 0, textTransform: 'uppercase', fontSize: 13, fontWeight: 700, opacity: 0.5 }}>{cocktail.origin}</p>)}
        </strong>
      </div>
      <hr />
    </>
  )
}