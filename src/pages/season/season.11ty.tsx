import { Seasons } from '11ty-global-data/seasons';
import { mapKeys, pick } from 'helpers/objectHelpers';
import { loadJsonFromDir } from 'helpers/readJson';

import type { CommonData } from 'types/11ty';
import {
	F1Constructor,
	F1Driver,
	F1Race,
	F1SeasonConstructor,
	F1SeasonDriver
} from 'types/data';
import colors from 'helpers/colors';

import css from './season.module.scss';

const shortKeysMap = {
	position: 'ps',
	points: 'pt',
	wins: 'w'
};

export interface ChartPoint {
	ps: number;
	pt: number;
	w: number;
}

export interface ChartData {
	label: string;
	color: string;
	data: Array<null | ChartPoint>;
}

export interface ComputedData {
	races: F1Race[];
	drivers: F1Driver[];
	constructors: F1Constructor[];
	driversData: ChartData[];
	constructorsData: ChartData[];
}

export interface Data extends CommonData<Seasons[number]> {
	year: number;
}

export function getData() {
	return {
		pagination: {
			data: 'seasons',
			size: 1,
			alias: 'year'
		},
		permalink: (opts: Data) => `/seasons/${opts.year}/`,
		eleventyComputed: async (opts: Data): Promise<ComputedData> => {
			const { year } = opts;
			const {
				constructors: seasonConstructors = [],
				drivers: seasonDrivers = []
			} = await loadJsonFromDir<
				{
					drivers: F1SeasonDriver[];
					constructors: F1SeasonConstructor[];
				},
				unknown
			>(`data/seasons/${year}`);
			const races = await loadJsonFromDir<F1Race>(`data/seasons/${year}/races`);
			const racesArr = Object.values(races).sort((a, b) => a.round - b.round);
			const constructors = await loadJsonFromDir<F1Constructor>(
				`data/constructors`,
				seasonConstructors.map(({ constructorRef }) => constructorRef)
			);
			const drivers = await loadJsonFromDir<F1Driver>(
				`data/drivers`,
				seasonDrivers.map(({ driverRef }) => driverRef)
			);
			const driversArr = Object.values(drivers);
			const constructorsArr = Object.values(constructors);

			const driversData: ChartData[] = driversArr.map((d, i) => {
				return {
					label: d.name,
					color: colors[i],
					data: racesArr.map<ChartPoint | null>((r) => {
						const result = r.driverStandings.find(
							(s) => s.driverRef === d.driverRef
						);
						return result
							? mapKeys<ChartPoint>(
									pick(result, ['position', 'points', 'wins']),
									(key) => shortKeysMap[key]
							  )
							: null;
					})
				};
			});

			const constructorsData: ChartData[] = constructorsArr.map((c, i) => {
				return {
					label: c.name,
					color: colors[i],
					data: racesArr.map((r) => {
						const result = r.constructorStandings.find(
							(s) => s.constructorRef === c.constructorRef
						);
						return result
							? mapKeys<ChartPoint>(
									pick(result, ['position', 'points', 'wins']),
									(key) => shortKeysMap[key]
							  )
							: null;
					})
				};
			});
			return {
				races: racesArr,
				drivers: driversArr,
				constructors: constructorsArr,
				driversData,
				constructorsData
			};
		}
	};
}

export type RenderProps = Data & ComputedData;

export function render(props: RenderProps) {
	// console.log('props', props);
	return (
		<>
			<div class={css.seasonHeader}>
				{/* <h1>{{year}} Season {{"(Current Season)" if metadata.currentSeason == year }}</h1> */}
				<nav class="{{css.seasonPagination}}">
					{/* {% if pagination.href.previous %}
    <a href="{{pagination.href.previous}}">&larr; {{year - 1}}</a>
    {% endif %}
    {% if pagination.href.next %}
    <a href="{{pagination.href.next}}">{{year + 1}} &rarr;</a>
    {% endif %} */}
				</nav>
			</div>
			<div class="tabs {{css.seasonTabs}}" x-data="tabs">
				<div class="tab-list" role="tablist">
					{/* <div role="tab" class="tab"  @click="goToTab(0)" :class="getActiveClass(0)">Races</div>
    <div role="tab" class="tab"  @click="goToTab(1)" :class="getActiveClass(1)">Driver Positions</div>
    <div role="tab" class="tab"  @click="goToTab(2)" :class="getActiveClass(2)">Driver Points</div>
    <div role="tab" class="tab"  @click="goToTab(3)" :class="getActiveClass(3)">Constructor Positions</div>
    <div role="tab" class="tab"  @click="goToTab(4)" :class="getActiveClass(4)">Constructor Points</div> */}
				</div>
				<div class="tab-panel">{/*% include './_races-table.njk' %*/}</div>
				<div class="tab-panel">
					<div class="{{css.seasonGraph}}">
						<svg class="{{css.positionsChart}}" id="driver-positions"></svg>
					</div>
				</div>
				<div class="tab-panel">
					<div class="{{css.seasonGraph}}">
						<svg class="{{css.pointsChart}}" id="driver-points"></svg>
						<div
							class="tooltip {{css.pointsTooltip}}"
							id="driver-points-tooltip"
							role="tooltip"
						>
							<div class="tooltip-content" x-data="driversPointsTooltip"></div>
							<div class="tooltip-arrow" data-popper-arrow></div>
						</div>
					</div>
				</div>
				<div class="tab-panel">
					<div class="{{css.seasonGraph}}">
						<svg
							class="{{css.positionsChart}}"
							id="constructor-positions"
						></svg>
					</div>
				</div>
				<div class="tab-panel">
					<div class="{{css.seasonGraph}}">
						<svg class="{{css.pointsChart}}" id="constructor-points"></svg>
						<div
							class="tooltip {{css.pointsTooltip}}"
							id="constructor-points-tooltip"
							role="tooltip"
						>
							<div class="tooltip-content">No data available</div>
							<div class="tooltip-arrow" data-popper-arrow></div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
