import type { QueryConstructorStandingsArgs } from 'server/graphql/types';
import resolvers from 'server/common/resolvers';

export async function constructorStandings(
  args: QueryConstructorStandingsArgs
): Promise<unknown> {
  const { year, ref } = args;

  return resolvers.getConstructorStandings(ref, year);
}
