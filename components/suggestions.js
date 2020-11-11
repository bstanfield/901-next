import ListButton from './filter'

const suggestions = [
  'Five-star cocktails',
  'Sweet',
  'Simple',
  'Cheap (potentially)',
]

export default function Suggestions({ cocktails, keywords, setKeywords, negativeMode }) {
  return (
    <div className="listOptions">
      <label className="topLabel">Suggestions</label>
      <ListButton label="&nbsp;I'm feeling lucky 🎲&nbsp;&nbsp;" keywords={keywords} setKeywords={setKeywords} cocktails={cocktails} />
      {suggestions.map(
        suggestion => <ListButton key={suggestion} label={suggestion} keywords={keywords} setKeywords={setKeywords} negativeMode={negativeMode} />
      )}
    </div>
  )
}