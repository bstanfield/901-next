export default function Cocktail({ cocktail, filters, index }) {
  let rating
  if (cocktail.rating == 4.0) {
    rating = <><span className="star">★</span><span className="star">★</span><span className="star">★</span><span className="star">★</span><span className="star fadedStar">★</span></>
  } else if (cocktail.rating == 4.5) {
    rating = <><span className="star">★</span><span className="star">★</span><span className="star">★</span><span className="star">★</span><span className="star">★<span className="halfStar"></span></span></>
  } else {
    rating = <><span className="star">★</span><span className="star">★</span><span className="star">★</span><span className="star">★</span><span className="star">★</span></>
  }

  return (
    <>
      <div key={cocktail.name} style={{ paddingLeft: 16, paddingTop: 16, paddingBottom: 8, paddingRight: 16, position: 'relative' }}>
        {/* <div style={{ position: 'absolute', top: 6, right: 12 }}>{getGlassTypeEmoji(cocktail)}</div> */}
        <strong>
          <p className="cocktailName">{cocktail.name}</p>
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