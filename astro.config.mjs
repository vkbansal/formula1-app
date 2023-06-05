import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify/functions';

export default defineConfig({
	output: 'hybrid',
	experimental: {
		hybridOutput: true,
	},
	adapter: netlify(),
});
