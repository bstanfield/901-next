export default function PopularIngredientsBox({ props }) {
  const {
    popularIngredients,
    setPopularIngredients,
    cocktailsToDisplay,
    keywords,
    showPopularIngredients,
    setShowPopularIngredients,
    getPopularIngredients
  } = props

  return (
    <div className="callout" onClick={() => {
      // Only start calculating popular ingredients after this has been clicked into
      setPopularIngredients(
        getPopularIngredients(cocktailsToDisplay, keywords)
      )
      setShowPopularIngredients(showPopularIngredients ? false : true)
    }
    }>
      <p>ⓘ &nbsp; Best remaining ingredient combinations</p>

      {showPopularIngredients &&
        <ul>
          {popularIngredients.slice(0, 5).map(i => <li>{i.ingredient} <span style={{ opacity: 0.5 }}>({i.count})</span></li>)}
        </ul>
      }
    </div>
  )
}