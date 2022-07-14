/* global Alpine */
export function initializeTabs(name = 'tabs') {
	Alpine.data(name, (initActive = 0) => ({
		activeTab: initActive,
		goToTab(tab) {
			this.activeTab = tab;
		},
		getActiveClass(tab) {
			if (tab === this.activeTab) {
				return 'tab-active';
			}

			return '';
		}
	}));
}
