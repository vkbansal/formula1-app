/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import esbuild from 'esbuild';
import sass from 'sass';

const ASSETS_FILE = 'src/_data/assets.json';
const assets = JSON.parse(fs.readFileSync(ASSETS_FILE, 'utf8'));

/**
 * @type {import('esbuild').Plugin}
 */
const sassPlugin = {
  name: 'sass',
  setup(build) {
    build.onLoad({ filter: /\.scss/ }, async (onLoadArgs) => {
      const sassObj = await sass.compile(onLoadArgs.path, {
        importers: [
          {
            findFileUrl(url) {
              if (!url.startsWith('~')) {
                return null;
              }

              return new URL(
                url.substring(1),
                pathToFileURL('./node_modules/')
              );
            }
          }
        ]
      });

      return {
        contents: sassObj.css,
        loader: 'css',
        watchFiles: sassObj.loadedUrls.map((url) => fileURLToPath(url))
      };
    });
  }
};

export default async function () {}

yargs(hideBin(process.argv))
  .version(false)
  .scriptName('mariadb-datagen')
  .usage('$0 [args]')
  .command(
    '$0',
    'Run esbuild',
    (y) => {
      y.option('watch', {
        description: 'Run in watch mode',
        demandOption: false,
        boolean: true,
        default: false
      }).option('minify', {
        description: 'Minify output',
        demandOption: false,
        boolean: true,
        default: false
      });
    },
    async ({ watch, minify }) => {
      return esbuild
        .build({
          entryPoints: Object.fromEntries(
            Object.entries(assets).map(([key, value]) => [
              path.normalize(
                path.join('public', value.replace(path.extname(value), ''))
              ),
              path.normalize(path.join('src', key))
            ])
          ),
          bundle: true,
          target: 'esnext',
          outdir: '.',
          watch: watch
            ? {
                onRebuild(error) {
                  if (error) {
                    console.error('watch build failed:', error);
                  } else {
                    console.log('[WATCH] build succeeded');
                  }
                }
              }
            : undefined,
          minify,
          loader: {
            '.scss': 'css'
          },
          plugins: [sassPlugin]
        })
        .then(() => {
          console.log('watching files....');
        });
    }
  )
  .help()
  .demandCommand().argv;
