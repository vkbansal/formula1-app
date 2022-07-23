import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import { load } from 'js-yaml';

const YAML_FILE_REGEX = /\.ya?ml$/;

// https://astro.build/config
export default defineConfig({
	// https://docs.astro.build/en/reference/configuration-reference/
	outDir: './public',
	publicDir: './src/static',
	integrations: [preact()],
	vite: {
		plugins: [
			{
				name: 'yaml-plugin',
				transform(src, id) {
					if (YAML_FILE_REGEX.test(id)) {
						return {
							code: `export default ${JSON.stringify(load(src))}`,
							map: null,
						};
					}
				},
			},
		],
	},
});
