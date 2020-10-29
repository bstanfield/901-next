export default function Filter({ selected, label, cocktails, keywords, setKeywords, negativeMode }) {
  const keywordValues = keywords.map(keyword => keyword.value)
  if (keywordValues.includes(label)) {
    return null
  }

  return (
    <div className="sortingButton" style={{ fontSize: 14, cursor: 'pointer', padding: 6, borderRadius: 6, marginRight: 6, marginBottom: 6, display: 'inline-block', backgroundColor: keywords.filter(keyword => keyword.value === label).length > 0 ? 'rgb(221 237 255)' : 'white', color: selected ? '#004eb1' : '#333333' }} onClick={() => {
      // I'm feeling lucky...
      if (label.includes('🎲')) {
        const cocktail = cocktails[Math.floor(Math.random() * cocktails.length)];
        const valueToAdd = { value: cocktail.name, label: negativeMode ? `-${cocktail.name}` : cocktail.name, type: negativeMode ? 'negative' : 'positive', bgColor: negativeMode ? 'red' : 'rgb(221, 237, 255)' }
        setKeywords([valueToAdd])
        localStorage.setItem('keywords', JSON.stringify([valueToAdd]))
        return
      }
      const valueToAdd = { value: label, label: negativeMode ? `-${label}` : label, type: negativeMode ? 'negative' : 'positive', bgColor: negativeMode ? 'red' : 'rgb(221, 237, 255)' }
      setKeywords(keywords.concat([valueToAdd]))
      localStorage.setItem('keywords', JSON.stringify(keywords.concat([valueToAdd])));
    }}>
      {label}
    </div>
  )
}