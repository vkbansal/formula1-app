import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

import sqlPlugin from './scripts/vite-sql-plugin.mjs';

// https://astro.build/config
export default defineConfig({
	// https://docs.astro.build/en/reference/configuration-reference/
	outDir: './public',
	publicDir: './src/static',
	integrations: [preact()],
	vite: {
		plugins: [sqlPlugin()],
	},
});
