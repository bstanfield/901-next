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

  const description = cocktail.description
  // const glassIs = (text) => description.includes(text)
  // let glass
  // if (glassIs('cocktail glass')) {
  //   glass = 'cocktail glass 🍸'
  // } else if (glassIs('rocks glass')) {
  //   glass = 'rocks glass 🥃'
  // } else if (glassIs('martini glass')) {
  //   glass = 'martini glass 🍸'
  // } else if (glassIs('wine glass')) {
  //   glass = 'wine glass 🍷'
  // } else if (glassIs('champagne')) {
  //   glass = 'champange flute 🥂'
  // } else if (glassIs('beer')) {
  //   glass = 'beer stein 🍺'
  // } else if (glassIs('highball')) {
  //   glass = 'highball glass 🥛'
  // } else if (glassIs('tiki')) {
  //   glass = 'tiki mug 🗿'
  // }

  return (
    <>
      <div key={cocktail.name} className="cocktailContainer">
        <strong>
          <Link href="/[cocktail]" as={`/${cocktail.id}`}><a rel="noopener" href={`/${cocktail.id}`} className="noStyleLink"><span className="cocktailName">{cocktail.name}</span></a></Link>
          <div style={{ width: 140, position: 'relative' }}>
            {rating}
          </div>
          <ul style={{ margin: 0, paddingLeft: 32, paddingTop: 12 }}>
            {cocktail.lines.map((line) => <li key={line} style={{ fontSize: 18, fontWeight: 400 }}>{line}</li>)}
          </ul>
          <i><p className="description" style={{ fontSize: 18, fontWeight: 400 }}>"{description}"</p></i>
          <div className="listTags">{cocktail.lists.map((list) => <span style={{ fontWeight: filters.includes(list) ? 600 : 400 }}>{filters.includes(list) && '✔ '}{list}</span>)}</div>
        </strong>
      </div>
      <hr />
    </>
  )
}