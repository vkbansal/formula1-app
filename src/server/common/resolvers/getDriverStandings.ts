import { mariadbPool } from '../db';

import driverQuery from '../queries/Driver.sql';
import driverStandingsQuery from '../queries/DriverStandings.sql';

export async function getDriverStandings(
  driverRef: string,
  year: string
): Promise<unknown> {
  const [driverData] = await mariadbPool.query(
    { sql: driverQuery, dateStrings: true },
    [driverRef]
  );

  const standingsData = await mariadbPool.query(
    { sql: driverStandingsQuery, dateStrings: true },
    [driverRef, year]
  );

  return {
    ...driverData,
    standings: standingsData
  };
}
