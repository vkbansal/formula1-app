const fs = require('node:fs');

const postcss = require('postcss');
const cssnano = require('cssnano');
const preset = require('cssnano-preset-default');

module.exports = async (css) => {
	const cssString = [...new Set(css)].join('\n');

	const result = await postcss([cssnano({ preset })]).process(cssString, {
		from: undefined,
	});

	await fs.promises.writeFile('public/assets/styles.css', result.css, 'utf8');
};
