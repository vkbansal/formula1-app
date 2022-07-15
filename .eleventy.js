const { Window } = require('happy-dom');

const eleventyPreact = require('./scripts/11ty/preact-renderer');
const eleventyTSData = require('./scripts/11ty/ts-data');
const eleventyAssets = require('./scripts/11ty/assets');
const eleventyCSS = require('./scripts/11ty/css');

const window = new Window();

/**
 *  @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig
 *  @returns {ReturnType<import("@11ty/eleventy/src/defaultConfig")>}
 */
module.exports = (eleventyConfig) => {
	eleventyPreact(eleventyConfig, window);
	eleventyAssets(eleventyConfig);
	eleventyTSData(eleventyConfig);

	eleventyConfig.addWatchTarget('src/pages/**/*.tsx');
	eleventyConfig.addWatchTarget('src/pages/**/*.ts');

	eleventyConfig.on('eleventy.after', async () => {
		const styles = window.document.querySelectorAll('style');
		const css = styles.map((s) => s.innerHTML);

		await eleventyCSS(css);

		styles.forEach((s) => s.remove());
	});

	return {
		dir: {
			input: 'src/pages',
			output: 'public',
			data: '../11ty-global-data',
			layouts: '../layouts',
		},
	};
};
