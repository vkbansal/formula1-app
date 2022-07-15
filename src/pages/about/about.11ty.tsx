import { MainLayout } from 'layouts/MainLayout';
import { h } from 'preact';

export function getData() {
	return {
		permalink: 'about/',
	};
}

export function render() {
	return (
		<MainLayout title="about">
			<h1>About</h1>
			<h2>Objective</h2>
			<p>
				The main objective of this project is to be restricted as a{' '}
				<strong>static site</strong> and provide some statistics and data
				visualisations around <strong>The Formula 1 World Championship</strong>.
			</p>
			<br />
			<h2>Data source</h2>
			<p>
				Data is taken from{' '}
				<a href="http://ergast.com/mrd/" target="_blank">
					Ergast developer API
				</a>
				.
			</p>
			<br />
			<h2>Contributing</h2>
			<p>
				The code for this project is open-source and is available on{' '}
				<a href="https://github.com/vkbansal/formula1-app" target="_blank">
					GitHub
				</a>
				. You are welcome to submit ideas and issues.
			</p>
		</MainLayout>
	);
}
