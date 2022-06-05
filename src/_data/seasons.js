const query = require('../_utils/query.js');

module.exports = async () =>
  query('seasons', async (db) => {
    const collection = db.collection('seasons');
    const data = await collection.find().sort({ year: 'asc' }).toArray();

    return data.map((row) => row.year);
  });
