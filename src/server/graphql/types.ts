export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
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
