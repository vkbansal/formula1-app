import { h } from 'preact';
import type { RenderableProps, VNode } from 'preact';
import { css, cx } from '@emotion/css';

import 'client/styles';

import { Header } from 'components/Header';
import { Footer } from 'components/Footer';

declare module 'preact/src/jsx' {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace JSXInternal {
		interface HTMLAttributes {
			charset?: string;
			crossorigin?: boolean;
		}
	}
}

const contentWrapper = css`
	padding: 1rem 0;
	width: 100%;
	min-height: calc(100vh - var(--header-height) - var(--footer-height));

	@media screen and (max-width: 1239px) {
		padding: 1rem;
	}
`;

export interface MainLayoutProps {
	title: string;
}

export function MainLayout(props: RenderableProps<MainLayoutProps>): VNode {
	const { title } = props;

	return (
		<html lang="en">
			<head>
				<meta charset="utf-8" />
				<title>{title} | F1 statistics</title>
				<meta name="description" content={title} />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
				<link
					href="https://fonts.googleapis.com/css2?family=Noto+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Oswald:wght@200;300;400;500;600;700&display=swap"
					rel="stylesheet"
				/>
				<link rel="stylesheet" href="/assets/styles.css" />
			</head>
			<body>
				<Header />
				<div class={cx('container', contentWrapper)}>{props.children}</div>
				<Footer />
			</body>
		</html>
	);
}
