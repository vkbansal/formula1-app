import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify/functions';

export default defineConfig({
	output: 'hybrid',
	build: {
		inlineStylesheets: 'auto',
	},
	adapter: netlify({
		builders: true,
	}),
});
