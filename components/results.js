import Cocktail from './cocktail'

export default function Results({ cocktails, keywords, displayMaximum, mapping }) {
  if (cocktails.length === 0) {
    return (<div className="sadCat">🙈</div>);
  }

  let cocktailsToDisplay = cocktails.slice(0, displayMaximum || 901)
  return (
    cocktailsToDisplay.map((cocktail) => (<Cocktail mapping={mapping} key={cocktail.id} keywords={keywords} cocktail={cocktail} />))
  )
}

