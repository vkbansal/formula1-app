const getDB = require('../../db.js');

module.exports = async () => {
  const db = await getDB();
  const collection = db.collection('seasons');
  const data = await collection.find().sort({ year: 'asc' }).toArray();

  return data.map((row) => row.year);
};
