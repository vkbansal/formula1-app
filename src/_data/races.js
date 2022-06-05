const query = require('../_utils/query');

module.exports = async () =>
  query('races-all', async (db) => {
    const collection = db.collection('races');
    const data = await collection
      .find({})
      .sort({ year: 'asc', round: 'asc' })
      .toArray();

    return data;
  });
