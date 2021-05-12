import Suggestion from './suggestion'

const defaultIngredients = [
  {
    ingredient: 'Gin',
    count: 224,
  },
  {
    ingredient: 'Simple syrup',
    count: 171,
  },
  {
    ingredient: 'Bitters, Angostura',
    count: 106,
  }
]

export default function Suggestions({ props }) {
  const {
    popularIngredients,
    keywords,
    setKeywords,
    pantry,
  } = props
  if (popularIngredients.length > 0) {
    return (
      <div className="listOptions">
        <label className="topLabel">{pantry ? 'Suggested additions' : 'Suggested pairings'}</label>
        {popularIngredients.slice(0, 5).map(
          i => {
            return (<Suggestion key={i.ingredient} value={i.ingredient} label={`${i.ingredient} <span style="opacity: 0.7">(${i.count})</span>`} keywords={keywords} setKeywords={setKeywords} pantry={pantry} />)
          }
        )}
      </div>
    )
  } else {
    return (
      <div className="listOptions">
        <label className="topLabel">{pantry ? 'Suggested additions' : 'Suggested pairings'}</label>
        {defaultIngredients.slice(0, 5).map(
          i => {
            return (<Suggestion key={i.ingredient} value={i.ingredient} label={`${i.ingredient} <span style="opacity: 0.7">(${i.count} results)</span>`} keywords={keywords} setKeywords={setKeywords} pantry={pantry} />)
          }
        )}
      </div>
    )
  }
}