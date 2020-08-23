export default function Filter({ selected, setValues, setFilters, filters, values, label }) {
  if (values.filter(value => value.label === label).length > 0) {
    return (null)
  }
  return (
    <div className="sortingButton" style={{ fontSize: 14, cursor: 'pointer', padding: 6, borderRadius: 6, marginRight: 6, marginBottom: 6, display: 'inline-block', backgroundColor: values.filter(value => value.label === label).length > 0 ? 'rgb(221 237 255)' : 'white', color: selected ? '#004eb1' : '#333333' }} onClick={() => {
      if (!values.filter(value => value.label === label).length > 0) {
        // I'm feeling lucky...
        if (label.includes('🎲')) {
          // Get random
          const valueToAdd = { value: 'Old Fashioned', label: 'Old Fashioned', color: '#00B8D9', isFixed: true }
          setValues([valueToAdd])
          setFilters(['Old Fashioned'])
          localStorage.setItem('filters', JSON.stringify(['Old Fashioned']))
          return
        }
        const valueToAdd = { value: label, label, color: '#00B8D9', isFixed: true }
        values.push(valueToAdd)
        setValues([values].flat())
        filters.push(label)
        setFilters([filters].flat())
        localStorage.setItem('filters', JSON.stringify([filters].flat()));
      }
    }}>
      {label}
    </div>
  )
}