import React from 'react';
import { RestfulProvider } from 'restful-react';
import { Redirect, Route } from 'react-router-dom';

import { SeasonSummaryPage } from './pages/SeasonSummaryPage/SeasonSummaryPage';
import { ConstructorStandingsPage } from './pages/ConstructorStandingsPage/ConstructorStandingsPage';
import { DriverStandingsPage } from './pages/DriverStandingsPage/DriverStandingsPage';

export default function RestApp(): React.ReactElement {
  return (
    <RestfulProvider base="/api/rest">
      <Route path="/rest" exact>
        <Redirect to="/rest/seasons/2020/summary" />
      </Route>
      <Route path="/rest/seasons/:year/summary" exact>
        <SeasonSummaryPage />
      </Route>
      <Route
        path="/rest/seasons/:year/constructors/:constructorRef/standings"
        exact
      >
        <ConstructorStandingsPage />
      </Route>
      <Route path="/rest/seasons/:year/drivers/:driverRef/standings" exact>
        <DriverStandingsPage />
      </Route>
    </RestfulProvider>
  );
}
