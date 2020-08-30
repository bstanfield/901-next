const { updateTurn } = require('../../../lib/helpers/updateTurn');

export default async (req, res) => {
  res.statusCode = 200
  res.setHeader('Content-Type', 'application/json')
  const {
    query: { slug },
  } = req
  const id = slug[0]
  const turn = slug[1]
  console.log('id passed to [...slug]: ', id)
  console.log('turn passed to [...slug]', turn)

  await updateTurn(id, turn)
  res.end('Success')
}