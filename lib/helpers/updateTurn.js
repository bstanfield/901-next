const storage = require('node-persist');

exports.updateTurn = async (id, turn) => {
  console.log('UPDATETURN')
  console.log('id: ', id)
  console.log('turn: ', turn)
  await storage.init();
  const gameBoards = await storage.getItem('gameBoards')
  const board = gameBoards[id];
  board.turnCount = turn
  await storage.setItem('gameBoards', gameBoards)
};