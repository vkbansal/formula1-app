import { mariadbPool } from '../db';
import constructorQuery from '../queries/Constructor.sql';
import constructorStandingsQuery from '../queries/ConstructorStandings.sql';

export async function getConstructorStandings(
  constructorRef: string,
  year: string
): Promise<unknown> {
  const [constructorData] = await mariadbPool.query(constructorQuery, [
    constructorRef
  ]);

  const standingsData = await mariadbPool.query(
    { sql: constructorStandingsQuery, dateStrings: true },
    [constructorRef, year]
  );

  return {
    ...constructorData,
    standings: standingsData
  };
}
