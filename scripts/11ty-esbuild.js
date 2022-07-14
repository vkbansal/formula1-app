const fs = require('node:fs');
const path = require('node:path');

const esbuild = require('esbuild');
const sass = require('sass');

const builtFiles = new Map();

const prod = process.env.NODE_ENV === 'production';

function handleAsset(input, ALL_CSS) {
	if (builtFiles.has(input)) {
		return builtFiles.get(input);
	}

	const inputPath = path.resolve('src', input);

	if (/\.s?css/.test(input)) {
		const result = sass.compile(inputPath, {
			style: prod ? 'compressed' : 'expanded'
		});
		const out = '/assets/styles.css';
		ALL_CSS.set(input, result.css);

		builtFiles.set(input, out);

		return out;
	} else if (/\.(j|t)sx?/.test(input)) {
		const result = esbuild.buildSync({
			entryPoints: [inputPath],
			outdir: 'public/assets',
			format: 'iife',
			platform: 'browser',
			target: 'es2020',
			minify: prod,
			write: false
		});

		const jsFile = result.outputFiles[0];
		builtFiles.set(input, jsFile.path);

		fs.writeFileSync(jsFile.path, jsFile.text, 'utf8');

		return jsFile.path;
	}
}

module.exports = function eleventyTSData(eleventyConfig, ALL_CSS) {
	eleventyConfig.on('eleventy.before', async () => {
		buildTime = Date.now();
		await fs.promises.mkdir('public/assets', { recursive: true });
	});

	eleventyConfig.on('eleventy.after', async () => {
		const css = [...ALL_CSS.values()].reverse().join('\n');
		await fs.promises.writeFile(
			path.resolve('public/assets/styles.css'),
			css,
			'utf8'
		);
		builtFiles.clear();
	});
	eleventyConfig.addShortcode('assets', (input) => handleAsset(input, ALL_CSS));
};
