const fs = require('fs');

exports.updateTurn = async (id, turn) => {
  const rawData = fs.readFileSync('boards.json');
  const boards = JSON.parse(rawData);
  const board = boards[id];
  board.turnCount = turn;

  fs.writeFileSync('boards.json', JSON.stringify(boards), function (err) {
    if (err) return console.log(err);
    console.log('file write')
  });
};