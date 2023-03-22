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
document.addEventListener('readystatechange', () => {
	// Animation containers
	const animationContainer = document.getElementById('animation-container') as HTMLDivElement;
	const lapsContainer = document.getElementById('laps-container') as HTMLDivElement;
	const drivers = document.querySelector<HTMLDivElement>('.drivers-container');
	const lapContainers = document.querySelectorAll('.lap-container');

	// Control Elements
	const animProgress = document.getElementById('animation-progress') as HTMLInputElement;
	const playPauseBtn = document.getElementById('play-pause') as HTMLButtonElement;
	const resetBtn = document.getElementById('reset') as HTMLButtonElement;
	const lapCount = document.getElementById('lap-count') as HTMLSpanElement;

	// Other Variables
	const statusValues = Object.values(Status);

	const lapsObserver = new IntersectionObserver(lapsObserverCallback, {
		root: lapsContainer,
		threshold: 1,
	});

	lapContainers.forEach((lap) => lapsObserver.observe(lap));

	/**
	 * Updates the driver positions based on the current lap
	 */
	function lapsObserverCallback(entries: IntersectionObserverEntry[]): void {
		// Find the lap which is 100% visible. This is considered as the active lap.
		const lapContainer = entries.find((entry) => entry.intersectionRatio === 1);

		// if a lap is 100% visible
		if (lapContainer) {
			// get the current lap
			const currentLap = (lapContainer.target as HTMLDivElement).dataset.lap || '';
			const parsedLap = parseInt(currentLap);

			// update drivers dataset with current lap
			if (drivers) {
				drivers.dataset.lap = currentLap;
			}

			// if its the starting lap
			if (currentLap === 'start') {
				// update progress controls
				animProgress.value = '0';
				lapCount.innerHTML = '0';

				// update each driver's `y` position with grid position
				window._raceData.driversData.map(({ driverRef, grid }) => {
					const driverDiv = document.querySelector<HTMLDivElement>(
						`[data-driverId="${driverRef}"]`,
					);

					if (driverDiv) {
						// update driver's `y` position with grid position
						driverDiv.style.setProperty('--y', grid.toString());

						// reset driver statuses
						delete driverDiv.dataset.status;
						delete driverDiv.dataset.pitStop;
					}
				});
				// if its the lap after finish
			} else if (currentLap === 'finish') {
				// update progress controls
				animProgress.value = lapContainers.length.toString();
				lapCount.innerHTML = (lapContainers.length - 2).toString();

				// update each driver's `y` position with final position
				window._raceData.driversData.map(({ driverRef, positionOrder, positionText }) => {
					const driverDiv = document.querySelector<HTMLDivElement>(
						`[data-driverId="${driverRef}"]`,
					);

					if (driverDiv) {
						// update driver's `y` position with final position
						driverDiv.style.setProperty('--y', positionOrder.toString());

						// update driver's status with final position
						driverDiv.dataset.status = positionText;

						// reset driver pitstop status
						delete driverDiv.dataset.pitStop;
					}
				});
			} else if (!Number.isNaN(parsedLap)) {
				// update progress controls
				animProgress.value = currentLap;
				lapCount.innerHTML = currentLap;

				// update each driver's `y` position with active lap's position
				window._raceData.driversData.forEach(
					({ driverRef, lapPositions, positionText, pitStops, positionOrder }) => {
						const driverDiv = document.querySelector<HTMLDivElement>(
							`[data-driverId="${driverRef}"]`,
						);

						if (driverDiv) {
							// get drivers position in current lap
							const position = lapPositions[parsedLap];

							// reset driver statuses
							delete driverDiv.dataset.status;
							delete driverDiv.dataset.pitStop;

							if (position) {
								// if position is found,
								// update the `y` position with position in current lap
								driverDiv.style.setProperty('--y', position.toString());

								// check for pit-stop in current lap
								const pitStop = pitStops.find((p) => p.lap === parsedLap);

								// if pit-stop found, update pitstop status
								if (pitStop) {
									driverDiv.dataset.pitStop = pitStop.stop.toString();
								}
							} else {
								// if position is not found,
								// update driver's `y` position with final position
								driverDiv.style.setProperty('--y', positionOrder.toString());

								// check for status, if found, update it
								if (statusValues.includes(positionText as Status)) {
									driverDiv.dataset.status = positionText;
								}
							}
						}
					},
				);
			}
		}
	}

	const lapDiv = lapContainers[0].getBoundingClientRect();
	const lapsContainerDiv = lapsContainer.getBoundingClientRect();
	// Animation duration for each lap
	const LAP_ANIMATION_DURATION = 500;
	// ratio of individual lap to the container
	const LAP_WIDTH_RATIO = lapDiv.width / lapsContainerDiv.width;
	// scroll rate calculated based on lap width and the animation duration
	const SCROLL_RATE = lapDiv.width / LAP_ANIMATION_DURATION;

	// refs used by animation
	let lastUpdateTime = 0;
	let rafRef = 0;

	/**
	 * Stops/Pauses Animation
	 */
	const stopAnimation = (): void => {
		delete animationContainer.dataset.status;

		playPauseBtn.innerText = 'Play';
		window.cancelAnimationFrame(rafRef);
		lastUpdateTime = 0;
	};

	/**
	 * Resumes Animation
	 */
	const resumeAnimation = (): void => {
		animationContainer.dataset.status = 'playing';

		playPauseBtn.innerText = 'Pause';
		rafRef = window.requestAnimationFrame(animateLap);
	};

	/**
	 * Toggles animation status based on current state
	 */
	const toggleAnimation = (): void => {
		if (!animationContainer || !lapsContainer) {
			return;
		}

		const isPlaying = animationContainer.dataset.status === 'playing';

		if (isPlaying) {
			stopAnimation();
		} else {
			resumeAnimation();
		}
	};

	/**
	 * Animation callback used with requestAnimationFrame,
	 * for animating laps
	 */
	const animateLap = (time: DOMHighResTimeStamp): void => {
		if (!lastUpdateTime) {
			lastUpdateTime = time;
			rafRef = window.requestAnimationFrame(animateLap);
			return;
		}

		if (lastUpdateTime) {
			const diff = time - lastUpdateTime;
			lastUpdateTime = time;
			const prevLeft = lapsContainer.scrollLeft;
			const newLeft = prevLeft + SCROLL_RATE * diff;

			lapsContainer.scrollLeft = newLeft;

			if (lapsContainer.scrollLeft === prevLeft) {
				stopAnimation();
				return;
			}

			rafRef = window.requestAnimationFrame(animateLap);
		}
	};

	// toggle animation button
	playPauseBtn.addEventListener('click', toggleAnimation);

	// reset button
	resetBtn.addEventListener('click', () => {
		stopAnimation();
		lapsContainer.scrollLeft = 0;
	});

	// slider input change
	animProgress.addEventListener('input', (e) => {
		if (!e.target) {
			return;
		}

		stopAnimation();

		const { value } = e.target as HTMLInputElement;

		const parsedValue = parseInt(value, 10);

		if (Number.isNaN(parsedValue)) {
			return;
		}

		if (parsedValue === 0) {
			lapsContainer.scrollLeft = 0;
		} else {
			lapsContainer.scrollLeft = lapDiv.width * LAP_WIDTH_RATIO * (parsedValue - 0.5);
		}
	});
});
