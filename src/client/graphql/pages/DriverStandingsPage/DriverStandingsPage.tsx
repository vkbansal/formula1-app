import React from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from '@chakra-ui/spinner';

import { DriverStandingsPage as View } from 'client/common/pages/DriverStandingsPage/DriverStandingsPage';
import { useDriverStandingsPageQuery } from 'client/graphql/services';

export function DriverStandingsPage(): React.ReactElement {
  const { driverRef, year } = useParams<{
    driverRef: string;
    year: string;
  }>();
  const [{ data, fetching }] = useDriverStandingsPageQuery({
    variables: { ref: driverRef, year }
  });

  return data && !fetching ? (
    <View
      module="graphql"
      year={year}
      name={`${data.driverStandings.forename} ${data.driverStandings.surname}`}
      nationality={data.driverStandings.nationality}
      races={data.driverStandings.standings}
    />
  ) : (
    <Spinner size="xl" />
  );
}
