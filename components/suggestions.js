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
  } = props
  if (popularIngredients.length > 0) {
    return (
      <div className="listOptions">
        <label className="topLabel">Suggested pairings</label>
        {popularIngredients.slice(0, 5).map(
          i => {
            return (<Suggestion key={i.ingredient} value={i.ingredient} label={`${i.ingredient} (${i.count})`} keywords={keywords} setKeywords={setKeywords} />)
          }
        )}
      </div>
    )
  } else {
    return (
      <div className="listOptions">
        <label className="topLabel">Suggested ingredients</label>
        {defaultIngredients.slice(0, 5).map(
          i => {
            return (<Suggestion key={i.ingredient} value={i.ingredient} label={`${i.ingredient} (${i.count})`} keywords={keywords} setKeywords={setKeywords} />)
          }
        )}
      </div>
    )
  }
}