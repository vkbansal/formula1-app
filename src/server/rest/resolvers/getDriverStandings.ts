import type { Request, Response } from 'express';
import { mariadbPool } from 'server/common/db';

import driverQuery from 'server/common/queries/Driver.sql';
import driverStandingsQuery from 'server/common/queries/DriverStandings.sql';
import type { GetDriverStandingsPathParams } from 'server/rest/types';

export async function getDriverStandings(
  req: Request<GetDriverStandingsPathParams>,
  res: Response
): Promise<unknown> {
  const { driverRef, year } = req.params;
  const [driverData] = await mariadbPool.query(
    { sql: driverQuery, dateStrings: true },
    [driverRef]
  );

  const standingsData = await mariadbPool.query(
    { sql: driverStandingsQuery, dateStrings: true },
    [driverRef, year]
  );

  return res.status(200).send({
    ...driverData,
    standings: standingsData
  });
}
