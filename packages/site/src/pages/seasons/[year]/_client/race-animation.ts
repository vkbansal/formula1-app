import type { IRaceData } from 'f1db/types/rounds';

enum Status {
	RETIRED = 'R',
	DISQUALIFIED = 'D',
	EXCLUDED = 'E',
	FAILED_TO_QUALIFY = 'F',
	NOT_CLASSIFIED = 'N',
}

declare global {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface Window {
		_raceData: IRaceData;
	}
}

const main = document.querySelector<HTMLDivElement>('.laps-container');
const drivers = document.querySelector<HTMLDivElement>('.drivers-container');
const status_values = Object.values(Status);

const io_main = new IntersectionObserver(
	(entries) => {
		const lap_container = entries.find((entry) => entry.intersectionRatio === 1);

		if (lap_container) {
			const currentLap = (lap_container.target as HTMLDivElement).dataset.lap || '';
			const parsedLap = parseInt(currentLap);

			if (drivers) {
				drivers.dataset.lap = currentLap;
			}

			if (currentLap === 'start') {
				window._raceData.driversData.map(({ driverRef, grid }) => {
					const driverDiv = document.querySelector<HTMLDivElement>(
						`[data-driverId="${driverRef}"]`,
					);
					if (driverDiv) {
						driverDiv.style.setProperty('--y', grid.toString());
						delete driverDiv.dataset.status;
						delete driverDiv.dataset.pitStop;
					}
				});
			} else if (currentLap === 'finish') {
				//
				window._raceData.driversData.map(({ driverRef, positionOrder, positionText }) => {
					const driverDiv = document.querySelector<HTMLDivElement>(
						`[data-driverId="${driverRef}"]`,
					);
					if (driverDiv) {
						driverDiv.style.setProperty('--y', positionOrder.toString());
						driverDiv.dataset.status = positionText;
						delete driverDiv.dataset.pitStop;
					}
				});
			} else if (!Number.isNaN(parsedLap)) {
				window._raceData.driversData.forEach(
					({ driverRef, lapPositions, positionText, pitStops, positionOrder }) => {
						const driverDiv = document.querySelector<HTMLDivElement>(
							`[data-driverId="${driverRef}"]`,
						);

						if (driverDiv) {
							const position = lapPositions[parsedLap];
							delete driverDiv.dataset.status;

							if (position) {
								driverDiv.style.setProperty('--y', position.toString());

								const pitStop = pitStops.find((p) => p.lap === parsedLap);

								if (pitStop) {
									driverDiv.dataset.pitStop = pitStop.stop.toString();
								} else if (driverDiv.dataset.pitStop) {
									delete driverDiv.dataset.pitStop;
								}
							} else {
								driverDiv.style.setProperty('--y', positionOrder.toString());
								if (status_values.includes(positionText as Status)) {
									driverDiv.dataset.status = positionText;
								}
							}
						}
					},
				);
			}
		}
	},
	{ root: main, threshold: 1 },
);

const lap_containers = document.querySelectorAll('.lap-container');

lap_containers.forEach((l) => io_main.observe(l));
