import ListButton from '../components/listButton'

export default function Suggestions({ values, filters, setValues, setFilters }) {
  return (
    <div className="listOptions">
      <label className="topLabel">Suggestions</label>
      <ListButton label="Sweet" values={values} setValues={setValues} filters={filters} setFilters={setFilters} />
      <ListButton label="Simple" values={values} setValues={setValues} filters={filters} setFilters={setFilters} />
      <ListButton label="Cheap (potentially)" values={values} setValues={setValues} filters={filters} setFilters={setFilters} />
      <ListButton label="Mad men" values={values} setValues={setValues} filters={filters} setFilters={setFilters} />
      <ListButton label="Tiki time" values={values} setValues={setValues} filters={filters} setFilters={setFilters} />
      <ListButton label="Complicated" values={values} setValues={setValues} filters={filters} setFilters={setFilters} />
      <ListButton label="Herbaceous" values={values} setValues={setValues} filters={filters} setFilters={setFilters} />
      <ListButton label="Smoky" values={values} setValues={setValues} filters={filters} setFilters={setFilters} />
      <ListButton label="Lemon" values={values} setValues={setValues} filters={filters} setFilters={setFilters} />
      <ListButton label="Lime" values={values} setValues={setValues} filters={filters} setFilters={setFilters} />
      <ListButton label="Whiskey, bourbon" values={values} setValues={setValues} filters={filters} setFilters={setFilters} />
    </div>
  )
}