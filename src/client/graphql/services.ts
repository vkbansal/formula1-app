import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  seasonSummary: SeasonSummary;
  constructorStandings: ConstructorSeasonStandings;
  driverStandings: DriverSeasonStandings;
};

export type QuerySeasonSummaryArgs = {
  year: Scalars['String'];
};

export type QueryConstructorStandingsArgs = {
  year: Scalars['String'];
  ref: Scalars['String'];
};

export type QueryDriverStandingsArgs = {
  year: Scalars['String'];
  ref: Scalars['String'];
};

export type SeasonSummary = {
  constructors: Array<ConstructorSeasonSummary>;
  drivers: Array<DriverSeasonSummary>;
  races: Array<RaceSummary>;
};

export type ConstructorSeasonSummary = {
  constructor: Constructor;
  points: Scalars['Int'];
  position: Scalars['Int'];
};

export type Constructor = {
  id: Scalars['Int'];
  ref: Scalars['String'];
  name: Scalars['String'];
  nationality: Scalars['String'];
  url: Scalars['String'];
};

export type DriverSeasonSummary = {
  driver: Driver;
  points: Scalars['Int'];
  position: Scalars['Int'];
};

export type Driver = {
  id: Scalars['Int'];
  ref: Scalars['String'];
  forename: Scalars['String'];
  surname: Scalars['String'];
  nationality: Scalars['String'];
  url: Scalars['String'];
};

export type RaceSummary = {
  round: Scalars['Int'];
  date: Scalars['String'];
  name: Scalars['String'];
  polePosition: Maybe<Driver>;
  winner: Maybe<Driver>;
};

export type ConstructorRaceStanding = {
  round: Scalars['Int'];
  name: Scalars['String'];
  date: Scalars['String'];
  circuit: Scalars['String'];
  city: Scalars['String'];
  country: Scalars['String'];
  cumulativePoints: Scalars['Int'];
  position: Scalars['Int'];
  points: Scalars['Int'];
};

export type DriverRaceStanding = {
  round: Scalars['Int'];
  name: Scalars['String'];
  date: Scalars['String'];
  circuit: Scalars['String'];
  city: Scalars['String'];
  country: Scalars['String'];
  cumulativePoints: Scalars['Int'];
  position: Maybe<Scalars['Int']>;
  points: Maybe<Scalars['Int']>;
  racePosition: Maybe<Scalars['Int']>;
};

export type ConstructorSeasonStandings = {
  id: Scalars['Int'];
  ref: Scalars['String'];
  name: Scalars['String'];
  nationality: Scalars['String'];
  url: Scalars['String'];
  standings: Array<ConstructorRaceStanding>;
};

export type DriverSeasonStandings = {
  id: Scalars['Int'];
  ref: Scalars['String'];
  forename: Scalars['String'];
  surname: Scalars['String'];
  nationality: Scalars['String'];
  url: Scalars['String'];
  standings: Array<DriverRaceStanding>;
};

export type ConstructorStandingsPageQueryVariables = Exact<{
  year: Scalars['String'];
  ref: Scalars['String'];
}>;

export type ConstructorStandingsPageQuery = {
  constructorStandings: Pick<
    ConstructorSeasonStandings,
    'id' | 'ref' | 'name' | 'nationality'
  > & {
    standings: Array<
      Pick<
        ConstructorRaceStanding,
        'round' | 'name' | 'date' | 'points' | 'position' | 'cumulativePoints'
      >
    >;
  };
};

export type DriverStandingsPageQueryVariables = Exact<{
  year: Scalars['String'];
  ref: Scalars['String'];
}>;

export type DriverStandingsPageQuery = {
  driverStandings: Pick<
    DriverSeasonStandings,
    'id' | 'ref' | 'forename' | 'surname' | 'nationality'
  > & {
    standings: Array<
      Pick<
        DriverRaceStanding,
        | 'round'
        | 'name'
        | 'date'
        | 'points'
        | 'position'
        | 'cumulativePoints'
        | 'racePosition'
      >
    >;
  };
};

export type SeasonSummaryPageQueryVariables = Exact<{
  year: Scalars['String'];
}>;

export type SeasonSummaryPageQuery = {
  seasonSummary: {
    constructors: Array<
      Pick<ConstructorSeasonSummary, 'points' | 'position'> & {
        constructor: Pick<Constructor, 'name' | 'nationality' | 'ref'>;
      }
    >;
    drivers: Array<
      Pick<DriverSeasonSummary, 'points' | 'position'> & {
        driver: Pick<Driver, 'forename' | 'surname' | 'nationality' | 'ref'>;
      }
    >;
    races: Array<
      Pick<RaceSummary, 'round' | 'name' | 'date'> & {
        polePosition: Maybe<
          Pick<Driver, 'forename' | 'surname' | 'nationality'>
        >;
        winner: Maybe<Pick<Driver, 'forename' | 'surname' | 'nationality'>>;
      }
    >;
  };
};

export const ConstructorStandingsPageDocument = `
    query ConstructorStandingsPage($year: String!, $ref: String!) {
  constructorStandings(year: $year, ref: $ref) {
    id
    ref
    name
    nationality
    standings {
      round
      name
      date
      points
      position
      cumulativePoints
    }
  }
}
    `;

export function useConstructorStandingsPageQuery(
  options: Omit<
    Urql.UseQueryArgs<ConstructorStandingsPageQueryVariables>,
    'query'
  > = {}
) {
  return Urql.useQuery<ConstructorStandingsPageQuery>({
    query: ConstructorStandingsPageDocument,
    ...options
  });
}
export const DriverStandingsPageDocument = `
    query DriverStandingsPage($year: String!, $ref: String!) {
  driverStandings(year: $year, ref: $ref) {
    id
    ref
    forename
    surname
    nationality
    standings {
      round
      name
      date
      points
      position
      cumulativePoints
      racePosition
    }
  }
}
    `;

export function useDriverStandingsPageQuery(
  options: Omit<
    Urql.UseQueryArgs<DriverStandingsPageQueryVariables>,
    'query'
  > = {}
) {
  return Urql.useQuery<DriverStandingsPageQuery>({
    query: DriverStandingsPageDocument,
    ...options
  });
}
export const SeasonSummaryPageDocument = `
    query SeasonSummaryPage($year: String!) {
  seasonSummary(year: $year) {
    constructors {
      constructor {
        name
        nationality
        ref
      }
      points
      position
    }
    drivers {
      driver {
        forename
        surname
        nationality
        ref
      }
      points
      position
    }
    races {
      round
      name
      date
      polePosition {
        forename
        surname
        nationality
      }
      winner {
        forename
        surname
        nationality
      }
    }
  }
}
    `;

export function useSeasonSummaryPageQuery(
  options: Omit<
    Urql.UseQueryArgs<SeasonSummaryPageQueryVariables>,
    'query'
  > = {}
) {
  return Urql.useQuery<SeasonSummaryPageQuery>({
    query: SeasonSummaryPageDocument,
    ...options
  });
}
