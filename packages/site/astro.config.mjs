import { defineConfig } from 'astro/config';
import { netlifyEdgeFunctions } from '@astrojs/netlify';

export default defineConfig({
	output: 'server',
	adapter: netlifyEdgeFunctions(),
});
