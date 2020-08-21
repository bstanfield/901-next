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
  'Singapore',
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
  'Red',
  'Blue',
]

const tenRandomSuggestions = suggestions.sort(() => Math.random() - 0.5).slice(0, 12)

export default function Suggestions({ values, filters, setValues, setFilters }) {
  return (
    <div className="listOptions">
      <label className="topLabel">Suggestions</label>
      {tenRandomSuggestions.map(
        suggestion => <ListButton label={suggestion} values={values} setValues={setValues} filters={filters} setFilters={setFilters} />
      )}
    </div>
  )
}