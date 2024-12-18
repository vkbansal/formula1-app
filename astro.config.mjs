import preact from '@astrojs/preact';
import vercel from '@astrojs/vercel/serverless';
import { defineConfig } from 'astro/config';

export default defineConfig({
	output: 'hybrid',
	adapter: vercel({
		webAnalytics: {
			enabled: true,
		},
	}),
	integrations: [preact()],
});
