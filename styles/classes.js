import { scale } from '../lib/helpers'

const fonts = {
  sans: `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu,
  Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif`,
  serif: "'Merriweather', serif",
}

const colors = {
  bgColor: '#f5f5f5'
}

// Page-specific styles

// cocktail.js
const starsBox = (details) => scale({
  width: 140,
  position: 'relative',
  marginTop: details ? 8 : 0
})

const cocktailName = (details) => scale({
  fontFamily: fonts.serif,
  fontWeight: 600,
  margin: 0,
  marginTop: details ? 16 : 0,
  marginBottom: details ? [12, 18] : 4,
  padding: 0,
  fontSize: details ? [34, 40] : 28,
  lineHeight: '38px',
})

const starStyles = (details) => scale({
  fontSize: details ? 16 : 12,
  color: 'white',
  backgroundColor: '#50B27F',
  padding: '2px 3px',
  margin: details ? 2 : '1.5px',
  borderRadius: '2px',
  position: 'relative',
})

const fadedStarStyles = scale({
  opacity: .2,
})

const halfStar = (details) => scale({
  backgroundColor: colors.bgColor,
  opacity: 0.95,
  position: 'absolute',
  width: details ? 17 : 15,
  height: details ? 26 : 20,
  right: '-5px',
  bottom: 0,
})

const ingredients = (details) => scale({
  margin: 0,
  paddingLeft: 32,
  paddingTop: details ? 18 : 12,
  // 'li:before': {
  //   content: '"' - ' !important"',
  // }
})

const instructions = (details) => scale({
  fontFamily: 'georgia, serif',
  fontStyle: 'italic',
  color: '#333333',
  fontSize: details ? 20 : 18,
  fontWeight: 400
})

const listTags = (details) => scale({
  marginBottom: details ? 80 : 20,
  span: {
    display: 'inline-block',
    backgroundColor: 'rgb(231, 231, 231)',
    color: '#333',
    fontWeight: 500,
    margin: 2,
    padding: '2px 10px',
    borderRadius: 4,
    fontSize: 14
  }
})

const copyLink = () => scale({
  "position": "absolute",
  "right": "0px",
  "top": "-8px",
  button: {
    "backgroundColor": "#eeeeee",
    "border": "1px solid grey",
    "borderRadius": "4px",
    "boxShadow": "-1px 4px 14px -6px rgba(148,148,148,.5)",
    "cursor": "pointer",
    "fontFamily": fonts.sans,
    "mozBoxShadow": "-1px 4px 14px -6px rgba(148,148,148,.5)",
    "padding": "5px 10px",
    "webkitBoxShadow": "-1px 4px 14px -6px rgba(148,148,148,.5)",
    '&:hover': {
      backgroundColor: '#e0e0e0',
    }
  }
})

const origin = scale({
  "color": "#333333",
  "fontSize": "16px",
  "marginTop": "18px",
  "opacity": "0.5",
  "textTransform": "uppercase"
})

const cocktailContainer = scale({
  "opacity": "0.9",
  "paddingLeft": "16px",
  "paddingTop": "16px",
  "paddingBottom": "8px",
  "paddingRight": "16px",
  "transition": "border 0.2s ease",
  '&:hover': {
    "opacity": 1,
    "borderRadius": 4
  }
})

const noStyleLink = scale({
  color: 'inherit',
  '&:hover': {
    textDecoration: 'underline',
  }
})
// -- End cocktail.js

// 

module.exports = {
  fonts,
  colors,
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
};