import { memo } from 'react'
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

function Suggestions({ props }) {
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
          i => (
            <Suggestion 
              key={i.ingredient} 
              value={i.ingredient} 
              label={`${i.ingredient} <span style="opacity: 0.7">(${i.count})</span>`} 
              keywords={keywords} 
              setKeywords={setKeywords} 
              pantry={pantry} 
            />
          )
        )}
      </div>
    )
  }
  
  return (
    <div className="listOptions">
      <label className="topLabel">Suggested ingredients</label>
      {defaultIngredients.map(
        i => (
          <Suggestion 
            key={i.ingredient} 
            value={i.ingredient} 
            label={`${i.ingredient} <span style="opacity: 0.7">(${i.count})</span>`} 
            keywords={keywords} 
            setKeywords={setKeywords} 
            pantry={pantry} 
          />
        )
      )}
    </div>
  )
}

export default memo(Suggestions)