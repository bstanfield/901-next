import { memo, useMemo } from 'react'
import Cocktail from './cocktail'

function Results({ cocktails, keywords, displayMaximum, mapping, pantry, setKeywords }) {
  // Memoize sorted cocktails to prevent re-sorting on every render
  const cocktailsToDisplay = useMemo(() => {
    // No results found
    if (cocktails.length === 0) {
      return [];
    }

    // Take only display maximum depending on scroll position of user
    // Sort cocktails by rating
    const sorted = cocktails.slice(0, displayMaximum || 901).sort((a, b) => {
      if (a.rating > b.rating) return -1
      if (b.rating > a.rating) return 1
      return 0
    })

    // If pantry mode with keywords, sort by primary keyword
    if (pantry && keywords.length >= 1) {
      const primaryKeyword = keywords[0]
      return sorted.sort((a, b) => {
        if (a.ingredients.includes(primaryKeyword.value) && !b.ingredients.includes(primaryKeyword.value)) {
          return -1
        }
        if (!a.ingredients.includes(primaryKeyword.value) && b.ingredients.includes(primaryKeyword.value)) {
          return 1
        }
        return 0
      })
    }

    return sorted
  }, [cocktails, displayMaximum, pantry, keywords])

  // No results found
  if (cocktailsToDisplay.length === 0) {
    return (<div className="sadCat">🙈</div>);
  }

  return (
    <>
      {cocktailsToDisplay.map((cocktail) => (
        <Cocktail 
          mapping={mapping} 
          key={cocktail.id} 
          keywords={keywords} 
          cocktail={cocktail} 
          setKeywords={setKeywords} 
          pantry={pantry} 
        />
      ))}
    </>
  )
}

export default memo(Results)

