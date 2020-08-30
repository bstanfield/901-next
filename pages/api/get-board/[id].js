const { getBoard } = require('../../../lib/helpers/getBoard');

export default async (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  const {
    query: { id },
  } = req

  const board = await getBoard(id)
  res.end(JSON.stringify(board))
}