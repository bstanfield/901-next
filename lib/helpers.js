import { css } from '@emotion/core';
import facepaint from 'facepaint';

// lazy loads cocktail DOM elements
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

export const getRelevantCocktails = (cocktails, searchFilters) => {
  if (searchFilters.length === 0) {
    return cocktails
  }
  const relevantCocktails = cocktails.filter(cocktail => {
    let count = 0
    let filterCount = searchFilters.length
    for (const filter of searchFilters) {
      if (cocktail.name.includes(filter) || cocktail.lists.includes(filter)) {
        count++
      } else {
        cocktail.ingredients.map(ingredient => { if (ingredient.includes(filter)) { count++ } });
      }
    }
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

export function getSimilarCocktails(cocktails, seedIngredients) {
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
  return sortedCocktails


  //seed
  // const createPair = (acc, value) => {
  //   const newPairs = seedIngredients.map(i => {
  //     if (i === value) {
  //       return null
  //     }
  //     return [i, value]
  //   })
  //   acc.push(newPairs)
  //   return acc
  // }
  // const pairs = seedIngredients.reduce(createPair, []).flat().filter(pair => pair !== null)
  // const seedStringPairs = pairs.map(pairing => pairing.join(';'))

  // // all
  // const allPairings = cocktails.map(cocktail => {
  //   let ingredients = cocktail.ingredients
  //   let pairings = []
  //   let remainingIngredients = ingredients
  //   for (const ingredient in ingredients) {
  //     remainingIngredients.map(i => { if (i === ingredients[ingredient]) { } else { pairings.push([i, ingredients[ingredient]]) } })
  //     remainingIngredients.splice(ingredient, 1);
  //   }
  //   return pairings
  // }).flat()

  // const stringPairs = allPairings.map(pairing => pairing.join(';'))
  // const unique = [...new Set(stringPairs)];

  // console.log('seedStringPairs: ', seedStringPairs)
  // console.log('unique: ', unique)
}

export const createSentence = (filters) => {
  let str = ''
  for (const filter in filters) {
    if (filter == 0) {
      str = str + '<span style="opacity: .6">for </span>' + filters[filter]
    } else {
      str = str + '<span style="opacity: .6"> & </span>' + filters[filter]
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