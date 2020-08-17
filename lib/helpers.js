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

export const getRelevantCocktails = (cocktails, searchFilters, list, sortingRule) => {
  const searchFiltersMatches = getCocktailsBySearch(cocktails, searchFilters)
  const listAndSearchFiltersMatches = getCocktailsByList(searchFiltersMatches, list)
  const allMatchesSorted = sortCocktails(listAndSearchFiltersMatches, sortingRule)
  return allMatchesSorted
}

const sortCocktails = (cocktails, sortingRule) => {
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

const getCocktailsBySearch = (cocktails, searchFilters) => {
  if (searchFilters.length === 0) {
    return cocktails
  }
  const relevantCocktails = cocktails.filter(cocktail => {
    let count = 0
    let filterCount = searchFilters.length
    for (const filter in searchFilters) {
      if (cocktail.ingredients.includes(searchFilters[filter]) || cocktail.name.includes(searchFilters[filter])) {
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

const getCocktailsByList = (cocktails, list) => {
  if (!list) {
    return cocktails
  }
  const relevantCocktails = cocktails.filter(cocktail => {
    if (cocktail.lists.includes(list)) {
      return true
    }
    return false
  })
  return relevantCocktails
}