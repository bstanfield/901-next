const { getNewBoard } = require('../../../lib/helpers/getNewBoard');
fs = require('fs');
const path = require('path');

export default async (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')

  const board = await getNewBoard();

  console.log('pathing...');
  const pathToFile = path.resolve('./public/boards.json');
  console.log('path to file worked!', pathToFile);
  const rawData = fs.readFileSync(pathToFile);
  const boards = JSON.parse(rawData);
  boards[board.id] = board
  console.log('output from file plus new board: ', boards);



  res.end(JSON.stringify(board))
}