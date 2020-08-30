const storage = require('node-persist');

exports.getBoard = async (id) => {
  await storage.init({
    dir: 'data'
  });
  const storageItem = await storage.getItem('gameBoards')
  const board = storageItem[id];
  return board;
}