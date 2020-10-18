import Select, { createFilter } from 'react-select';
import { formatGroupLabel } from '../lib/search'
import { useState, useEffect } from 'react'

const loadData = (data, negativeMode) => {
  const ingredientsInSearchFormat = data.ingredients.map(ingredient => ({ value: ingredient, label: negativeMode ? `-${ingredient}` : ingredient, type: negativeMode ? 'negative' : 'positive', bgColor: negativeMode ? '#ffbdbd' : 'rgb(221, 237, 255)' }))
  const cocktailNamesInSearchFormat = data.cocktails.map(cocktail => ({ value: cocktail.name, label: negativeMode ? `-${cocktail.name}` : cocktail.name, type: negativeMode ? 'negative' : 'positive', bgColor: negativeMode ? '#ffbdbd' : 'rgb(221, 237, 255)' }))
  const listsInSearchFormat = data.categories.map(category => category.lists).flat().map(list => ({ value: list, label: negativeMode ? `-${list}` : list, type: negativeMode ? 'negative' : 'positive', bgColor: negativeMode ? '#ffbdbd' : 'rgb(221, 237, 255)' }))
  return {
    ingredients: ingredientsInSearchFormat,
    cocktails: cocktailNamesInSearchFormat,
    lists: listsInSearchFormat,
  }
}

export default function Search({ data, values, keywords, negativeMode, setFilters, setValues, setKeywords, setNegativeMode }) {
  const [loadedData, setLoadedData] = useState({}) 
  
  // Reloads data with negative or positive param
  useEffect(() => {
    setLoadedData(loadData(data, negativeMode))
  }, [negativeMode])

  const groupedOptions = [
    {
      label: 'Ingredients',
      options: loadedData.ingredients,
    },
    {
      label: 'Categories',
      options: loadedData.lists,
    },
    {
      label: 'Cocktails',
      options: loadedData.cocktails,
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
          border: negativeMode ? '1px solid red' : '1px solid grey',
          fontSize: 18,
          fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
          fontWeight: 300,
          color: '#333333 !important',
          opacity: 1,
          backgroundColor: negativeMode ? '#ef404017' : 'white',
          webkitBoxShadow: '-1px 4px 14px -6px rgba(148,148,148,0.5)',
          boxShadow: '-1px 4px 14px -6px rgba(148,148,148,0.5)',
          '&:hover': {
            border: negativeMode ? '1px solid red !important' : '1px solid blue !important'
          },
        }),
        multiValue: (styles, { data }) => ({
          ...styles,
          fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
          backgroundColor: data.bgColor || 'rgb(221, 237, 255)',
          border: '1px solid rgb(0, 93, 214)',
          fontWeight: 400
        })
      }
    }
    name="search-bar"
    options={groupedOptions}
    className="basic-multi-select"
    classNamePrefix="select"
    value={keywords}
    formatGroupLabel={formatGroupLabel}
    placeholder='Search for "sweet" or "bourbon"'
    // Checks for someone entering or exiting negative mode
    onInputChange={input => {
      if (input === '') {
        setNegativeMode(false)
      }
      if (input === '-') {
        setNegativeMode(true)
      }
    }}
    onChange={vals => {
      if (vals === null) {
        setKeywords([])
        // localStorage.setItem('filters', JSON.stringify([]));
        return
      }
      setKeywords(vals)
      // localStorage.setItem('filters', JSON.stringify(filters));
    }}
  />)
}
