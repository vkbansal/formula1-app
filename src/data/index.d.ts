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
	const data: number[];
	export default data;
}

declare module 'data/seasons.yaml' {
	const data: number[];
	export default data;
}

declare module '*.yaml' {
	const data: Record<string, any>;
	export default data;
}
