async function handleAsset(input) {
	// console.log('input', input);
}

let buildTime = null;

module.exports = (eleventyConfig) => {
	eleventyConfig.on('eleventy.before', () => {
		buildTime = performance.now();
	});

	// eleventyConfig.on('eleventy.after', () => {
	// 	console.log(ALL_CSS);
	// });
	eleventyConfig.addShortcode('asset', handleAsset);
};
