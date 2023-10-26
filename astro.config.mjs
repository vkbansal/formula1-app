import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
	output: 'hybrid',
	adapter: vercel({
		webAnalytics: {
			enabled: true
		}
	}),
	integrations: [preact()],
});
