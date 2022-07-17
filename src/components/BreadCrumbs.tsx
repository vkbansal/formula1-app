import { h, type VNode } from 'preact';
import { css } from '@emotion/css';

const container = css`
	width: 100%;
	margin: 1rem auto 0;
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

const breadcrumbs = css`
	display: flex;
	align-items: center;

	& > a,
	& span:last-child {
		display: inline-block;
		font-size: 0.85rem;
		text-decoration: none;
	}

	& > a {
		opacity: 0.75;

		&:hover {
			text-decoration: underline;
		}

		&::after {
			display: inline-block;
			content: '/';
			padding: 0 0.5rem;
		}
	}
`;

export interface BreadCrumbProps {
	links: Array<{ label: string; href: string }>;
}

export function BreadCrumbs(props: BreadCrumbProps): VNode {
	const restLinks = props.links.slice(0, props.links.length - 1);
	const lastLink = props.links.at(-1);

	return (
		<div class={container}>
			<div class={breadcrumbs}>
				<a href="/">🏠</a>
				{restLinks.map((link) => (
					<a href={link.href}>{link.label}</a>
				))}
				{lastLink ? <span>{lastLink.label}</span> : null}
			</div>
		</div>
	);
}
