import { createCocktailId } from '../lib/helpers'
import Link from 'next/link'

export default function Cocktail({ cocktail, filters = [], details }) {
  let rating
  const star = <span className="star">★</span>

  switch (cocktail.rating) {
    case 4.0:
      rating = <>{star}{star}{star}{star}<span className="star fadedStar">★</span></>
      break
    case 4.5:
      rating = <>{star}{star}{star}{star}<span className="star">★<span className="halfStar"></span></span></>
      break
    default:
      rating = <>{star}{star}{star}{star}{star}</>
  }

  return (
    <>
      <div key={cocktail.name} className="cocktailContainer">
        {/* {details && <div style={{ position: 'absolute', top: 6, right: 12 }}>{getGlassTypeEmoji(cocktail)}</div>} */}
        <strong>
          <Link href="/[cocktail]" as={`/${cocktail.id}`}><a rel="noopener" href="" className="noStyleLink"><p className="cocktailName">{cocktail.name}</p></a></Link>
          <div style={{ width: 140, position: 'relative' }}>
            {rating}
          </div>
          <ul style={{ margin: 0, paddingLeft: 32, paddingTop: 12 }}>
            {cocktail.lines.map((line) => <li key={line} style={{ fontSize: 16, fontWeight: 400 }}>{line}</li>)}
          </ul>

          <i><p style={{ fontSize: 18, fontWeight: 400, fontFamily: 'Georgia, Sanserif' }}>"{cocktail.description}"</p></i>
          <div className="listTags">{cocktail.lists.map((list) => <span style={{ fontWeight: filters.includes(list) ? 600 : 400 }}>{filters.includes(list) && '✔ '}{list}</span>)}</div>
        </strong>
      </div>
      <hr />
    </>
  )
}