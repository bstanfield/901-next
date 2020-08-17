export const sortCocktails = (cocktails, sortingRule) => {
  if (sortingRule.toLowerCase() === 'alphabetical') {
    const sortedCocktails = cocktails.sort((a, b) => {
      if (a.name < b.name) { return -1 }
      if (a.name > b.name) { return 1 }
      return 0
    })
    return sortedCocktails
  } else if (sortingRule.toLowerCase() === 'highest_rated') {
    const sortedCocktails = cocktails.sort((a, b) => {
      if (a.rating > b.rating) { return - 1 }
      if (a.rating < b.rating) { return 1 }
      return 0
    })
    return sortedCocktails
  }
}

export const watchScroll = (document, setDisplayMaximum) => {
  document.addEventListener('scroll', () => {
    if (window.scrollY > 4000 && window.scrollY < 10000) {
      setDisplayMaximum(400)
    }
    if (window.scrollY > 10000) {
      setDisplayMaximum(901)
    }
  });
}

export const getRelevantCocktails = (cocktails, filters) => {
  const relevantCocktails = cocktails.filter(cocktail => {
    let count = 0
    let filterCount = filters.length
    for (const filter in filters) {
      if (cocktail.ingredients.includes(filters[filter]) || cocktail.name.includes(filters[filter]) || cocktail.lists.includes(filters[filter])) {
        count++
      }
    }
    if (filterCount === count) {
      return true
    }
    return false
  })
  return relevantCocktails
}

export const getRelevantCocktailsByList = (cocktails, list) => {
  console.log('cocktails: ', cocktails)
  const relevantCocktails = cocktails.filter(cocktail => {
    if (cocktail.lists.includes(list)) {
      return true
    }
    return false
  })
  return relevantCocktails
}