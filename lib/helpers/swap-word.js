const { gameBoards, getRandomWords } = require('../data');

exports.swapWord = async (req, res) => {
  const { id, index } = req.params;
  const newWord = await getRandomWords(1)[0];
  gameBoards[id].words[index] = newWord;

  return {
    word: newWord,
  };
}