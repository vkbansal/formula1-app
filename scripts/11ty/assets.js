const fs = require('node:fs');
const path = require('node:path');

const esbuild = require('esbuild');

const prod = process.env.NODE_ENV === 'production';

const builtFiles = new Map();

function handleAsset(input, output) {
	if (builtFiles.has(input)) {
		return builtFiles.get(input);
	}

	const inputPath = path.resolve('src', input);

	const result = esbuild.buildSync({
		entryPoints: output ? { [output]: inputPath } : [inputPath],
		outdir: 'public/assets',
		publicPath: '/',
		bundle: true,
		format: 'iife',
		platform: 'browser',
		jsxFactory: 'h',
		jsxFragment: 'Fragment',
		target: 'es2020',
		minify: prod,
		write: false,
	});

	const jsFile = result.outputFiles[0];
	const outputPath =
		'/' + path.relative(path.resolve(process.cwd(), 'public'), jsFile.path);

	builtFiles.set(input, outputPath);

	fs.writeFileSync(jsFile.path, jsFile.text, 'utf8');

	return outputPath;
}

module.exports = function eleventyTSData(eleventyConfig) {
	eleventyConfig.on('eleventy.before', async () => {
		await fs.promises.mkdir('public/assets', { recursive: true });
	});

	eleventyConfig.on('eleventy.after', async () => {
		// eslint-disable-next-line no-console
		console.log('Assets building complete');
		builtFiles.clear();
	});
	eleventyConfig.addShortcode('assets', handleAsset);
};
