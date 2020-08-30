const storage = require('node-persist');

exports.updateTurn = async (id, turn) => {
  await storage.init({
    dir: 'data'
  });
  const gameBoards = await storage.getItem('gameBoards')
  const board = gameBoards[id];
  board.turnCount = turn
  await storage.setItem('gameBoards', gameBoards)
};