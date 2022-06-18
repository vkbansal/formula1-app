const fs = require('node:fs');
const path = require('node:path');

const yaml = require('js-yaml');

module.exports = {
  eleventyComputed: {
    pageData: async (opts) => {
      const { year } = opts;

      const file = path.resolve(process.cwd(), `datastore/season/${year}.yaml`);
      const contents = await fs.promises.readFile(file, 'utf8');

      return yaml.load(contents);
    }
  }
};
