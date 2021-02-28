import React from 'react';
import { RestfulProvider } from 'restful-react';
import { Redirect, Route } from 'react-router-dom';

import { SeasonSummaryPage } from './pages/SeasonSummaryPage/SeasonSummaryPage';

export default function RestApp(): React.ReactElement {
  return (
    <RestfulProvider base="/api/rest">
      <Route path="/rest" exact>
        <Redirect to="/rest/seasons/2020/summary" />
      </Route>
      <Route path="/rest/seasons/:year/summary" exact>
        <SeasonSummaryPage />
      </Route>
    </RestfulProvider>
  );
}
