module.exports = (elevntyConfig) => {
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
