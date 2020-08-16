export default function SortingButton({ selected, setSortBy, label, value }) {
  let rating = '★★★★★'
  let opacity = 1;

  // if (cocktail.rating == 4.0) {
  //   rating = '★★★★'
  //   opacity = 0.5
  // } else if (cocktail.rating == 4.5) {
  //   rating = '★★★★½'
  //   opacity = 0.7
  // } else {
  //   rating = '★★★★★'
  //   opacity = 1
  // }

  return (
    <div className="sortingButton" style={{ fontSize: 14, cursor: 'pointer', padding: 6, border: selected ? '1px solid #005dd6' : '1px solid grey', borderRadius: 6, display: 'inline-block', margin: '16px 6px', backgroundColor: selected ? 'rgb(221 237 255)' : 'white', color: selected ? '#004eb1' : '#333333' }} onClick={() => setSortBy(value)}>
      {label}
    </div>
  )
}