import Cocktail from './cocktail'

export default function Results({ cocktails, keywords, displayMaximum, mapping, pantry }) {
  // Not using mapping right now -- use for advanced sorting
  // No results found
  if (cocktails.length === 0) {
    return (<div className="sadCat">🙈</div>);
  }

  // Take only display maximum depending on scroll position of user
  // Sort cocktails by rating
  const cocktailsToDisplay = cocktails.slice(0, displayMaximum || 901).sort((a, b) => {
    if (a.rating > b.rating) {
      return -1
    }
    if (b.rating > a.rating) {
      return 1
    }
    return 0
  })

  if (pantry && keywords.length >= 1) {
    const primaryKeyword = keywords[0]
    const cocktailsSortedByPrimaryKeyword = cocktailsToDisplay.sort((a, b) => {
      if (a.ingredients.includes(primaryKeyword.value) && !b.ingredients.includes(primaryKeyword.value)) {
        return -1
      }
      if (!a.ingredients.includes(primaryKeyword.value) && b.ingredients.includes(primaryKeyword.value)) {
        return 1
      }
      return 0
    })
    return (
      cocktailsSortedByPrimaryKeyword.map((cocktail) => (<Cocktail mapping={mapping} key={cocktail.id} keywords={keywords} cocktail={cocktail} />))
    )
  } else {
    return (
      cocktailsToDisplay.map((cocktail) => (<Cocktail mapping={mapping} key={cocktail.id} keywords={keywords} cocktail={cocktail} />))
    )
  }
}

