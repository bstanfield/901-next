/** @jsx jsx */
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


// FRONTEND HELPERS

const capitalizeFirst = x => R.concat(R.toUpper(R.head(x)), R.tail(x));

const colors = {
  primaryText: '#4A4A4A',
  lightGrayText: 'rgba(200, 200, 200, 0.9)',
  backgroundWhite: '#FcFcFc',
  backgroundShadow: '#EEECE5',
  primaryRed: '#ff4622',
  primaryGreen: '#1A3C34',
  greenButton: '#4dc156',
  progressBar: '#ffd506',
  errorRed: '#e93710',
  lightBorder: '#BCBCBC',
  veryLightGray: 'rgba(0,0,0,0.1)',
  neutralCard: '#A8BAC3',
  correctCard: '#61ea44',
  assassinCard: '#E14938',
};

// PlayerBoard helper fns
const triggerModal = (setShowModal) => {
  setShowModal(true);
  setTimeout(() => {
    setShowModal(false);
  }, 3000);
};

const replaceWord = async (index, url, board, state) => {
  const response = await hitAPIEndpoint('get', `swap-word/${url}/${index}`);
  const updatedBoard = await (response.json());
  const newWord = updatedBoard.word;
  board.splice(index, 1, newWord);
  state.setBoard(board);
  state.triggerRefreshCard(state.refreshCard + 1);
}

const findCorrectGuesses = (teamBoard, teamGuesses) => {
  return teamGuesses.filter(
    guess => teamBoard[guess] === 1
  )
}

const findIncorrectGuesses = (teamBoard, teamGuesses) => {
  const incorrect = teamGuesses.filter(
    guess => teamBoard[guess] === 2
  )
  return incorrect;
}

const attemptGuess = (index, state, modifiers) => {
  if (state.localTurnCount % 2 === 0) { // RED TEAM
    const newArr = R.concat(state.redGuesses, [index]);
    modifiers.setRedGuesses(newArr);
    hitAPIEndpoint('post', `update-guesses`, {
      id: state.id,
      team: 'red',
      guesses: newArr
    });
  } else { // BLUE TEAM
    const newArr = R.concat(state.blueGuesses, [index]);
    modifiers.setBlueGuesses(newArr);
    hitAPIEndpoint('post', `update-guesses`, {
      id: state.id,
      team: 'blue',
      guesses: newArr
    });
  }
};

module.exports = {
  toCamel,
  attemptGuess,
  findIncorrectGuesses,
  findCorrectGuesses,
  replaceWord,
  triggerModal,
  colors,
  capitalizeFirst,
};