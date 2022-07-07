/* global Alpine, tableData */
document.addEventListener('alpine:init', () => {
	function normalize(data) {
		if (typeof data === 'string') {
			return data.normalize('NFD');
		}

		return data;
	}

	Alpine.data('tableData', (initSortCol = null, initSortAsc = false) => ({
		data: tableData,
		sortCol: initSortCol,
		sortAsc: initSortAsc,
		init() {
			if (initSortCol) {
				this.sort(initSortCol, initSortAsc);
			}
		},
		sort(col, sortAsc) {
			if (typeof sortAsc === 'boolean') {
				this.sortAsc = sortAsc;
			} else {
				this.sortAsc = this.sortCol === col ? !this.sortAsc : false;
			}

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
