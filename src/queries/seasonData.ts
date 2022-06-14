import { query, type MongoDb } from 'utils/db';
import type {
  Driver,
  Constructor,
  Race,
  Circuit,
  DriverStanding,
  ConstructorStanding
} from 'utils/types';

export interface RaceData extends Race {
  winner_driver: Driver;
  winner_constructor: Constructor;
  circuit: Circuit;
  driver_standings: DriverStanding[];
  constructor_standings: ConstructorStanding[];
}

function racesQuery(db: MongoDb, year: string): Promise<RaceData[]> {
  return db
    .collection('races')
    .aggregate<RaceData>([
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
          winner_driver: 1,
          winner_constructor: 1,
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
          as: 'driver_standings'
        }
      },
      {
        $lookup: {
          from: 'constructor_standings',
          localField: 'raceId',
          foreignField: 'raceId',
          as: 'constructor_standings'
        }
      }
    ])
    .toArray();
}

function driversQuery(db: MongoDb, year: string): Promise<Driver[]> {
  return db
    .collection('races')
    .aggregate<Driver>([
      { $match: { year: parseInt(year, 10) } },
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
      { $sort: { forename: 1 } }
    ])
    .toArray();
}

function constructorsQuery(db: MongoDb, year: string): Promise<Constructor[]> {
  return db
    .collection('races')
    .aggregate<Constructor>([
      { $match: { year: parseInt(year, 10) } },
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
      { $sort: { name: 1 } }
    ])
    .toArray();
}

export interface SeasonData {
  races: RaceData[];
  drivers: Driver[];
  constructors: Constructor[];
}

function getSeasonsData(year: string): Promise<SeasonData> {
  return query(
    `seasonData-${year}`,
    async (db) => {
      const races = await racesQuery(db, year);
      const drivers = await driversQuery(db, year);
      const constructors = await constructorsQuery(db, year);

      return { races, drivers, constructors };
    },
    { skipCache: false }
  );
}
export default getSeasonsData;
