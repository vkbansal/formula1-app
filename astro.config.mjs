import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import netlify from '@astrojs/netlify/functions';

export default defineConfig({
	output: 'hybrid',
	adapter: netlify({
		builders: true,
		functionPerRoute: true,
	}),
	integrations: [preact()],
});
