function racesQuery(db, year) {
  return db
    .collection('races')
    .aggregate([
      { $match: { year } },
      {
        $project: {
          _id: 0,
          raceId: 1,
          round: 1,
          circuitId: 1,
          name: 1,
          date: 1
        }
      },
      { $sort: { round: 1 } },
      {
        $lookup: {
          from: 'results',
          localField: 'raceId',
          foreignField: 'raceId',
          as: 'results',
          pipeline: [
            { $sort: { position: 1 } },
            { $project: { constructorId: 1, driverId: 1, _id: 0 } }
          ]
        }
      },
      {
        $project: {
          raceId: 1,
          round: 1,
          circuitId: 1,
          name: 1,
          date: 1,
          winner: { $arrayElemAt: ['$results', 0] }
        }
      },
      {
        $lookup: {
          from: 'circuits',
          localField: 'circuitId',
          foreignField: 'circuitId',
          as: 'circuit',
          pipeline: [
            {
              $project: {
                circuitRef: 1,
                name: 1,
                location: 1,
                country: 1,
                _id: 0
              }
            }
          ]
        }
      },
      {
        $project: {
          raceId: 1,
          round: 1,
          name: 1,
          date: 1,
          winner: 1,
          circuit: {
            $arrayElemAt: ['$circuit', 0]
          }
        }
      },
      {
        $lookup: {
          from: 'driver_standings',
          localField: 'raceId',
          foreignField: 'raceId',
          as: 'driver_standings',
          pipeline: [
            {
              $project: { driverId: 1, points: 1, position: 1, wins: 1, _id: 0 }
            },
            { $sort: { position: 1 } }
          ]
        }
      },
      {
        $lookup: {
          from: 'constructor_standings',
          localField: 'raceId',
          foreignField: 'raceId',
          as: 'constructor_standings',
          pipeline: [
            {
              $project: {
                constructorId: 1,
                points: 1,
                position: 1,
                wins: 1,
                _id: 0
              }
            },
            { $sort: { position: 1 } }
          ]
        }
      }
    ])
    .toArray();
}

function driversQuery(db, year) {
  return db
    .collection('races')
    .aggregate([
      { $match: { year } },
      {
        $lookup: {
          from: 'results',
          localField: 'raceId',
          foreignField: 'raceId',
          as: 'results',
          pipeline: [{ $sort: { position: 1 } }]
        }
      },
      { $unwind: '$results' },
      { $group: { _id: '$results.driverId' } },
      {
        $lookup: {
          from: 'drivers',
          localField: '_id',
          foreignField: 'driverId',
          as: 'driver'
        }
      },
      { $project: { driver: { $arrayElemAt: ['$driver', 0] } } },
      { $replaceRoot: { newRoot: '$driver' } },
      {
        $project: {
          _id: 0,
          driverId: 1,
          driverRef: 1,
          nationality: 1,
          name: { $concat: ['$forename', ' ', '$surname'] }
        }
      },
      { $sort: { name: 1 } }
    ])
    .toArray();
}

function constructorsQuery(db, year) {
  return db
    .collection('races')
    .aggregate([
      { $match: { year } },
      {
        $lookup: {
          from: 'constructor_results',
          localField: 'raceId',
          foreignField: 'raceId',
          as: 'results',
          pipeline: [{ $sort: { position: 1 } }]
        }
      },
      { $unwind: '$results' },
      { $group: { _id: '$results.constructorId' } },
      {
        $lookup: {
          from: 'constructors',
          localField: '_id',
          foreignField: 'constructorId',
          as: 'constructor'
        }
      },
      { $project: { constructor: { $arrayElemAt: ['$constructor', 0] } } },
      { $replaceRoot: { newRoot: '$constructor' } },
      {
        $project: {
          _id: 0,
          constructorId: 1,
          constructorRef: 1,
          name: 1,
          nationality: 1
        }
      },
      { $sort: { name: 1 } }
    ])
    .toArray();
}

export async function query(db) {
  const seasons = await db
    .collection('seasons')
    .find({})
    .sort('year', -1)
    .toArray();

  const all = seasons.map(async ({ year }) => {
    const races = await racesQuery(db, year);
    const drivers = await driversQuery(db, year);
    const constructors = await constructorsQuery(db, year);

    return {
      data: { races, drivers, constructors },
      path: `season/${year}.yaml`
    };
  });

  return Promise.all(all);
}
