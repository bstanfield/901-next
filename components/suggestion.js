import { memo, useCallback, useMemo } from 'react'

function Suggestion({ selected, value, label, keywords, setKeywords, negativeMode, pantry }) {
  // The keywords currently being searched for, to provide suggestions to.
  const keywordValues = useMemo(() => keywords.map(keyword => keyword.value), [keywords])
  
  const isSelected = useMemo(() => 
    keywords.filter(keyword => keyword.value === label).length > 0,
    [keywords, label]
  )

  const handleClick = useCallback(() => {
    const valueToAdd = { 
      value, 
      label: negativeMode ? `-${label}` : value, 
      type: negativeMode ? 'negative' : 'positive', 
      bgColor: negativeMode ? 'red' : 'rgb(221, 237, 255)' 
    }
    const newKeywords = keywords.concat([valueToAdd])
    setKeywords(newKeywords)

    if (!pantry) {
      localStorage.setItem('keywords', JSON.stringify(newKeywords))
    } else {
      localStorage.setItem('pantryKeywords', JSON.stringify(newKeywords))
    }
  }, [value, label, negativeMode, keywords, setKeywords, pantry])

  if (keywordValues.includes(label)) {
    return null
  }

  return (
    <div 
      className="sortingButton" 
      style={{ 
        fontSize: 14, 
        cursor: 'pointer', 
        padding: 6, 
        borderRadius: 6, 
        marginRight: 6, 
        marginBottom: 6, 
        display: 'inline-block', 
        backgroundColor: isSelected ? 'rgb(221 237 255)' : 'white', 
        color: selected ? '#004eb1' : '#333333' 
      }} 
      onClick={handleClick} 
      dangerouslySetInnerHTML={{ __html: label }}
    />
  )
}

export default memo(Suggestion)