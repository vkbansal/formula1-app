export interface F1RaceByCountry {
	country: string;
	count: number;
}

export interface F1SeasonDriver {
	driverRef: string;
}

export interface F1SeasonConstructor {
	constructorRef: string;
}

export interface F1ChampionshipStanding {
	year: number;
	position: number;
}

export interface F1Driver {
	driverId: number;
	driverRef: string;
	name: string;
	dob: string;
	nationality: string;
	totalRaces: number;
	raceWins: number;
	podiums: number;
	winPct: number;
	championshipStandings: F1ChampionshipStanding[];
}

export interface F1Constructor {
	constructorId: number;
	constructorRef: string;
	name: string;
	nationality: string;
	totalRaces: number;
	raceWins: number;
	podiums: number;
	winPct: number;
	championshipStandings: F1ChampionshipStanding[];
}

export interface F1DriverStanding {
	driverRef: string;
	position: number;
	points: number;
	wins: number;
}

export interface F1ConstructorStanding {
	constructorRef: string;
	position: number;
	points: number;
	wins: number;
}

export interface F1Circuit {
	name: string;
	location: string;
	country: string;
}

export interface F1Race {
	raceId: number;
	year: number;
	round: number;
	name: string;
	date: string;
	time: string | null;
	circuit: F1Circuit;
	winnerDriver: string;
	winnerConstructor: string;
	driverStandings: F1DriverStanding[];
	constructorStandings: F1ConstructorStanding[];
}
