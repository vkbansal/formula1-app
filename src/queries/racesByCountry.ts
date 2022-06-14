import { query } from 'utils/db';

export interface RacesInACountry {
  count: number;
  country: string;
}

export interface RacesByCountry {
  data: RacesInACountry[];
  indexMap: Record<string, number>;
}

const racesByCountry = (): Promise<RacesByCountry> =>
  query('racesByCountry', async (db) => {
    const data = await db
      .collection('results')
      .aggregate<RacesInACountry>([
        { $group: { _id: '$raceId' } },
        {
          $lookup: {
            from: 'races',
            localField: '_id',
            foreignField: 'raceId',
            as: 'races'
          }
        },
        { $match: { 'races.0': { $exists: true } } },
        { $project: { race: { $arrayElemAt: ['$races', 0] } } },
        {
          $lookup: {
            from: 'circuits',
            localField: 'race.circuitId',
            foreignField: 'circuitId',
            as: 'circuits'
          }
        },
        { $project: { race: 1, circuit: { $arrayElemAt: ['$circuits', 0] } } },
        { $group: { _id: '$circuit.country', count: { $sum: 1 } } },
        { $project: { country: '$_id', count: 1, _id: 0 } },
        { $sort: { count: -1 } }
      ])
      .toArray();

    return {
      data,
      indexMap: data.reduce((p, c, i) => ({ ...p, [c.country]: i }), {})
    };
  });

export default racesByCountry;
