/* eslint-disable no-console */
import fs from 'node:fs';
import path from 'node:path';

import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import esbuild from 'esbuild';
import postcss from 'postcss';
import cssNested from 'postcss-nested';
import cssImports from 'postcss-import';
import cssModules from 'postcss-modules';

const ASSETS_FILE = 'src/_data/assets.json';
const assets = JSON.parse(fs.readFileSync(ASSETS_FILE, 'utf8'));

/**
 * @type {import('esbuild').Plugin}
 */
const postCSSPlugin = {
  name: 'postcss-plugin',
  setup(build) {
    build.onLoad({ filter: /\.css/ }, async (onLoadArgs) => {
      const css = await fs.promises.readFile(onLoadArgs.path, 'utf8');
      const result = await postcss([
        cssImports({
          plugins: [
            cssNested(),
            cssModules({
              generateScopedName: '[name]__[local]___[hash:base64:5]',
              scopeBehaviour: 'local',
              globalModulePaths: [/src\/styles/, /node_modules/],
              localsConvention: 'camelCaseOnly',
              getJSON(cssFileName, json) {
                if (!json || Object.keys(json).length === 0) {
                  return;
                }

                const jsonFile = cssFileName.replace(
                  path.extname(cssFileName),
                  '.json'
                );

                fs.writeFileSync(
                  jsonFile,
                  JSON.stringify({ css: json }, null, 2),
                  'utf8'
                );
              }
            })
          ]
        })
      ]).process(css, { from: onLoadArgs.path });

      return {
        contents: result.css,
        loader: 'css',
        watchFiles: [
          ...new Set(
            result.messages
              .filter((m) => m.type === 'dependency')
              .flatMap((m) => [m.file, m.parent])
          )
        ]
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
          plugins: [postCSSPlugin]
        })
        .then(() => {
          if (watch) {
            console.log('watching files....');
          }
        });
    }
  )
  .help()
  .demandCommand().argv;
