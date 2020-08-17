export default function ListButton({ selected, setValues, setFilters, filters, values, label }) {
  if (values.filter(value => value.label === label).length > 0) {
    return (null)
  }
  return (
    <div className="sortingButton" style={{ fontSize: 14, cursor: 'pointer', padding: 6, border: values.filter(value => value.label === label).length > 0 ? '1px solid #005dd6' : '1px solid grey', borderRadius: 6, marginRight: 6, marginBottom: 6, display: 'inline-block', backgroundColor: values.filter(value => value.label === label).length > 0 ? 'rgb(221 237 255)' : 'white', color: selected ? '#004eb1' : '#333333' }} onClick={() => {
      if (values.filter(value => value.label === label).length > 0) {
        // const newValues = values.filter(value => value.label !== label)
        // setValues([newValues].flat())
        // const newFilters = filters.filter(filter => filter !== label)
        // setFilters([newFilters].flat())
      } else {
        const valueToAdd = { value: label, label, color: '#00B8D9', isFixed: true }
        values.push(valueToAdd)
        setValues([values].flat())
        filters.push(label)
        setFilters([filters].flat())
      }
    }}>
      {label}
    </div>
  )
}