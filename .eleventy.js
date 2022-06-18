const path = require('node:path');
const fs = require('node:fs');
const dateFns = require('date-fns');
const { snakeCase } = require('change-case');
const yaml = require('js-yaml');

module.exports = (eleventyConfig) => {
  eleventyConfig.addDataExtension('yaml', (contents) => yaml.load(contents));
  eleventyConfig.addWatchTarget('_assets/styles/**/*.scss');
  eleventyConfig.addPassthroughCopy('_public');
  eleventyConfig.addPassthroughCopy({ 'src/_assets/scripts': 'assets' });

  eleventyConfig.addNunjucksFilter('humanDate', function (value) {
    return dateFns.format(dateFns.parseISO(value), 'do LLL yyyy');
  });

  eleventyConfig.addNunjucksFilter('padLeft', function (value, ...args) {
    return value.toString().padStart(...args);
  });

  eleventyConfig.addNunjucksFilter('snakeCase', function (value) {
    return snakeCase(value || '');
  });

  return {
    dir: {
      input: 'src',
      output: 'public',
      layouts: '_layouts',
      templateFormats: ['njk', 'md', '11ty.js'],
      markdownTemplateEngine: 'nunjucks'
    }
  };
};
