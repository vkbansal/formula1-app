import { h, type VNode } from 'preact';

import { MainLayout } from 'layouts/MainLayout';
import { loadJsonFromDir, readJson } from 'helpers/readJson';
import type { CommonData, CommonTemplateConfig, PreactThis } from 'types/11ty';
import type { F1Driver, F1SeasonDriver } from 'types/data';
import { BreadCrumbs } from 'components/BreadCrumbs';
import { pick } from 'helpers/objectHelpers';

export interface DriverData extends Omit<F1Driver, 'championshipStandings'> {
	championships: number;
}

export interface ExtraPageData {
	allDrivers: Record<'string', DriverData[]>;
}

export interface ComputedData {
	currentDrivers: DriverData[];
}

function toDriverData({
	championshipStandings,
	...rest
}: F1Driver): DriverData {
	return {
		...rest,
		championships: championshipStandings.filter((c) => c.position === 1).length,
	};
}

export async function getData(): Promise<
	CommonTemplateConfig<ExtraPageData, ComputedData>
> {
	const allDriversData = await loadJsonFromDir<F1Driver>('data/drivers');

	const allDrivers = Object.values(allDriversData)
		.map<DriverData>(toDriverData)
		.reduce<Record<string, DriverData[]>>((acc, curr) => {
			const key = curr.name.normalize('NFD').toLowerCase().charAt(0);

			if (!Array.isArray(acc[key])) {
				acc[key] = [];
			}

			acc[key].push(curr);

			return acc;
		}, {});

	return {
		permalink: 'drivers/',
		allDrivers,
		eleventyComputed: async (data): Promise<ComputedData> => {
			const currentDriversData = await readJson<F1SeasonDriver[]>(
				`data/seasons/${data.metadata.currentSeason}/drivers.json`,
			);

			const currentDrivers = Object.values(
				pick(
					allDriversData,
					currentDriversData.map((d) => d.driverRef),
				),
			).map(toDriverData);

			return { currentDrivers };
		},
	};
}

export type RenderProps = CommonData & ExtraPageData & ComputedData;

export function render(this: PreactThis, props: RenderProps): VNode {
	const { allDrivers, currentDrivers, metadata } = props;

	return (
		<MainLayout title="Drivers">
			<BreadCrumbs links={[{ label: 'Drivers', href: '' }]} />
			<h1>Drivers</h1>
			<div id="table-target"></div>
			<script
				defer
				type="text/javascript"
				dangerouslySetInnerHTML={{
					__html: [
						`const currentSeason = ${JSON.stringify(metadata.currentSeason)}`,
						`const allDrivers = ${JSON.stringify(allDrivers)};`,
						`const currentDrivers = ${JSON.stringify(currentDrivers)}`,
					].join('\n'),
				}}
			/>
			<script
				defer
				type="text/javascript"
				src={this.context.filters.assets(
					'pages/drivers/client/index.tsx',
					'drivers',
				)}
			/>
		</MainLayout>
	);
}
