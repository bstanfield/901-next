const R = require('ramda');
const { gameBoards } = require('../data');
exports.getExistingBoard = async (req, res) => {
  const id = req.params.board;
  const board = gameBoards[id];

  res.status(200).send(board);
}