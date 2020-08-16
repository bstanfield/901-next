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
    <div>
      <strong>
        <p>{cocktail.name}
          <span style={{ marginLeft: 6, opacity: opacity, fontSize: 14, }}>
            {rating}
          </span>
          <ul style={{ margin: 0, paddingLeft: 32, paddingTop: 8 }}>
            {cocktail.lines.map((line) => <li style={{ fontSize: 16, fontWeight: 400 }}>{line}</li>)}
          </ul>
        </p>
      </strong>

    </div>

  )
}