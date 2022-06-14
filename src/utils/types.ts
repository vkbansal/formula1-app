export interface Circuit {
  circuitId: number;
  circuitRef: string;
  name: string;
  location: string;
  country: string;
  lat: number;
  lng: number;
  alt: number;
  url: string;
}

export interface ConstructorResult {
  constructorResultsId: number;
  raceId: number;
  constructorId: number;
  points: number;
  // status: 'null';
}

export interface ConstructorStanding {
  constructorStandingsId: number;
  raceId: number;
  constructorId: number;
  points: number;
  position: number;
  positionText: number;
  wins: number;
}

export interface Constructor {
  constructorId: number;
  constructorRef: string;
  name: string;
  nationality: string;
  url: string;
}

export interface DriverStanding {
  driverStandingsId: number;
  raceId: number;
  driverId: number;
  points: number;
  position: number;
  positionText: number;
  wins: number;
}

export interface Driver {
  driverId: number;
  driverRef: string;
  number: number;
  code: string;
  forename: string;
  surname: string;
  dob: string;
  nationality: string;
  url: string;
}

export interface LapTime {
  raceId: number;
  driverId: number;
  lap: number;
  position: number;
  time: string;
  milliseconds: number;
}

export interface PitStop {
  raceId: number;
  driverId: number;
  stop: number;
  lap: number;
  time: string;
  duration: number;
  milliseconds: number;
}

export interface Qualifying {
  qualifyId: number;
  raceId: number;
  driverId: number;
  constructorId: number;
  number: number;
  position: number;
  q1: string;
  q2: string;
  q3: string;
}

export interface Race {
  raceId: number;
  year: number;
  round: number;
  circuitId: number;
  name: string;
  date: string;
  time: string;
  url: string;
  // fp1_date: 'null';
  // fp1_time: 'null';
  // fp2_date: 'null';
  // fp2_time: 'null';
  // fp3_date: 'null';
  // fp3_time: 'null';
  // quali_date: 'null';
  // quali_time: 'null';
  // sprint_date: 'null';
  // sprint_time: 'null';
}

export interface Result {
  resultId: number;
  raceId: number;
  driverId: number;
  constructorId: number;
  number: number;
  grid: number;
  position: number;
  positionText: number;
  positionOrder: number;
  points: number;
  laps: number;
  time: string;
  milliseconds: number;
  fastestLap: number;
  rank: number;
  fastestLapTime: string;
  fastestLapSpeed: number;
  statusId: number;
}

export interface Season {
  year: number;
  url: string;
}

export interface SprintResults {
  resultId: number;
  raceId: number;
  driverId: number;
  constructorId: number;
  number: number;
  grid: number;
  position: number;
  positionText: number;
  positionOrder: number;
  points: number;
  laps: number;
  time: string;
  milliseconds: number;
  fastestLap: number;
  fastestLapTime: string;
  statusId: number;
}
