import {
	Chart,
	LineController,
	LineElement,
	PointElement,
	LinearScale,
	CategoryScale,
	Tooltip,
	Legend,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

import type { IChartData } from 'queries/constructor_standings';

declare global {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface Window {
		_roundNames: string[];
		_constructorsChartDataSets: IChartData['datasets'];
		_driversChartDataSets: IChartData['datasets'];
	}
}

Chart.register(
	LineController,
	LineElement,
	PointElement,
	LinearScale,
	CategoryScale,
	Tooltip,
	Legend,
	zoomPlugin,
);

const FONT_FAMILY = '"Roboto Mono", Monaco, "Ubuntu Mono", monospace';
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const COLOR = document.body.parentElement!.dataset.theme === 'dark' ? 'white' : 'black';

function renderStandingsChart(ctx: HTMLCanvasElement, datasets: IChartData['datasets']): void {
	const labelsLength = window._constructorsChartDataSets.map((c) => c.label.length);
	const MAX_LABEL_LENGTH = Math.max(...labelsLength);
	const points = datasets.flatMap((c) => c.data.map((d) => d.points || 0));
	const MAX_POINTS = Math.max(...points);
	const BASE = Math.pow(10, Math.ceil(Math.log10(MAX_POINTS)) - 1);

	const chart = new Chart(ctx, {
		type: 'line',
		options: {
			responsive: true,
			datasets: {
				line: {
					borderWidth: 3,
				},
			},
			elements: {
				point: {
					radius: 4,
				},
			},
			aspectRatio: 2,
			maintainAspectRatio: true,
			animation: false,
			parsing: {
				xAxisKey: 'points',
				yAxisKey: 'points',
			},
			interaction: {
				axis: 'y',
				mode: 'index',
			},
			scales: {
				x: {
					ticks: {
						color: COLOR,
						font: {
							family: FONT_FAMILY,
							size: 13,
						},
					},
					grid: {
						color: 'slategrey',
					},
				},
				y: {
					ticks: {
						color: COLOR,
						font: {
							family: FONT_FAMILY,
							size: 13,
						},
					},
					grid: {
						color: 'slategrey',
					},
				},
			},
			plugins: {
				legend: {
					display: true,
					position: 'bottom',
					labels: {
						color: COLOR,
						padding: 10,
						boxWidth: 12,
						font: {
							family: FONT_FAMILY,
							size: 13,
						},
					},
				},
				tooltip: {
					position: 'nearest',
					bodySpacing: 8,
					boxWidth: 2,
					bodyFont: { size: 13, family: FONT_FAMILY },
					itemSort(a, b): number {
						return (b.raw as DataPoint).points - (a.raw as DataPoint).points;
					},
					callbacks: {
						label(item): string {
							const { dataIndex, dataset } = item;
							const raw = item.raw as DataPoint;
							const prevData = dataset.data[dataIndex - 1] as unknown as DataPoint;
							let updateText = '';

							if (prevData) {
								if (prevData.position > raw.position) {
									updateText = `⬆️ ${prevData.position - raw.position}`;
								} else if (prevData.position < raw.position) {
									updateText = `⬇️ ${raw.position - prevData.position}`;
								}
							}

							const label = dataset.label?.padEnd(MAX_LABEL_LENGTH, ' ');
							const position = raw.position.toString().padStart(2, ' ');
							const points = raw.points.toString().padStart(3, ' ');

							return ` ${position}. ${label} - ${points} Points (${raw.wins} Wins) ${updateText}`;
						},
					},
				},
				zoom: {
					pan: {
						enabled: true,
					},
					zoom: {
						drag: {
							enabled: true,
							modifierKey: 'alt',
						},
					},
					limits: { y: { min: 0, max: Math.ceil(MAX_POINTS / BASE) * BASE } },
				},
			},
		},
		data: {
			labels: window._roundNames,
			datasets,
		},
	});

	const themeToggle = document.getElementById('theme-toggle') as HTMLInputElement;

	if (themeToggle) {
		themeToggle.addEventListener('change', function () {
			const color = this.checked ? 'white' : 'black';

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			chart.options.scales!.x!.ticks!.color = color;
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			chart.options.scales!.y!.ticks!.color = color;
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			chart.options.plugins!.legend!.labels!.color = color;
			chart.update();
		});
	}

	document.getElementById('reset-zoom')?.addEventListener('click', () => {
		chart.resetZoom();
	});
}

const ctx1 = document.getElementById('driver-standings-chart') as HTMLCanvasElement;
const ctx2 = document.getElementById('constructor-standings-chart') as HTMLCanvasElement;

renderStandingsChart(ctx1, window._driversChartDataSets);
renderStandingsChart(ctx2, window._constructorsChartDataSets);

interface DataPoint {
	points: number;
	position: number;
	wins: number;
}
