import Select, { createFilter } from 'react-select';
import { formatGroupLabel } from '../lib/search'
import { useState, useEffect } from 'react'

const loadData = (data, negativeMode) => {
  const ingredientsInSearchFormat = data.ingredients.map(i => ({ weight: i.weight, value: i.ingredient, label: negativeMode ? `-${i.ingredient}` : `${i.ingredient}`, type: negativeMode ? 'negative' : 'positive', bgColor: negativeMode ? '#ffbdbd' : 'rgb(221, 237, 255)' }))
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
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [groupedOptions, setGroupedOptions] = useState([])

  // Reloads data with negative or positive param
  useEffect(() => {
    setLoadedData(loadData(data, negativeMode))
  }, [negativeMode])

  useEffect(() => {
    setGroupedOptions([
      {
        label: 'Ingredients (Most common)',
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
    ])
  }, [loadedData])

  const filterConfig = {
    ignoreAccents: true,
    ignoreCase: true,
    trim: true,
  }

  const filterAndIgnoreExistingMatches = (input, items, existingMatches, filterType = 0) => {
    const filterTypes = ['precise', 'exact', 'partial-match']
    // input = user input
    // items = ingredients, lists, or cocktails
    // existingMatches = [value1, value2]
    const matches = items.filter(item => {
      if (existingMatches.includes(item.value)) {
        return false
      } else {
        if (filterTypes[filterType] === 'precise') {
          return item.value.toLowerCase() === input
        }

        else if (filterTypes[filterType] === 'exact') {
          // looks for exact matches at same slice length, not whiskey = whiskey but whiskey = whiskey, bourbon (-bourbon)
          return item.value.toLowerCase().slice(0, input.length) === input
        }

        else if (filterTypes[filterType] === 'partial-match') {
          return item.value.toLowerCase().includes(input)
        }
      }
    })
    matches.map(match => existingMatches.push(match.value))
    return matches.sort((a, b) => a.value.length - b.value.length)
  }

  const filterOptions = (rawInput) => {
    const input = rawInput.toLowerCase().trim()

    let { ingredients, lists, cocktails } = loadedData
    let existingMatches = []

    // Precise matches = priority #0
    const p0_ingredients = filterAndIgnoreExistingMatches(input, ingredients, existingMatches)

    // Direct matches = priority #1
    const p1_ingredients = filterAndIgnoreExistingMatches(input, ingredients, existingMatches, 1)
    const p1_lists = filterAndIgnoreExistingMatches(input, lists, existingMatches, 1)
    const p1_cocktails = filterAndIgnoreExistingMatches(input, cocktails, existingMatches, 1)

    // Includes = priority #2
    const p2_ingredients = filterAndIgnoreExistingMatches(input, ingredients, existingMatches, 2)
    const p2_lists = filterAndIgnoreExistingMatches(input, lists, existingMatches, 2)
    const p2_cocktails = filterAndIgnoreExistingMatches(input, cocktails, existingMatches, 2)

    return [
      {
        label: 'Ingredients (Closest match)',
        options: [...p0_ingredients, ...p1_ingredients, ...p2_ingredients],
      },
      {
        label: 'Categories',
        options: [...p1_lists, ...p2_lists],
      },
      {
        label: 'Cocktails',
        options: [...p1_cocktails, ...p2_cocktails],
      }
    ]

    // option = cocktail obj
    // rawInput = keywords, split on space

    // TODO:
    // Set order of operations for filtering (start w/ direct matches)
    // const words = rawInput.split(' ');
    // const results = words.reduce(
    //   (acc, cur) => acc && option.label.toLowerCase().slice(0, cur.length).includes(cur.toLowerCase()),
    //   true,
    // );
    // return results
  };

  return (<Select
    isMulti
    autoFocus
    isLoading={isLoading}
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
    instanceId={1}
    inputValue={inputValue}
    formatGroupLabel={formatGroupLabel}
    placeholder='Search for "sweet" or "bourbon"'
    // Checks for someone entering or exiting negative mode
    onInputChange={(input, type) => {
      // Prevents loading symbol from showing on basic click in/out of input box
      if (type.action !== 'menu-close' && type.action !== 'input-blur') {
        setIsLoading(true)
      }
      if (input === '') {
        setNegativeMode(false)
      }
      if (negativeMode) {
        setInputValue(input)
      }
      if (input === '-') {
        setNegativeMode(true)
        setInputValue(' ')
      } else {
        setInputValue(input)
      }
      setGroupedOptions(filterOptions(input))
      setTimeout(() => setIsLoading(false), 1000)
    }}
    onChange={vals => {
      if (vals === null) {
        setKeywords([])
        localStorage.setItem('keywords', JSON.stringify([]));
        return
      }
      setKeywords(vals)
      localStorage.setItem('keywords', JSON.stringify(vals));
    }}
  />)
}
