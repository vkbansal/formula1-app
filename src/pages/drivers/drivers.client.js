/* global Alpine, tableData, currentDrivers */
import { normalize } from '../../common-client/helpers';

document.addEventListener('alpine:init', () => {
	Alpine.data('tableData', () => ({
		data: [],
		currentDrivers: [],
		selectedGroup: null,
		groupedData: {},
		sortCol: null,
		sortAsc: false,
		init() {
			this.groupedData = tableData.reduce((obj, row) => {
				const groupKey = normalize(row.name.charAt(0)).toUpperCase();

				if (currentDrivers.includes(row.driverRef)) {
					this.currentDrivers.push(row);
				}

				if (!Array.isArray(obj[groupKey])) {
					obj[groupKey] = [];
				}

				obj[groupKey].push(row);

				return obj;
			}, {});

			const hash = window.location.hash.slice('1').toUpperCase();
			this.changeGroup(hash);
		},
		changeGroup(key) {
			if (key in this.groupedData) {
				this.data = this.groupedData[key];
				this.selectedGroup = key;
				this.sortCol = null;
			} else {
				this.data = this.currentDrivers;
				this.selectedGroup = null;
				this.sortCol = null;
			}
		},
		sort(col) {
			this.sortAsc = this.sortCol === col ? !this.sortAsc : false;
			this.sortCol = col;

			this.data.sort((a, b) => {
				if (normalize(a[col]) < normalize(b[col])) {
					return this.sortAsc ? -1 : 1;
				}

				if (normalize(a[col]) > normalize(b[col])) {
					return this.sortAsc ? 1 : -1;
				}

				return 0;
			});
		}
	}));
});
