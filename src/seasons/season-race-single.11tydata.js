const query = require('../_utils/query');

module.exports = {
  eleventyComputed: {
    raceData: async (opts) => {
      return query(`raceData-${opts.race.raceId}`, async (db) => {
        const data = await db
          .collection('races')
          .aggregate([
            { $match: { raceId: opts.race.raceId } },
            {
              $lookup: {
                from: 'qualifying',
                localField: 'raceId',
                foreignField: 'raceId',
                as: 'qualifying',
                pipeline: [{ $sort: { position: 1 } }]
              }
            },
            {
              $lookup: {
                from: 'sprint_results',
                localField: 'raceId',
                foreignField: 'raceId',
                as: 'sprint',
                pipeline: [{ $sort: { positionOrder: 1 } }]
              }
            },
            {
              $lookup: {
                from: 'results',
                localField: 'raceId',
                foreignField: 'raceId',
                as: 'race',
                pipeline: [{ $sort: { positionOrder: 1 } }]
              }
            }
          ])
          .toArray();

        const raceData = data[0];
        const driverIds = new Set();

        [('qualifying', 'sprint', 'race')].forEach((event) => {
          if (Array.isArray(raceData[event])) {
            raceData[event].forEach((row) => driverIds.add(row.driverId));
          }
        });

        const driversData = await db
          .collection('drivers')
          .find({ driverId: { $in: [...driverIds] } })
          .toArray();

        raceData.drivers = driversData.reduce(
          (p, c) => ({ ...p, [c.driverId]: c }),
          {}
        );

        return raceData;
      });
    }
  }
};
