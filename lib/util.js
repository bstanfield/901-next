const R = require('ramda');

const createCamel = (acc, split) => {
  let newAcc;
  acc === ''
    ? newAcc = acc + split
    : newAcc = acc + split.charAt(0).toUpperCase() + split.substring(1);
  return newAcc;
};

const createNewCamelObj = (obj) => {
  const newKeys = R.pipe(
    R.map(
      key => key.split(/[-_]+/),
    ),
    R.map(
      splitArr => R.reduce(
        createCamel,
        '',
        splitArr,
      ),
    ),
  )(Object.keys(obj));
  const newObj = R.zipObj(newKeys, Object.values(obj));
  return newObj;
};

const toCamel = R.curry((item) => {
  if (R.is(Array, item)) return R.map(createNewCamelObj, item);
  return createNewCamelObj(item);
});

module.exports = {
  toCamel,
};