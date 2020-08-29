import Cocktail from './cocktail'

export default function Results({ cocktails, filters, displayMaximum }) {
  if (cocktails.length === 0) {
    return (<div className="sadCat">🙈</div>);
  }

  let cocktailsToDisplay = cocktails.slice(0, displayMaximum || 901)
  return (
    cocktailsToDisplay.map((cocktail) => (<Cocktail key={cocktail.id} filters={filters} cocktail={cocktail} />))
  )
}

