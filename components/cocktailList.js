import Cocktail from './cocktail'

export default function CocktailList({ cocktails, filters, displayMaximum }) {
  if (cocktails == []) {
    return (null);
  }

  let cocktailsToDisplay = cocktails.slice(0, displayMaximum || 901)

  return (
    cocktailsToDisplay.map((cocktail) => (<Cocktail filters={filters} cocktail={cocktail} />))
  )
}

