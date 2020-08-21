import Select from 'react-select';
import { formatGroupLabel } from '../lib/search'

export default function SearchBar({ data, values, setFilters, setValues }) {

  const ingredientsInSearchFormat = data.ingredients.map(ingredient => ({ value: ingredient, label: ingredient, isFixed: true }))
  const cocktailNamesInSearchFormat = data.cocktails.map(cocktail => ({ value: cocktail.name, label: cocktail.name, isFixed: true }))
  const listsInSearchFormat = data.categories.map(category => category.lists).flat().map(list => ({ value: list, label: list, isFixed: true }))

  const groupedOptions = [
    {
      label: 'Ingredients',
      options: ingredientsInSearchFormat,
    },
    {
      label: 'Categories',
      options: listsInSearchFormat,
    },
    {
      label: 'Cocktails',
      options: cocktailNamesInSearchFormat,
    }
  ];

  return (<Select
    isMulti
    autoFocus
    styles={
      {
        placeholder: (styles) => ({
          ...styles,
          fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif !important',
          fontWeight: 400,
          opacity: 0.8,
        }),
        option: (styles) => ({
          ...styles,
          cursor: 'pointer',
          fontSize: 18,
          fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
        }),
        control: (styles) => ({
          ...styles,
          cursor: 'pointer',
          border: '1px solid #333333',
          fontSize: 18,
          fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
          fontWeight: 300,
          color: '#333333 !important',
          opacity: 1,
        }),
        multiValue: (styles) => ({
          ...styles,
          fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
          backgroundColor: 'rgb(221, 237, 255)',
          border: '1px solid rgb(0, 93, 214)',
          fontWeight: 400
        })
      }
    }
    name="search-bar"
    options={groupedOptions}
    className="basic-multi-select"
    classNamePrefix="select"
    value={values}
    formatGroupLabel={formatGroupLabel}
    placeholder='Search for "sweet" or "bourbon"'
    onChange={vals => {
      if (vals === null) {
        setFilters([])
        localStorage.setItem('filters', JSON.stringify([]));
        setValues([])
        return
      }
      const filters = vals.map(val => val.value)
      setFilters(filters)
      localStorage.setItem('filters', JSON.stringify(filters));
      setValues(vals)
    }}
  />)
}
