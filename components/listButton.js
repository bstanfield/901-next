export default function ListButton({ selected, setList, label, value }) {
  return (
    <div className="sortingButton" style={{ fontSize: 14, cursor: 'pointer', padding: 6, border: selected ? '1px solid #005dd6' : '1px solid grey', borderRadius: 6, display: 'inline-block', backgroundColor: selected ? 'rgb(221 237 255)' : 'white', color: selected ? '#004eb1' : '#333333' }} onClick={() => setList(value)}>
      {label}
    </div>
  )
}