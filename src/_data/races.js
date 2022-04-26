const getDB = require('../../db.js');

module.exports = async () => {
  const db = await getDB();
  const collection = db.collection('races');
  const data = await collection
    .find({})
    .sort({ year: 'asc', round: 'asc' })
    .toArray();

  return data;
};
