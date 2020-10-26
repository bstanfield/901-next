import Cocktail from './cocktail'

export default function Results({ cocktails, keywords, displayMaximum }) {
  if (cocktails.length === 0) {
    return (<div className="sadCat">🙈</div>);
  }

  let cocktailsToDisplay = cocktails.slice(0, displayMaximum || 901)
  return (
    cocktailsToDisplay.map((cocktail) => (<Cocktail key={cocktail.id} keywords={keywords} cocktail={cocktail} />))
  )
}

