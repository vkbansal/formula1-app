const query = require('../_utils/query.js');

module.exports = {
  eleventyComputed: {
    seasonData: async (opts) => {
      return query(`seasonData-${opts.season}`, async (db) => {
        const races = await db
          .collection('races')
          .find({ year: opts.season })
          .sort({ round: 'asc' })
          .toArray();

        return { races };
      });
    }
  }
};
