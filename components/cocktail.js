/** @jsx jsx */

import Link from 'next/link'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useState } from 'react'
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

export default function Cocktail({ cocktail, filters = [], details }) {
  let rating
  const star = <span css={starStyles(details)}>★</span>
  const [copied, setCopied] = useState(false)

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

  const checkIfLineItemIsPicked = (line, filters) => {
    let lineItem = <li key={line} style={{ fontSize: details ? 22 : 18, fontWeight: 400 }}>{line}</li>
    for (const filter of filters) {
      if (line.includes(filter)) {
        console.log('line: ', line)
        console.log('filter: ', filter)
        console.log('index: ', line.indexOf(filter))
        console.log('ends: ', line.lastIndexOf(filter))
      }
      lineItem = <li key={line} style={{ fontSize: details ? 22 : 18, fontWeight: 400 }}>{line}</li>
    }
    return lineItem;
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
            {cocktail.lines.map((line) => checkIfLineItemIsPicked(line, filters))}
          </ul>
          <i><p css={instructions(details)} dangerouslySetInnerHTML={{ __html: `&ldquo;${description}&rdquo;` }} /></i>
          {(details && cocktail.origin) && <p css={origin}>Origin: {cocktail.origin}</p>}
          <div css={listTags(details)}>{cocktail.lists.map((list) => <span key={list} style={{ fontSize: details ? 18 : 16, margin: details ? 3 : 2, fontWeight: filters.includes(list) ? 600 : 400 }}>{filters.includes(list) && '✔ '}{list}</span>)}</div>
          {details && <div css={copyLink}>
            <CopyToClipboard text={window.location.href}
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