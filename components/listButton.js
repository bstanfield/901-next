export default function ListButton({ selected, setLists, lists, label }) {
  return (
    <div className="sortingButton" style={{ fontSize: 14, cursor: 'pointer', padding: 6, border: lists.includes(label) ? '1px solid #005dd6' : '1px solid grey', borderRadius: 6, marginRight: 6, display: 'inline-block', backgroundColor: lists.includes(label) ? 'rgb(221 237 255)' : 'white', color: selected ? '#004eb1' : '#333333' }} onClick={() => {
      if (lists.includes(label)) {
        const newLists = lists.filter(list => list !== label);
        setLists(newLists)
      } else {
        setLists([label, lists].flat())
      }
    }}>
      {label}
    </div>
  )
}