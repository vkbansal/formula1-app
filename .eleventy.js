const dateFns = require('date-fns');
const { snakeCase } = require('change-case');

module.exports = (elevntyConfig) => {
  elevntyConfig.addNunjucksFilter('humanDate', function (value) {
    return dateFns.format(dateFns.parseISO(value), 'do LLL yyyy');
  });

  elevntyConfig.addNunjucksFilter('padLeft', function (value, ...args) {
    return value.toString().padStart(...args);
  });

  elevntyConfig.addNunjucksFilter('snakeCase', function (value) {
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
