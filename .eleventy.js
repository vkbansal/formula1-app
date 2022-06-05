const dateFns = require('date-fns');

module.exports = (elevntyConfig) => {
  elevntyConfig.addNunjucksFilter('humanDate', function (value) {
    return dateFns.format(dateFns.parseISO(value), 'do LLL yyyy');
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
