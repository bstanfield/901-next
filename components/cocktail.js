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

export default function Cocktail({ cocktail, keywords, details, mapping }) {
  const [copied, setCopied] = useState(false)
  const [url, setUrl] = useState('')

  // Used for "copy link"
  useEffect(() => {
    setUrl(window.location.href);
  }, [])

  String.prototype.insert = function (index, value) {
    return this.substr(0, index) + value + this.substr(index);
  }

  String.prototype.indexOfEnd = function (string) {
    var io = this.indexOf(string);
    return io == -1 ? -1 : io + string.length;
  }

  // Create star meter for 4, 4.5, or 5-star cocktail.
  let rating
  const star = <span css={starStyles(details)}>★</span>
  const fadedStar = <span css={[starStyles(details), fadedStarStyles]}>★</span>
  const partialStar = <span css={starStyles(details)}>★<span css={halfStar(details)}></span></span>
  switch (cocktail.rating) {
    case 4.0:
      rating = <>{star}{star}{star}{star}{fadedStar}</>
      break
    case 4.5:
      rating = <>{star}{star}{star}{star}{partialStar}</>
      break
    default:
      rating = <>{star}{star}{star}{star}{star}</>
  }

  // Searches cocktail description for glass type. If found, insert into sentence.
  let { description } = cocktail
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

  // If glass name was found...
  if (index !== -1) {
    description = description.insert(index, glass)
    description = description.replace(name, '<span style="color: black;">' + name + '</span>');
    description = description.replace(glass, '<span style="font-style: normal;">' + glass + '</span>');
  }

  // Might have more mappings in future. For now, rye = whiskey and scotch
  const checkAlternatives = (line, keyword) => {
    let alternativeMatch = false
    const alternatives = {
      whiskey: ['rye', 'scotch']
    }

    const selectedAlternatives = alternatives[keyword.toLowerCase()]
    if (selectedAlternatives) {
      for (const alternative of selectedAlternatives) {
        if (line.toLowerCase().includes(alternative)) {
          alternativeMatch = true
        }
      }
    }
    return alternativeMatch
  }

  const findSelectedLines = (lines, keyword) => {
    // Ignore keywords that are searches for categories (lists) or cocktail names
    if (keyword.data === 'category' || keyword.data === 'cocktail' || keyword.type === 'negative') {
      return null
    }

    const { value: keywordValue } = keyword
    let partialMatches = []
    let perfectMatch = []

    // Removes commas, parentheses, etc. from a keywordValue
    const fragments = keywordValue.replace(/[^\w\s]/gi, '').split(' ').map(str => str.trim().toLowerCase())

    for (const line of lines) {
      const lineFragments = line.split(' ')

      // for keywordValues like [whiskey, rye]
      if (fragments.length > 1) {
        let fragmentCount = fragments.length
        let fragmentMatches = 0

        for (const fragment of fragments) {
          if (line.toLowerCase().includes(fragment)) {
            fragmentMatches++
          }
        }

        // As long as there is a 50%+ match, consider that partial match
        if (fragmentMatches >= fragmentCount / 2) {
          partialMatches.push({ line, matches: fragmentMatches, potentialMatches: lineFragments.length, keywordValue })
        }
      } else {
        const alternative = checkAlternatives(line, keywordValue)
        if (alternative) {
          perfectMatch.push(line)
        }
        // This else block is for single-word keywords
        if (line.toLowerCase().includes(keywordValue.toLowerCase())) {
          perfectMatch.push(line)
        }
      }
    }

    // perfect match
    if (perfectMatch.length > 0) return perfectMatch[0]

    // no matches
    if (partialMatches.length === 0) {
      return null
    }

    // search all partial matches for best match
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
    return highestPartialMatch.line
  }

  // Used to bold tags
  const keywordValues = keywords.map(kw => kw.value)

  // Used to bold line items
  const selectedLines = keywords.map(kw => findSelectedLines(cocktail.lines, kw))

  // Details parameter is for the detailed cocktail pages (i.e. .../manhattan, .../last_word, etc.)
  return (
    <>
      <div key={cocktail.name} css={cocktailContainer}>
        <strong>
          {details
            ? <div css={cocktailName(details)}>{cocktail.name}</div>
            : <Link href="/[cocktail]" as={`/${cocktail.id}`}>
              <a rel="noopener" href={`/${cocktail.id}`} css={noStyleLink}>
                <div css={cocktailName(details)}>{cocktail.name}</div>
              </a>
            </Link>
          }

          <div css={starsBox(details)}>
            {rating}
          </div>

          <ul css={ingredients(details)}>
            {
              cocktail.lines.map(line =>
                <li key={line} style={{ fontSize: details ? 22 : 18, fontWeight: 400 }}>
                  {selectedLines.includes(line)
                    ? <span style={{ fontWeight: 700 }}>{line}</span>
                    : line
                  }
                </li>
              )
            }
          </ul>

          <i>
            <p css={instructions(details)} dangerouslySetInnerHTML={{ __html: `&ldquo;${description}&rdquo;` }} />
          </i>

          {(details && cocktail.origin) &&
            <p css={origin}>Origin: {cocktail.origin}</p>
          }

          <div css={listTags(details)}>
            {
              cocktail.lists.map(list =>
                <span key={list} style={{ fontSize: details ? 18 : 16, margin: details ? 3 : 2, fontWeight: keywordValues.includes(list) ? 700 : 400 }}>
                  {keywordValues.includes(list) && '✔ '}{list}
                </span>
              )
            }
          </div>

          {details &&
            <div css={copyLink}>
              <CopyToClipboard text={url || ''}
                onCopy={() => setCopied(true)}>
                <button>{copied ? '✅ Copied to clipboard' : '🔗 Copy link'}</button>
              </CopyToClipboard>
            </div>
          }
        </strong>
      </div>
      <hr />
    </>
  )
}