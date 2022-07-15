import { h, type VNode } from 'preact';
import { css } from '@emotion/css';

import type { PreactThis } from 'types/11ty';

const main = css`
	padding: 1rem 0;
	width: 100%;
	border-top: 1px solid var(--divider);
	height: var(--footer-height);

	& > .container {
		font-size: 0.75rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		height: 100%;
	}

	p {
		margin: 0;
	}
`;

export function Footer(this: PreactThis): VNode {
	return (
		<footer class={main}>
			<div class="container">
				<p>
					Made with ❤️ by <a href="https://vkbansal.me/">Vivek Kumar Bansal</a>
				</p>
				<div class="last-updated">
					<span>Last updated at:&nbsp;</span>
					<span id="last-updated"></span>
					<span>(Local Time)</span>
				</div>
			</div>
			<script
				defer
				type="text/javascript"
				dangerouslySetInnerHTML={{
					__html: `document.getElementById('last-updated').innerHTML = new Date(${this.context.eleventy.buildTime}).toLocaleString()`,
				}}
			/>
		</footer>
	);
}
