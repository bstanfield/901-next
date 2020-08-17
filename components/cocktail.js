import Head from 'next/head'
import Link from 'next/link'
import { differenceInMilliseconds } from 'date-fns';

export default function Cocktail({ cocktail }) {
  let rating
  if (cocktail.rating == 4.0) {
    rating = <><span className="star">★</span><span className="star">★</span><span className="star">★</span><span className="star">★</span><span className="star fadedStar">★</span></>
  } else if (cocktail.rating == 4.5) {
    rating = <><span className="star">★</span><span className="star">★</span><span className="star">★</span><span className="star">★</span><span className="star">★<span className="halfStar"></span></span></>
  } else {
    rating = <><span className="star">★</span><span className="star">★</span><span className="star">★</span><span className="star">★</span><span className="star">★</span></>
  }

  const getGlassTypeEmoji = (cocktail) => {
    if (cocktail.description.includes("rocks")) {
      return <span style={{ fontSize: 18 }}>🥃</span>
    } else if (cocktail.description.includes("cocktail glass")) {
      return '🍸'
    } else if (cocktail.description.includes("martini glass")) {
      return '🍸'
    } else if (cocktail.description.includes("pint glass")) {
      return '🍺'
    } else if (cocktail.description.includes("highball")) {
      return '🥛'
    } else if (cocktail.description.includes("wine glass")) {
      return '🍷'
    } else if (cocktail.description.includes("champagne flute")) {
      return '🥂'
    }
  }

  return (
    <>
      <div style={{ paddingLeft: 16, paddingTop: 16, paddingBottom: 8, paddingRight: 16, position: 'relative' }}>
        <div style={{ position: 'absolute', top: 6, right: 12 }}>{getGlassTypeEmoji(cocktail)}</div>
        <strong>
          <p className="cocktailName">{cocktail.name}</p>
          <div style={{ width: 140, position: 'relative' }}>
            {rating}
          </div>
          <ul style={{ margin: 0, paddingLeft: 32, paddingTop: 12 }}>
            {cocktail.lines.map((line) => <li style={{ fontSize: 16, fontWeight: 400 }}>{line}</li>)}
          </ul>

          <i><p style={{ fontSize: 18, fontWeight: 400, fontFamily: 'Georgia, Sanserif' }}>"{cocktail.description}"</p></i>
          {cocktail.origin && (<p style={{ marginTop: '-8px', padding: 0, textTransform: 'uppercase', fontSize: 13, fontWeight: 700, opacity: 0.5 }}>FROM: {cocktail.origin}</p>)}
        </strong>
      </div>
      <hr />
    </>
  )
}