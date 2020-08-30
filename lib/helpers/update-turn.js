const { gameBoards } = require('../data')

exports.updateTurn = async (req, res) => {
  const { turnCount, id } = req.body;
  const board = gameBoards[id];
  if (board) {
    board.turnCount = turnCount;
  }
  return 'Success!'
};