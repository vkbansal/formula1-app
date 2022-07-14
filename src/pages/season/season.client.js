/* global Alpine, driversData, constructorsData, */
import { initializeTabs } from '../../common-client/alpine-tabs';
import { drawPointsChart } from './charts/points-chart';
import './charts/positions-chart';

// drawPointsChart('#driver-points', driversData, 'Driver');
// drawPointsChart('#constructor-points', constructorsData, 'Constructor');

document.addEventListener('alpine:init', () => {
	console.log('alpine:init');
	initializeTabs();
	Alpine.data('driversPointsTooltip', () => ({
		hasResults: false,
		updateData(data) {
			if ('hasResults' in data) {
				this.hasResults = data.hasResults;
			}
		},
		init() {
			drawPointsChart({
				target: '#driver-points',
				chartData: driversData,
				alpine: this
			});
		}
	}));
});
