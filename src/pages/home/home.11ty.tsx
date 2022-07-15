import { h, type VNode } from 'preact';

import { MainLayout } from 'layouts/MainLayout';
import { readJson } from 'helpers/readJson';
import type { F1RaceByCountry } from 'types/data';
import type { CommonData, CommonTemplateConfig } from 'types/11ty';

import * as css from './home.styles';

export interface Data {
	numOfEntities: Record<string, number>;
	racesByCountry: Record<string, number>;
}

export async function getData(): Promise<Data & CommonTemplateConfig> {
	const numOfEntities = await readJson<Record<string, number>>(
		'data/entities-count.json',
	);

	const racesByCountry = await readJson<F1RaceByCountry[]>(
		'data/races-by-country.json',
	);

	return {
		permalink: '/',
		numOfEntities,
		racesByCountry: racesByCountry.reduce<Record<string, number>>(
			(p, c) => ({ ...p, [c.country]: c.count }),
			{},
		),
	};
}

export type RenderProps = Data & CommonData;

export function render(props: RenderProps): VNode {
	const { numOfEntities } = props;

	return (
		<MainLayout title="Home">
			<div class={css.wrapper}>
				<section class={css.section}>
					A total of&nbsp;
					<a class={css.link} href="/seasons">
						{numOfEntities.seasons - 1} Seasons
					</a>
					&nbsp;of&nbsp;&nbsp;
					<span class={css.fact}>The Formula 1 World Championships</span>
					&nbsp;have been held till date.&nbsp;
					<a class={css.link} href="/drivers">
						{numOfEntities.drivers} Drivers
					</a>
					&nbsp;from&nbsp;
					<span class={css.fact}>
						{numOfEntities.driverNationalities} countries
					</span>
					&nbsp;and&nbsp;
					<a class={css.link} href="/constructors">
						{numOfEntities.constructors} Constructors
					</a>
					&nbsp;from&nbsp;
					<span class={css.fact}>
						{numOfEntities.constructorNationalities} countries
					</span>
					&nbsp;have participated in&nbsp;
					<span class={css.fact}>{numOfEntities.races} Grand Prix</span>
					&nbsp;races on&nbsp;
					<span class={css.fact}>{numOfEntities.circuits} Circuits</span>
					&nbsp;across&nbsp;
					<span class={css.fact}>{numOfEntities.circuitCountries} Nations</span>
					&nbsp;.
				</section>
			</div>
		</MainLayout>
	);
}
