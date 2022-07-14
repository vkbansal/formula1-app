const path = require('node:path');
const fs = require('node:fs');
const dateFns = require('date-fns');
const { snakeCase } = require('change-case');
const eleventyPreact = require('./scripts/11ty-preact');
const eleventyTSData = require('./scripts/11ty-ts-data');
const eleventyESBuild = require('./scripts/11ty-esbuild');

const ALL_CSS = new Map();

/**
 *  @param {import("@11ty/eleventy/src/UserConfig")} eleventyConfig
 *  @returns {ReturnType<import("@11ty/eleventy/src/defaultConfig")>}
 */
module.exports = (eleventyConfig) => {
	eleventyPreact(eleventyConfig, ALL_CSS);
	eleventyTSData(eleventyConfig);
	eleventyESBuild(eleventyConfig);

	return {
		dir: {
			input: 'src/pages',
			output: 'public',
			data: '../11ty-global-data',
			layouts: '../layouts'
		}
	};
};
