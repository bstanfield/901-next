import { css } from '@emotion/react'
import facepaint from 'facepaint'

// Media queries and Emotion CSS - defined here to avoid circular dependency
const mq = facepaint([
  '@media(min-width: 420px)',
  '@media(min-width: 720px)',
  '@media(min-width: 1000px)',
  '@media(min-width: 1500px)',
]);

const scale = (x) => css(mq(x));

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
export const starsBox = (details) => scale({
  width: 140,
  position: 'relative',
  marginTop: details ? 8 : 0
})

export const cocktailName = (details) => scale({
  fontFamily: fonts.serif,
  fontWeight: 600,
  margin: 0,
  marginTop: details ? 16 : 0,
  marginBottom: details ? [12, 18] : 4,
  padding: 0,
  fontSize: details ? [34, 40] : 28,
  lineHeight: '140%',
})

export const starStyles = (details) => scale({
  fontSize: details ? 16 : 12,
  color: 'white',
  backgroundColor: '#50B27F',
  padding: '2px 3px',
  margin: details ? 2 : '1.5px',
  borderRadius: '2px',
  position: 'relative',
})

export const fadedStarStyles = scale({
  opacity: .2,
})

export const halfStar = (details) => scale({
  backgroundColor: colors.bgColor,
  opacity: 0.95,
  position: 'absolute',
  width: details ? 17 : 15,
  height: details ? 26 : 20,
  right: '-5px',
  bottom: 0,
})

export const ingredients = (details) => scale({
  margin: 0,
  paddingLeft: 32,
  paddingTop: details ? 18 : 12,
})

export const instructions = (details) => scale({
  fontFamily: 'georgia, serif',
  color: '#333333',
  fontSize: details ? 22 : 18,
  fontWeight: 400,
  margin: '24px 0px',
})

export const listTags = (details) => scale({
  marginBottom: details ? 80 : 20,
  span: {
    display: 'inline-block',
    backgroundColor: 'rgb(231, 231, 231)',
    color: '#333',
    fontWeight: 500,
    margin: 2,
    padding: '2px 10px',
    borderRadius: 4,
    fontSize: 14,
    transition: 'background-color 0.15s ease, transform 0.1s ease',
    '&:hover': {
      backgroundColor: 'rgb(200, 220, 240)',
    }
  }
})

export const copyLink = () => scale({
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

export const origin = scale({
  "color": "#333333",
  "fontSize": "16px",
  "marginTop": "18px",
  "opacity": "0.5",
  "textTransform": "uppercase"
})

export const cocktailContainer = scale({
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

export const noStyleLink = scale({
  color: 'inherit',
  '&:hover': {
    textDecoration: 'underline',
  }
})

export { fonts, colors }