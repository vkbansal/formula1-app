import fs from 'node:fs/promises';
import { load } from 'js-yaml';
import { globby } from 'globby';

export interface HomePage {
	seasons: number;
	drivers: number;
	constructors: number;
	circuits: number;
	races: number;
	driverChampions: number;
	constructorsChampions: number;
}

export interface DriverResult {
	round: number;
	roundName: string;
	constructor: string;
	position: number | null;
	points: number;
}

export interface ConstructorDriverResult {
	driver: string;
	position: number | null;
	points: number;
}

export interface ConstructorResult {
	round: number;
	roundName: string;
	results: ConstructorDriverResult[];
}

export interface DriverSeason {
	year: number;
	results: DriverResult[];
}

export interface ConstructorSeason {
	year: number;
	rounds: ConstructorResult[];
}

export interface Driver {
	driverRef: string;
	name: string;
	dob: string;
	hasImage: boolean;
	nationality: string;
	totalRaces: number;
	raceWins: number;
	podiums: number;
	totalLaps: number | null;
	lapsLead: number | null;
	championshipStandings: Array<{ year: number; position: number }>;
	seasons: DriverSeason[];
}

export interface Constructor {
	constructorRef: string;
	name: string;
	nationality: string;
	totalRaces: number;
	raceWins: number;
	podiums: number;
	winPct: number;
	championshipStandings: Array<{ year: number; position: number }>;
	seasons: ConstructorSeason[];
}

export interface Metadata {
	currentSeason: number;
	noContructorChampionships: number[];
}

export interface DriverStanding {
	driverRef: string;
	position: number;
	points: number;
	wins: number;
}

export interface ConstructorStanding {
	constructorRef: string;
	position: number;
	points: number;
	wins: number;
}

export interface Podium {
	constructorRef: string;
	driverRef: string;
	position: number;
}

export interface Round {
	raceId: number;
	year: number;
	round: number;
	name: string;
	date: string;
	circuit: {
		name: string;
		location: string;
		country: string;
	};
	podium: Podium[];
	driverStandings: DriverStanding[];
	constructorStandings: ConstructorStanding[];
}

export interface SeasonDriver {
	driverRef: string;
	name: string;
	nationality: string;
}

export interface SeasonConstructor {
	constructorRef: string;
	name: string;
	nationality: string;
	drivers: SeasonDriver[];
}

export interface Season {
	year: number;
	rounds: Round[];
	constructors: SeasonConstructor[];
}

export interface DataMap {
	homepage: HomePage;
	metadata: Metadata;
	seasons: Season[];
	drivers: Driver[];
	constructors: Constructor[];
	[key: `drivers/${string}`]: Driver;
	[key: `seasons/${string}`]: Season;
	[key: `constructors/${string}`]: Constructor;
}

export async function loadData<T extends keyof DataMap>(key: T): Promise<DataMap[T]> {
	if (key === 'drivers' || key === 'seasons' || key === 'constructors') {
		const files = await globby(`src/data/${key}/*.yaml`);

		const dataPromises = files.map(async (yamlFile) => {
			const yamlData = await fs.readFile(yamlFile, 'utf8');
			return load(yamlData);
		});

		return Promise.all(dataPromises) as unknown as DataMap[T];
	}

	const yamlData = await fs.readFile(`src/data/${key}.yaml`, 'utf8');

	return load(yamlData) as DataMap[T];
}
