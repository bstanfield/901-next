import Link from 'next/link'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useState } from 'react'

export default function Cocktail({ cocktail, filters = [], details, parent }) {
  let rating
  const star = <span className="star">★</span>
  const [copied, setCopied] = useState(false)

  switch (cocktail.rating) {
    case 4.0:
      rating = <>{star}{star}{star}{star}<span className="star fadedStar">★</span></>
      break
    case 4.5:
      rating = <>{star}{star}{star}{star}<span className="star">★<span className="halfStar"></span></span></>
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

  return (
    <>
      <div key={cocktail.name} className="cocktailContainer">
        <strong>
          {details
            ? <div style={{ fontSize: details ? 34 : 32 }} className="cocktailName">{cocktail.name}</div>
            : <Link href="/[cocktail]" as={`/${cocktail.id}`}><a rel="noopener" href={`/${cocktail.id}`} className="noStyleLink"><div className="cocktailName">{cocktail.name}</div></a></Link>
          }
          <div style={{ width: 140, position: 'relative', marginTop: details ? 8 : 0 }}>
            {rating}
          </div>
          <ul style={{ margin: 0, paddingLeft: 32, paddingTop: details ? 18 : 12 }}>
            {cocktail.lines.map((line) => <li key={line} style={{ fontSize: details ? 22 : 18, fontWeight: 400 }}>{line}</li>)}
          </ul>
          <i><p className="description" style={{ fontSize: details ? 20 : 18, fontWeight: 400 }} dangerouslySetInnerHTML={{ __html: `&ldquo;${description}&rdquo;` }} /></i>
          {(details && cocktail.origin) && <p className="origin">Origin: {cocktail.origin}</p>}
          <div style={{ marginBottom: details ? 80 : 20 }} className="listTags">{cocktail.lists.map((list) => <span style={{ fontSize: details ? 18 : 16, margin: details ? 3 : 2, fontWeight: filters.includes(list) ? 600 : 400 }}>{filters.includes(list) && '✔ '}{list}</span>)}</div>
          {details && <div className="copyLink">
            <CopyToClipboard text={`https://901.benstanfield.io/${cocktail.id}`}
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