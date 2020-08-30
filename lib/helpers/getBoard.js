const storage = require('node-persist');

exports.getBoard = async (id) => {
  await storage.init();
  const storageItem = await storage.getItem('gameBoards')
  const board = storageItem[id];
  return board;
}