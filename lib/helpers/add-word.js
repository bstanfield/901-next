// const { addWordToDb } = require('../queries');

// exports.addWord = async (req, res) => {
//   const { name } = req.body;

//   const result = await addWordToDb(name);
//   if (!result) {
//     res.status(422).send({ err: `word ${name} already exists.` });
//     return;
//   }
//   res.status(200).send({ success: `word ${name} added` });
// };