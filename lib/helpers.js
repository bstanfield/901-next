import { css } from '@emotion/core';
import facepaint from 'facepaint';

// lazy loads cocktail DOM elements
export const throttleCocktailsToDisplay = (document, setDisplayMaximum) => {
  if (window.scrollY > 4000 && window.scrollY < 10000) {
    setDisplayMaximum(400)
  }
  if (window.scrollY > 10000) {
    setDisplayMaximum(901)
  }
}

export const improvedGetRelevantCocktails = (cocktails, keywords) => {
  if (keywords.length === 0) {
    return cocktails
  }
  const relevantCocktails = cocktails.filter(cocktail => {
    let positiveKeywords = keywords.filter(keyword => keyword.type === 'positive')
    let negativeKeywords = keywords.filter(keyword => keyword.type === 'negative')

    let positiveMatches = 0
    let satisfiesNegativeRequirements = true

    // Only runs if a negative keyword is provided
    if (negativeKeywords.length > 0) {
      // checks all negative keywords, flips satisfiesNegativeRequirements to false if any are found
      negativeKeywords.map(negativeKeyword => {
        const { value } = negativeKeyword
        if (cocktail.name.includes(value) || cocktail.lists.includes(value)) {
          satisfiesNegativeRequirements = false
        } else {
          if (cocktail.ingredients.map(ingredient => { if (ingredient.includes(value)) { return true } else { return false } }).includes(true)) {
            satisfiesNegativeRequirements = false
          }
        }
      })
    }

    // Cocktail is filtered immediately
    if (!satisfiesNegativeRequirements) {
      return false
    }

    // Regular keyword logic goes here
    positiveKeywords.map(positiveKeyword => {
      const { value } = positiveKeyword
      if (cocktail.name.includes(value) || cocktail.lists.includes(value)) {
        positiveMatches++
      } else {
        if (cocktail.ingredients.map(ingredient => { if (ingredient.includes(value)) { return true } else { return false } }).includes(true)) {
          positiveMatches++
        }
      }
    })

    // Cocktail is selected if all positive matches are made
    if (positiveMatches === positiveKeywords.length) {
      return true
    }

    return false
  })
  return relevantCocktails
}

export const getPopularIngredients = (cocktails, keywords) => {
  const keywordValues = keywords.map(k => k.value)
  const ingredientsMapping = {};
  cocktails.map(cocktail => {
    cocktail.ingredients.map(ingredient => {
      if (keywordValues.includes(ingredient)) {
        return
      } else if (!ingredientsMapping[ingredient]) {
        ingredientsMapping[ingredient] = 1
      } else {
        ingredientsMapping[ingredient]++
      }
    })
  })
  const entries = Object.entries(ingredientsMapping).map(entry => ({ ingredient: entry[0], count: entry[1] }))
  return entries.sort((a, b) => {
    if (a.count > b.count) {
      return -1
    } else if (a.count < b.count) {
      return 1
    } else {
      return 0
    }
  })
}

export const getRelevantCocktails = (cocktails, searchFilters) => {
  if (searchFilters.length === 0) {
    return cocktails
  }
  const relevantCocktails = cocktails.filter(cocktail => {
    let count = 0
    let filterCount = searchFilters.length
    searchFilters.map(filter => {
      if (cocktail.name.includes(filter) || cocktail.lists.includes(filter)) {
        count++
      } else {
        if (cocktail.ingredients.map(ingredient => { if (ingredient.includes(filter)) { return true } else { return false } }).includes(true)) {
          count++
        }
      }
    })
    if (filterCount === count) {
      return true
    }
    return false
  })
  return relevantCocktails
}

export const getCocktailById = (cocktails, id) => {
  let match = []
  for (const cocktail in cocktails) {
    if (cocktails[cocktail].id === id) {
      match = cocktails[cocktail]
    }
  }
  return match
}

export function getSimilarCocktails(cocktails, seedIngredients, seedId) {
  const cocktailsWithSimilarityScores = cocktails.map(cocktail => {
    let similarityScore = 0
    let weight = 10
    for (const ingredient in seedIngredients) {
      if (cocktail.ingredients.includes(seedIngredients[ingredient])) {
        similarityScore = similarityScore + weight
      }
      weight = weight * .90
    }
    return {
      ...cocktail,
      ...{ similarity: similarityScore }
    }
  })
  const sortedCocktails = cocktailsWithSimilarityScores.sort((a, b) => {
    if (a.similarity < b.similarity) {
      return 1;
    } else if (a.similarity > b.similarity) {
      return -1;
    } else {
      return 0;
    }
  })
  return sortedCocktails.filter(cocktail => cocktail.id !== seedId)
}

export const createSentence = (keywords) => {
  let str = ''
  const positiveKeywords = keywords.filter(kw => kw.type === 'positive')
  const negativeKeywords = keywords.filter(kw => kw.type === 'negative')

  // Start sentence with positives...
  for (const pkw in positiveKeywords) {
    if (pkw == 0) {
      str = str + '<span style="opacity: .6">for </span>' + positiveKeywords[pkw].value
    } else {
      str = str + '<span style="opacity: .6"> & </span>' + positiveKeywords[pkw].value
    }
  }

  // End sentence with negatives...
  for (const nkw in negativeKeywords) {
    if (nkw == 0 && positiveKeywords.length == 0) {
      str = str + '<span style="opacity: .6"> with no </span>' + negativeKeywords[nkw].value
    } else if (nkw == 0) {
      str = str + '<span style="opacity: .6"> but no </span>' + negativeKeywords[nkw].value
    } else {
      str = str + '<span style="opacity: .6"> or </span>' + negativeKeywords[nkw].value
    }
  }
  return str
}

// Media queries and Emotion CSS
export const mq = facepaint([
  '@media(min-width: 420px)',
  '@media(min-width: 720px)',
  '@media(min-width: 1000px)',
  '@media(min-width: 1500px)',
]);

export const scale = (x) => css(mq(x));