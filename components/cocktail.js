/** @jsx jsx */

import Link from 'next/link'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useState, useEffect } from 'react'
import {
  starsBox,
  cocktailName,
  starStyles,
  fadedStarStyles,
  halfStar,
  ingredients,
  instructions,
  listTags,
  copyLink,
  origin,
  cocktailContainer,
  noStyleLink,
} from '../styles/classes'
import { jsx } from '@emotion/core'

export default function Cocktail({ cocktail, keywords, details }) {
  let rating
  const star = <span css={starStyles(details)}>★</span>
  const [copied, setCopied] = useState(false)
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(window.location.href);
  }, [])

  switch (cocktail.rating) {
    case 4.0:
      rating = <>{star}{star}{star}{star}<span css={starStyles(details)} css={[starStyles(details), fadedStarStyles]}>★</span></>
      break
    case 4.5:
      rating = <>{star}{star}{star}{star}<span css={starStyles(details)}>★<span css={halfStar(details)}></span></span></>
      break
    default:
      rating = <>{star}{star}{star}{star}{star}</>
  }

  String.prototype.insert = function (index, value) {
    return this.substr(0, index) + value + this.substr(index);
  }

  String.prototype.indexOfEnd = function (string) {
    var io = this.indexOf(string);
    return io == -1 ? -1 : io + string.length;
  }

  let description = cocktail.description
  let index = -1
  let glass
  let name
  const glassIs = (text) => description.indexOfEnd(text)
  if (glassIs('cocktail glass') > -1) {
    name = 'cocktail glass'
    glass = ' 🍸'
    index = glassIs(name)
  } else if (glassIs('rocks glass') > -1) {
    name = 'rocks glass'
    glass = ' 🥃'
    index = glassIs(name)
  } else if (glassIs('martini glass') > -1) {
    name = 'martini glass'
    glass = ' 🍸'
    index = glassIs(name)
  } else if (glassIs('wine glass') > -1) {
    name = 'wine glass'
    glass = ' 🍷'
    index = glassIs(name)
  } else if (glassIs('champagne') > -1) {
    name = 'champagne'
    glass = ' 🥂'
    index = glassIs(name)
  } else if (glassIs('pint glass') > -1) {
    name = 'pint glass'
    glass = ' 🍺'
    index = glassIs(name)
  } else if (glassIs('highball') > -1) {
    name = 'highball'
    glass = ' 🥛'
    index = glassIs(name)
  } else if (glassIs('tiki') > -1) {
    name = 'tiki'
    glass = ' 🗿'
    index = glassIs(name)
  } else if (glassIs('shot glass') > -1) {
    name = 'shot glass'
    glass = ' 🤘'
    index = glassIs(name)
  }

  if (index !== -1) {
    description = description.insert(index, glass)
    description = description.replace(name, '<span style="color: black;">' + name + '</span>');
    description = description.replace(glass, '<span style="font-style: normal;">' + glass + '</span>');
  }

  // const checkIfLineItemIsPicked = (line, filters) => {
  //   const specialMappings = {
  //     whiskey: ['bourbon', 'whisky', 'scotch', 'rye'],
  //     whisky: ['bourbon', 'whiskey', 'scotch', 'rye'],
  //     bourbon: ['whiskey', 'whisky', 'scotch'],
  //     scotch: ['whiskey', 'whisky', 'bourbon'],
  //   }

  //   let listElement = <li key={line} style={{ fontSize: details ? 22 : 18, fontWeight: 400 }}>{line}</li>
  //   let matches = 0
  //   let total
  //   for (const filter of filters) {
  //     const lowerCaseLine = line.toLowerCase()
  //     const filterFragments = filter.split(',').map(filterFragment => filterFragment.toLowerCase().replace(/ *\([^)]*\) */g, ""))

  //     total = filterFragments.length

  //     for (const fragment of filterFragments) {
  //       if (lowerCaseLine.includes(fragment)) {
  //         matches++
  //       } else if (specialMappings[fragment]) {
  //         specialMappings[fragment].map(mapping => {
  //           if (lowerCaseLine.includes(mapping)) {
  //             matches++
  //           }
  //         })
  //       }
  //       if (matches === total) {
  //         listElement = <li key={line} style={{ fontSize: details ? 22 : 18, fontWeight: 400 }}><span>✔️ </span>{line}</li>
  //         return listElement
  //       }
  //     }
  //   }
  //   return listElement
  // }

  // TODO: Only allow a single keyword to map to a single line!!
  // ^To accomplish this, might be better to not go line by line, but take in all lines and go keyword by keyword
  const alternative = (lines, keyword) => {
    let partialMatches = []
    let perfectMatch = []

    // Removes commas, parentheses, etc.
    const fragments = keyword.replace(/[^\w\s]/gi, '').split(' ').map(str => str.trim().toLowerCase())

    for (const line of lines) {
      const lineFragments = line.split(' ')

      // for keywords like [whiskey, rye]
      if (fragments.length > 1) {
        let fragmentCount = fragments.length
        let fragmentMatches = 0
        for (const fragment of fragments) {
          if (line.toLowerCase().includes(fragment)) {
            fragmentMatches++
          }
        }
        if (fragmentMatches >= fragmentCount / 2) {
          partialMatches.push({ line, matches: fragmentMatches, potentialMatches: lineFragments.length, keyword })
        }
      } else {
        if (line.toLowerCase().includes(keyword.toLowerCase())) {
          perfectMatch.push(line)
        }
      }
    }

    // perfect match
    if (perfectMatch.length > 0) return { line: perfectMatch[0], keyword }

    // no matches
    if (partialMatches.length === 0) {
      return { keyword, line: '' }
    }

    // best partial match
    const highestPartialMatch = partialMatches.reduce((acc, partialMatch) => {
      if (!acc) {
        return partialMatch
      }
      if (acc.matches > partialMatch.matches) {
        return acc
      }
      if (acc.matches === partialMatch.matches) {
        if (acc.matches - acc.potentialMatches > partialMatch.matches - partialMatch.potentialMatches) {
          return acc
        }
      }
      return partialMatch
    })
    return highestPartialMatch
  }

  const checkIfLineItemIsPicked = (line, keywords) => {
    let picked = false
    const positiveKeywords = keywords.filter(kw => kw.type === 'positive')
    // split on commas (i.e. "Whiskey, rye => [whiskey, rye]")
    const positiveKeywordsArray = positiveKeywords.map(kw => kw.value).map(value => value.split(',').map(str => str.trim().toLowerCase()))

    for (const keyword of positiveKeywordsArray) {
      // Compare keyword to line items in cocktail
      // catches cases like [whiskey, rye]
      if (keyword.length > 1) {
        let fragmentCount = keyword.length
        let fragmentMatches = 0
        for (const fragment of keyword) {
          if (line.toLowerCase().includes(fragment)) {
            fragmentMatches++
          }
        }
        picked = fragmentMatches >= fragmentCount / 2
      }

      if (line.toLowerCase().includes(keyword)) {
        picked = true
      }

      if (picked) {
        return <li key={line} style={{ fontSize: details ? 22 : 18, fontWeight: 400 }}>{picked ? <span style={{ fontWeight: 700 }}>{line}</span> : line}</li>;
      }
    }
    return <li key={line} style={{ fontSize: details ? 22 : 18, fontWeight: 400 }}>{line}</li>;
  }

  const keywordValues = keywords.map(kw => kw.value)
  const alternativeOutput = keywords.map(kw => alternative(cocktail.lines, kw.value))
  if (cocktail.name === 'Algorithm') {
    console.log('alt output: ', alternativeOutput)
  }

  return (
    <>
      <div key={cocktail.name} css={cocktailContainer}>
        <strong>
          {details
            ? <div css={cocktailName(details)}>{cocktail.name}</div>
            : <Link href="/[cocktail]" as={`/${cocktail.id}`}><a rel="noopener" href={`/${cocktail.id}`} css={noStyleLink}><div css={cocktailName(details)}>{cocktail.name}</div></a></Link>
          }
          <div css={starsBox(details)}>
            {rating}
          </div>
          <ul css={ingredients(details)}>
            {cocktail.lines.map((line) => checkIfLineItemIsPicked(line, keywords))}
          </ul>
          <i><p css={instructions(details)} dangerouslySetInnerHTML={{ __html: `&ldquo;${description}&rdquo;` }} /></i>
          {(details && cocktail.origin) && <p css={origin}>Origin: {cocktail.origin}</p>}
          <div css={listTags(details)}>{cocktail.lists.map((list) => <span key={list} style={{ fontSize: details ? 18 : 16, margin: details ? 3 : 2, fontWeight: keywordValues.includes(list) ? 700 : 400 }}>{keywordValues.includes(list) && '✔ '}{list}</span>)}</div>
          {details && <div css={copyLink}>
            <CopyToClipboard text={url || ''}
              onCopy={() => setCopied(true)}>
              <button>{copied ? '✅ Copied to clipboard' : '🔗 Copy link'}</button>
            </CopyToClipboard>
          </div>}
        </strong>
      </div>
      <hr />
    </>
  )
}