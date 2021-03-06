import type { Request, Response } from 'express';

import type { GetDriverStandingsPathParams } from 'server/rest/types';
import resolvers from 'server/common/resolvers';

export async function getDriverStandings(
  req: Request<GetDriverStandingsPathParams>,
  res: Response
): Promise<unknown> {
  const { driverRef, year } = req.params;
  const data = resolvers.getDriverStandings(driverRef, year);

  return res.status(200).send(data);
}
