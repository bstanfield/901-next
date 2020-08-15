const url = require('url');

export default (req, res) => {
  const query = url.parse(req.url, true).query
  console.log('query: ', query.s);
  if (query.s) {
    return res.status(200).json({ text: 'Success!' });
  }
  res.status(404).json({ text: 'Secret not found' });
}