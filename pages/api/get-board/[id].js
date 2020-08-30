const path = require('path');

export default async (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  const {
    query: { id },
  } = req

  console.log('pathing...');
  const pathToFile = path.resolve('./public/boards.json');
  console.log('path to file worked!', pathToFile);
  const rawData = fs.readFileSync(pathToFile);
  const boards = JSON.parse(rawData);
  console.log('output from file: ', boards);

  res.end(JSON.stringify(boards[id]))
}