declare module 'data/homepage.yaml' {
	export interface Data {
		seasons: number;
		drivers: number;
		constructors: number;
		circuits: number;
		races: number;
	}

	const data: Data;
	export default data;
}

declare module 'data/metadata.yaml' {
	export interface Data {
		currentSeason: number;
		noContructorChampionships: number[];
	}

	const data: Data;
	export default data;
}

declare module 'data/seasons/*.yaml' {
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

	export interface Driver {
		driverRef: string;
		name: string;
		nationality: string;
	}

	export interface Constructor {
		constructorRef: string;
		name: string;
		nationality: string;
	}

	export interface Season {
		rounds: Round[];
		drivers: Driver[];
		constructors: Constructor[];
	}

	const data: Season;
	export default data;
}

declare module 'data/seasons.yaml' {
	const data: number[];
	export default data;
}

declare module '*.yaml' {
	const data: Record<string, unknown>;
	export default data;
}
