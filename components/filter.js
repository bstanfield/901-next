export default function Filter({ selected, value, label, keywords, setKeywords, negativeMode }) {
  const keywordValues = keywords.map(keyword => keyword.value)
  if (keywordValues.includes(label)) {
    return null
  }

  return (
    <div className="sortingButton" style={{ fontSize: 14, cursor: 'pointer', padding: 6, borderRadius: 6, marginRight: 6, marginBottom: 6, display: 'inline-block', backgroundColor: keywords.filter(keyword => keyword.value === label).length > 0 ? 'rgb(221 237 255)' : 'white', color: selected ? '#004eb1' : '#333333' }} onClick={() => {
      // I'm feeling lucky...
      const valueToAdd = { value, label: negativeMode ? `-${label}` : value, type: negativeMode ? 'negative' : 'positive', bgColor: negativeMode ? 'red' : 'rgb(221, 237, 255)' }
      setKeywords(keywords.concat([valueToAdd]))
      localStorage.setItem('keywords', JSON.stringify(keywords.concat([valueToAdd])));
    }}>
      {label}
    </div>
  )
}