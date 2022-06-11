const query = require('../_utils/query.js');

module.exports = {
  eleventyComputed: {
    drivers: async () => {
      return query('drivers', async (db) => {
        const drivers = await db
          .collection('drivers')
          .find()
          .sort('forename', 1)
          .toArray();

        return drivers;
      });
    }
  }
};
