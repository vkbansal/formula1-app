(function (): void {
	const tabs = document.querySelector('.tabs > .tab-list');
	const tabPanels = document.querySelector('.tabs > .tab-panel-list');

	function setActiveTab(hash: string): void {
		const target = hash.slice(1);

		if (tabPanels) {
			Array.from(tabPanels.children).forEach((e) => {
				const et = e as HTMLElement;

				if (et.id === target) {
					et.classList.add('tab-active');
				} else {
					et.classList.remove('tab-active');
				}
			});
		}

		if (tabs) {
			Array.from(tabs.children).forEach((e) => {
				const et = e as HTMLAnchorElement;

				if (et.href.endsWith(hash)) {
					et.classList.add('tab-active');
				} else {
					et.classList.remove('tab-active');
				}
			});
		}
	}

	if (location.hash.length > 0) {
		setActiveTab(location.hash);
	}

	window.addEventListener('hashchange', () => {
		setActiveTab(location.hash);
	});
})();
