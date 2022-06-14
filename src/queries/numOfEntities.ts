import { query } from 'utils/db';

export interface NumOfEntities {
  seasons: number;
  drivers: number;
  driver_nationalities: number;
  constructors: number;
  circuits: number;
  circuit_countries: number;
}

async function numOfEntities(): Promise<NumOfEntities> {
  const seasons = await query('numOfSeasons', (db) => {
    return db.collection('seasons').countDocuments();
  });

  const drivers = await query('numOfDrivers', (db) => {
    return db.collection('drivers').countDocuments();
  });

  const driver_nationalities = await query('driverNationalities', (db) => {
    return db.collection('drivers').distinct('nationality');
  });

  const constructors = await query('numOfConstructors', (db) => {
    return db.collection('constructors').countDocuments();
  });

  const circuits = await query('numOfCountries', (db) => {
    return db.collection('circuits').countDocuments();
  });

  const circuit_countries = await query('circuit_countries', (db) => {
    return db.collection('circuits').distinct('country');
  });

  return {
    seasons,
    drivers,
    driver_nationalities: driver_nationalities.length,
    constructors,
    circuits,
    circuit_countries: circuit_countries.length
  };
}

export default numOfEntities;
