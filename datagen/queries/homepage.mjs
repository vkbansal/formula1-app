export async function query(db) {
  const seasons = await db.collection('seasons').countDocuments();
  const drivers = await db.collection('drivers').countDocuments();
  const driver_nationalities = await db
    .collection('drivers')
    .distinct('nationality');
  const races = await db.collection('races').countDocuments();
  const constructors = await db.collection('constructors').countDocuments();
  const constructor_nationalities = await db
    .collection('constructors')
    .distinct('nationality');
  const circuits = await db.collection('circuits').countDocuments();
  const circuit_countries = await db.collection('circuits').distinct('country');
  const racesByCountry = await db
    .collection('results')
    .aggregate([
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
    data: {
      numOfEntities: {
        seasons,
        drivers,
        driver_nationalities: driver_nationalities.length,
        constructors,
        constructor_nationalities: constructor_nationalities.length,
        circuits,
        circuit_countries: circuit_countries.length,
        races
      },
      racesByCountry: {
        data: racesByCountry,
        indexMap: racesByCountry.reduce(
          (p, c, i) => ({ ...p, [c.country]: i }),
          {}
        )
      }
    },
    path: 'homepage.yaml'
  };
}
