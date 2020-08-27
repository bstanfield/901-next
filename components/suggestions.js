import ListButton from './filter'

const suggestions = [
  'Sweet',
  'Simple',
  'Cheap (potentially)',
  'Mad men',
  'Tiki time',
  'Complicated',
  'Herbaceous',
  'Smoky',
  'Lemon',
  'Lime',
  'Whiskey, bourbon',
  'Prohibition era and vintage',
  'Negroni-inspired',
  'Port',
  'Coffee',
  'Halloween',
  'Southern',
  'Gentle',
  'San Francisco',
  'Minty',
  'Dry',
  'Fruity',
  'Bitter',
  'Creamy',
  'Spicy',
  'Meringue-y',
  'Veggie',
  'Tart',
  'The 16 Greatest Cocktails in Creation',
  'Five-star cocktails',
  'Beer',
]

const randomSuggestions = suggestions.sort(() => Math.random() - 0.5).slice(0, 6)

export default function Suggestions({ values, filters, setValues, setFilters, cocktails }) {
  return (
    <div className="listOptions">
      <label className="topLabel">Suggestions</label>
      <ListButton label="&nbsp;I'm feeling lucky 🎲&nbsp;" values={values} setValues={setValues} filters={filters} setFilters={setFilters} cocktails={cocktails} />
      {randomSuggestions.map(
        suggestion => <ListButton key={suggestion} label={suggestion} values={values} setValues={setValues} filters={filters} setFilters={setFilters} />
      )}
    </div>
  )
}