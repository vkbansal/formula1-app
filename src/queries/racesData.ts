import { query } from 'utils/db';

const getRaces = (year: string): Promise<any> =>
  query(`seasonData-${year}`, async (db) => {
    const races = await db
      .collection('races')
      .aggregate([
        { $match: { year: parseInt(year, 10) } },
        { $sort: { round: 1 } },
        {
          $lookup: {
            from: 'results',
            localField: 'raceId',
            foreignField: 'raceId',
            as: 'results',
            pipeline: [{ $sort: { position: 1 } }]
          }
        },
        {
          $project: {
            raceId: 1,
            year: 1,
            round: 1,
            circuitId: 1,
            name: 1,
            date: 1,
            time: 1,
            url: 1,
            fp1_date: 1,
            fp1_time: 1,
            fp2_date: 1,
            fp2_time: 1,
            fp3_date: 1,
            fp3_time: 1,
            quali_date: 1,
            quali_time: 1,
            sprint_date: 1,
            sprint_time: 1,
            winner_obj: { $arrayElemAt: ['$results', 0] }
          }
        },
        {
          $lookup: {
            from: 'drivers',
            localField: 'winner_obj.driverId',
            foreignField: 'driverId',
            as: 'winner_driver_temp'
          }
        },
        {
          $project: {
            raceId: 1,
            year: 1,
            round: 1,
            circuitId: 1,
            name: 1,
            date: 1,
            time: 1,
            url: 1,
            fp1_date: 1,
            fp1_time: 1,
            fp2_date: 1,
            fp2_time: 1,
            fp3_date: 1,
            fp3_time: 1,
            quali_date: 1,
            quali_time: 1,
            sprint_date: 1,
            sprint_time: 1,
            winner_obj: 1,
            winner_driver: { $arrayElemAt: ['$winner_driver_temp', 0] }
          }
        },
        {
          $lookup: {
            from: 'constructors',
            localField: 'winner_obj.constructorId',
            foreignField: 'constructorId',
            as: 'winner_constructor_temp'
          }
        },
        {
          $project: {
            raceId: 1,
            year: 1,
            round: 1,
            circuitId: 1,
            name: 1,
            date: 1,
            time: 1,
            url: 1,
            fp1_date: 1,
            fp1_time: 1,
            fp2_date: 1,
            fp2_time: 1,
            fp3_date: 1,
            fp3_time: 1,
            quali_date: 1,
            quali_time: 1,
            sprint_date: 1,
            sprint_time: 1,
            winner_obj: 1,
            winner_driver: 1,
            winner_constructor: {
              $arrayElemAt: ['$winner_constructor_temp', 0]
            }
          }
        },
        {
          $lookup: {
            from: 'circuits',
            localField: 'circuitId',
            foreignField: 'circuitId',
            as: 'circuit'
          }
        },
        {
          $project: {
            raceId: 1,
            year: 1,
            round: 1,
            circuitId: 1,
            name: 1,
            date: 1,
            time: 1,
            url: 1,
            fp1_date: 1,
            fp1_time: 1,
            fp2_date: 1,
            fp2_time: 1,
            fp3_date: 1,
            fp3_time: 1,
            quali_date: 1,
            quali_time: 1,
            sprint_date: 1,
            sprint_time: 1,
            winner_obj: 1,
            winner_driver: 1,
            winner_constructor: 1,
            circuit: {
              $arrayElemAt: ['$circuit', 0]
            }
          }
        }
      ])
      .toArray();

    return { races };
  });

export default getRaces;
