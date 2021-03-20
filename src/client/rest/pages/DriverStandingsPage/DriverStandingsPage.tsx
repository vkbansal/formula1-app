import React from 'react';
import { useParams } from 'react-router-dom';
import { Spinner } from '@chakra-ui/react';
import { DriverStandingsPage as View } from 'client/common/pages/DriverStandingsPage/DriverStandingsPage';
import { useGetDriverStandings } from 'client/rest/services';

export function DriverStandingsPage(): React.ReactElement {
  const { driverRef, year } = useParams<{
    driverRef: string;
    year: string;
  }>();

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
}
