import ListButton from './filter'

const suggestions = [
  'Five-star cocktails',
  'Sweet',
  'Simple',
  'Cheap (potentially)',
]

export default function Suggestions({ props }) {
  const {
    popularIngredients,
    setPopularIngredients,
    cocktailsToDisplay,
    keywords,
    setKeywords,
    showPopularIngredients,
    setShowPopularIngredients,
    getPopularIngredients
  } = props
  if (popularIngredients) {
    return (
      <div className="listOptions">
        <label className="topLabel">Suggestions</label>
        {popularIngredients.slice(0, 5).map(
          i => <ListButton key={i.ingredient} value={i.ingredient} label={`${i.ingredient} (${i.count})`} keywords={keywords} setKeywords={setKeywords} />
        )}
      </div>
    )
  } else {
    return null
  }
}