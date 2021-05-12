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

  if (pantry && keywords.length > 1) {
    const cocktailsSortedByKeywordOrder = keywords.reverse().reduce((acc, keyword, index) => {
      // If first iteration of reducer, use cocktailsToDisplay (all results) as default
      let cocktailsToSort
      if (!acc) {
        console.log('start here: ', index)
        console.log('keyword: ', keyword)
        cocktailsToSort = cocktailsToDisplay
      } else {
        console.log('mostly here ', index)
        console.log('keyword: ', keyword)
        cocktailsToSort = acc
      }

      const cocktailsSortedByKeyword = cocktailsToSort.sort((a, b) => {
        if (a.ingredients.includes(keyword.value) && !b.ingredients.includes(keyword.value)) {
          return -1
        }
        if (!a.ingredients.includes(keyword.value) && b.ingredients.includes(keyword.value)) {
          return 1
        }
        return 0
      })
      return cocktailsSortedByKeyword
    }, undefined)

    // const primaryKeyword = keywords[0]
    // const secondaryKeyword = keywords[1]

    // const cocktailsSortedByPrimaryKeyword = cocktailsToDisplay.sort((a, b) => {
    //   if (a.ingredients.includes(primaryKeyword.value) && !b.ingredients.includes(primaryKeyword.value)) {
    //     return -1
    //   }
    //   if (!a.ingredients.includes(primaryKeyword.value) && b.ingredients.includes(primaryKeyword.value)) {
    //     return 1
    //   }
    //   return 0
    // })

    // const cocktailsSortedBySecondaryKeyword = cocktailsSortedByPrimaryKeyword.sort((a, b) => {
    //   if ((a.ingredients.includes(primaryKeyword.value) && a.ingredients.includes(secondaryKeyword.value)) && !(b.ingredients.includes(primaryKeyword.value) && b.ingredients.includes(secondaryKeyword.value))) {
    //     return -1
    //   }

    //   if (!(a.ingredients.includes(primaryKeyword.value) && a.ingredients.includes(secondaryKeyword.value)) && (b.ingredients.includes(primaryKeyword.value) && b.ingredients.includes(secondaryKeyword.value))) {
    //     return 1
    //   }
    //   return 0
    // })
    return (
      cocktailsSortedByKeywordOrder.map((cocktail) => (<Cocktail mapping={mapping} key={cocktail.id} keywords={keywords} cocktail={cocktail} />))
    )
  } else {
    return (
      cocktailsToDisplay.map((cocktail) => (<Cocktail mapping={mapping} key={cocktail.id} keywords={keywords} cocktail={cocktail} />))
    )
  }
}

