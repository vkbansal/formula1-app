import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';

// https://astro.build/config
export default defineConfig({
	// https://docs.astro.build/en/reference/configuration-reference/
	outDir: './public',
	publicDir: './src/static',
	server: { port: 4000 },
	integrations: [preact()],
});
