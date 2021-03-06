import type { QueryDriverStandingsArgs } from 'server/graphql/types';
import resolvers from 'server/common/resolvers';

export async function driverStandings(
  args: QueryDriverStandingsArgs
): Promise<unknown> {
  const { year, ref } = args;

  return resolvers.getDriverStandings(ref, year);
}
