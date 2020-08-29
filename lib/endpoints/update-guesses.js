const { gameBoards } = require('../data')

exports.updateGuesses = async (req, res) => {
  const { team, guesses, id } = req.body;
  const board = gameBoards[id];

  // modifies in-memory guess state
  if (team === 'red') {
    board.redGuesses = guesses;
  } else {
    board.blueGuesses = guesses;
  }
  res.status(200).send('Success!');
};