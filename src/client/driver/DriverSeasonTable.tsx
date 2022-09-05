import { h, type VNode } from 'preact';
import cx from 'classnames';
import { formatOrdinals } from 'helpers/utils';
import type { Driver } from 'helpers/data';

export interface DriverSeasonTableProps {
	maxRounds: number;
	driver: Driver;
}

export function DriverSeasonTable(props: DriverSeasonTableProps): VNode {
	const { maxRounds, driver } = props;
	const maxRoundsArr = Array.from({ length: maxRounds });

	return (
		<table class="table table-sm">
			<thead>
				<tr class="table-divider">
					<th>Season</th>
					<th>Constructor</th>
					{maxRoundsArr.map((_, i) => (
						<th class="text-center">R{i + 1}</th>
					))}
					<th class="text-center">WDC</th>
				</tr>
			</thead>
			<tbody>
				{driver.seasons.flatMap((season) => {
					const wdcStanding = driver.championshipStandings.find((c) => c.year === season.year);
					const constructorsInSeason = [...new Set(season.results.map((r) => r.constructor))];

					return constructorsInSeason.map((con, i) => {
						const results = season.results.filter((r) => r.constructor === con);

						return (
							<tr class={cx({ 'table-divider': i === constructorsInSeason.length - 1 })}>
								{i === 0 ? <th rowSpan={constructorsInSeason.length}>{season.year}</th> : null}
								<td class="constructor-name-cell">{con}</td>
								{maxRoundsArr.map((_, i) => {
									const round = results.find((r) => r.round === i + 1);

									if (i + 1 > season.results.length) {
										return <td class="text-center">-</td>;
									}

									if (!round) {
										return <td class="text-center">-</td>;
									}

									return (
										<td class="text-center">
											<div>{round.position ? formatOrdinals(round.position) : '-'}</div>
										</td>
									);
								})}
								{i === 0 ? (
									<td class="text-center" rowSpan={constructorsInSeason.length}>
										{wdcStanding ? formatOrdinals(wdcStanding.position) : '-'}
									</td>
								) : null}
							</tr>
						);
					});
				})}
			</tbody>
		</table>
	);
}
