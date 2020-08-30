const fs = require('fs');

exports.getBoard = async (id) => {
  const rawData = fs.readFileSync('boards.json');
  const boards = JSON.parse(rawData);
  const board = boards[id];
  return board;
}