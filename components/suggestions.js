import Suggestion from './suggestion'

export default function Suggestions({ props }) {
  const {
    popularIngredients,
    keywords,
    setKeywords,
  } = props
  if (popularIngredients.length > 0) {
    return (
      <div className="listOptions">
        <label className="topLabel">Suggested pairings</label>
        {popularIngredients.slice(0, 5).map(
          i => <Suggestion key={i.ingredient} value={i.ingredient} label={`${i.ingredient} (${i.count})`} keywords={keywords} setKeywords={setKeywords} />
        )}
      </div>
    )
  } else {
    return null
  }
}