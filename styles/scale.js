import { css } from '@emotion/core';
import facepaint from 'facepaint';

// import mq to override media query breakpoints for a given page
export const mq = facepaint([
  '@media(min-width: 420px)',
  '@media(min-width: 720px)',
  '@media(min-width: 1000px)',
]);

export const mqForFootprintOverview = facepaint([
  '@media(min-width: 420px)',
  '@media(min-width: 720px)',
  '@media(min-width: 1135px)',
  '@media(min-width: 1215px)',
]);

export const mqForProjectPage = facepaint([
  '@media(min-width: 420px)',
  '@media(min-width: 520px)',
  '@media(min-width: 720px)',
  '@media(min-width: 1080px)',
]);

// import scale to use media queries with emotion classes
export const scale = x => css(mq(x));
export const projectCardScale = x => css(mqForProjectPage(x));
export const overviewScale = x => css(mqForFootprintOverview(x));

// GLOBAL SCALE STYLES
export const rightSide = scale({
  marginTop: '50px',
  marginRight: '0',
  marginBottom: '0',
  marginLeft: ['0px', '0px', '240px'],
});
