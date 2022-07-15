import { h, type VNode } from 'preact';

import { BreadCrumbs } from 'components/BreadCrumbs';
import { MainLayout } from 'layouts/MainLayout';
import type { CommonData, CommonTemplateConfig } from 'types/11ty';

import * as css from './seasons.styles';

export function getData(): CommonTemplateConfig {
	return {
		permalink: 'seasons/',
	};
}

export type RenderProps = CommonData;

export function render(props: RenderProps): VNode {
	const { seasons, metadata } = props;
	const extraBoxes = Array.from({ length: (seasons.length % 7) + 1 });
	const reverseSeasons = [...seasons].reverse();

	return (
		<MainLayout title="Seasons">
			<BreadCrumbs links={[{ label: 'Seasons', href: '' }]} />
			<h1>Formula 1 Seasons</h1>
			<br />
			<p class="text-2">* - Current Season</p>
			<section class={css.seasonsGrid}>
				{reverseSeasons.map((season) => (
					<h2 class={css.seasonCard}>
						<a href={`/seasons/${season}/`}>
							{season}
							{metadata.currentSeason === season ? '*' : ''}
						</a>
					</h2>
				))}
				{extraBoxes.map(() => (
					<div class={css.seasonCard} />
				))}
			</section>
		</MainLayout>
	);
}
