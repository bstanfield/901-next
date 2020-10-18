import Select, { createFilter } from 'react-select';
import { formatGroupLabel } from '../lib/search';
import { useState } from 'react';

export default function Search({ data, values, setFilters, setValues, negativeFilters, setNegativeFilters }) {
  const [input, setInput] = useState('');
  const [negativeMode, setNegativeMode] = useState(false);

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

  const filterConfig = {
    ignoreAccents: true,
    ignoreCase: true,
    trim: true,
  }

  return (<Select
    isMulti
    autoFocus
    filterOption={createFilter(filterConfig)}
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
          border: '1px solid grey',
          fontSize: 18,
          fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
          fontWeight: 300,
          color: '#333333 !important',
          opacity: 1,
          webkitBoxShadow: '-1px 4px 14px -6px rgba(148,148,148,0.5)',
          boxShadow: '-1px 4px 14px -6px rgba(148,148,148,0.5)',
          '&:hover': {
            border: '1px solid blue !important'
          },
        }),
        multiValue: (styles, { data }) => ({
          ...styles,
          fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
          backgroundColor: data.color || 'rgb(221, 237, 255)',
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
    inputValue={input}
    onInputChange={input => {
      setInput(input);
      if (input === '-') {
        // if you input a minus sign before searching that will substract from your query
        setInput('');
        setNegativeMode(true);
      }
    }}
    onChange={vals => {
      console.log('vals: ', vals)
      // wipes localstorage and currently displayed filters
      if (vals === null) {
        setFilters([])
        setNegativeFilters([])
        localStorage.setItem('filters', JSON.stringify([]))
        localStorage.setItem('negativeFilters', JSON.stringify([]))
        setValues([])
        return
      }

      // hard coded rn
      // create object in state w/ all negative values
      if (negativeMode) {
        const newNegativeFilter = vals.slice(-1)[0].value
        const allNegativeFilters = negativeFilters.concat(newNegativeFilter)
        const positiveValues = vals.filter(val => !allNegativeFilters.includes(val.value))

        const negativeValues = negativeFilters.concat({value: newNegativeFilter, label: `-${newNegativeFilter}`, isFixed: true, color: '#ff000045' })
        console.log('negative values: ', negativeValues)
        setNegativeFilters(allNegativeFilters)
        setNegativeMode(false)

        setValues(positiveValues.concat(negativeValues))
        localStorage.setItem('negativeFilters', JSON.stringify(allNegativeFilters))
        return
      }
    
      // TODO: even outside of negative mode, deleting a negative filter needs to trigger search function
      const filters = vals.map(val => val.value);
      setFilters(filters)
      localStorage.setItem('filters', JSON.stringify(filters))
      setValues(vals)
      setNegativeMode(false)
    }}
  />)
}
