const getDB = require('../../db.js');

module.exports = {
  eleventyComputed: {
    seasonData: async (opts) => {
      const db = await getDB();
      const races = await db
        .collection('races')
        .find({ year: opts.season })
        .sort({ round: 'asc' })
        .toArray();

      return {
        races
      };
    }
  }
};
