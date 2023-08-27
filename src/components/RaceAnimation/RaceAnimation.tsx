import type { FunctionComponent } from 'preact';
import type { CollectionEntry } from 'astro:content';
import { useEffect, useMemo, useState } from 'preact/hooks';

import { constructorColors } from '~/data/colors.js';

import { CarIcon } from './CarIcon';
import styles from './RaceAnimation.module.scss';

const CAR_SIZE = 35;

type IRaceGridData = CollectionEntry<'rounds'>['data']['driversData'];

enum PlayState {
	Playing = 'Playing',
	Paused = 'Paused',
}

interface IProps {
	raceGridData: IRaceGridData;
	drivers: Record<string, CollectionEntry<'drivers'>['data']>;
	constructors: Record<string, CollectionEntry<'constructors'>['data']>;
}

export const RaceAnimation: FunctionComponent<IProps> = ({
	raceGridData,
	drivers,
	constructors,
}) => {
	console.log('raceGridData', raceGridData);
	const totalLaps = useMemo(
		() => Math.max(...raceGridData.map((d) => d.lapPositions.length)),
		[raceGridData],
	);
	const totalDrivers = raceGridData.length;
	const [playingState, setPlayingState] = useState(PlayState.Paused);
	const [currentLap, setCurrentLap] = useState<'start' | 'finish' | number>(
		'start',
	);
	const [lapsContainer, setLapsContainer] = useState<HTMLDivElement | null>(
		null,
	);

	const togglePlayPause = (): void => {
		setPlayingState((old) =>
			old === PlayState.Paused ? PlayState.Playing : PlayState.Paused,
		);
	};

	useEffect(() => {
		function lapsObserverCallback(entries: IntersectionObserverEntry[]): void {
			const lapContainer = entries.find(
				(entry) => entry.intersectionRatio === 1,
			);

			if (lapContainer) {
				// get the current lap
				const currentLap =
					(lapContainer.target as HTMLDivElement).dataset.lap || '';
				const parsedLap = parseInt(currentLap);

				if (!Number.isNaN(parsedLap)) {
					setCurrentLap(parsedLap);
				} else if (currentLap === 'start' || currentLap === 'finish') {
					setCurrentLap(currentLap);
				}
			}
		}

		const lapsObserver = new IntersectionObserver(lapsObserverCallback, {
			root: lapsContainer,
			threshold: 1,
		});

		return () => {
			lapsObserver.disconnect();
		};
	}, [lapsContainer]);

	return (
		<div>
			<CarIcon />
			<div
				class={styles['animation-container']}
				style={{
					'--car-size': `${CAR_SIZE}px`,
					'--total-drivers': totalDrivers,
				}}
			>
				<div class={styles['center-line']}></div>
				<div ref={setLapsContainer} class={styles['laps-container']}>
					<div class={styles['lap-container']} data-lap="start"></div>
					{Array.from({ length: totalLaps }, (_, i) => {
						return <div class={styles['lap-container']} data-lap={i + 1} />;
					})}
					<div class={styles['lap-container']} data-lap="finish"></div>
				</div>
				<div id="drivers-container" class={styles['drivers-container']}>
					{raceGridData.map(({ driverRef, grid, constructorRef }) => {
						const driver = drivers[driverRef];
						const label = `${driver?.name} (${constructors[constructorRef]?.name})`;

						return (
							<div
								class={styles['driver']}
								data-label={label}
								data-driverId={driverRef}
								style={{
									'--x': 0,
									'--y': grid,
									color: constructorColors[constructorRef] || 'white',
								}}
							>
								<div class={styles['pit-stop']}>IN PIT</div>
								<svg width="40" height="40" version="2.0">
									<use href="#f1-car" />
								</svg>
							</div>
						);
					})}
				</div>
			</div>
			<div class={styles['animation-controls']}>
				<div class={styles['lap-progress']}>
					<input
						id="animation-progress"
						type="range"
						min="0"
						max={totalLaps + 1}
						step="1"
						value="0"
					/>
					<span class={styles['lap-counter']}>
						<span id="lap-count">0</span>
						<span>/</span>
						<span>{totalLaps}</span>
					</span>
				</div>
				<div class={styles['control-btns']}>
					<button type="button" id="reset">
						Reset
					</button>
					<button type="button" onClick={togglePlayPause}>
						Play
					</button>
				</div>
			</div>
		</div>
	);
};
