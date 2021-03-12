import React from 'react';
import { useParams } from 'react-router-dom';
import { Text } from '@chakra-ui/react';
// import { DriverStandingsPage as View } from 'client/common/pages/DriverStandingsPage/DriverStandingsPage';

export function DriverStandingsPage(): React.ReactElement {
  const { driverRef, year } = useParams<{
    driverRef: string;
    year: string;
  }>();

  console.log({ driverRef, year });

  return (
    <React.Fragment>
      <Text fontSize="3xl">TODO: Implement this on React-Day</Text>
    </React.Fragment>
  );
}

/**

const { data, loading } = useGet(
  `/seasons/${year}/drivers/${driverRef}/standings`
);

const { data, loading } = useGetDriverStandings({ driverRef, year });

  return data && !loading ? (
    <View
      module="rest"
      name={`${data.forename} ${data.surname}`}
      nationality={data.nationality}
      year={year}
      races={data.standings || []}
    />
  ) : (
    <Spinner size="xl" />
  );

*/
