/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');

const chalk = require('chalk');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const PROD = process.env.NODE_ENV === 'production';

console.log(
  `${chalk.bold('Production mode:')} ${
    PROD ? chalk.bold.green('Yes') : chalk.bold.red('No')
  }`
);
console.log(process.cwd());

const commonConfig = {
  context: process.cwd(),
  stats: {
    children: false
  },
  devtool: PROD ? false : 'eval-cheap-source-map',
  module: {
    rules: [
      {
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto'
      },
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true
            }
          }
        ],
        exclude: [/node_modules/]
      },
      {
        test: /\.(g|s)ql$/,
        use: 'raw-loader'
      },
      {
        test: /\.ya?ml$/,
        type: 'json',
        use: 'yaml-loader'
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all'
    }
  },
  resolve: {
    alias: {
      'date-fns$': 'date-fns/esm',
      lodash$: 'lodash-es'
    },
    extensions: ['.mjs', '.js', '.ts', '.tsx'],
    plugins: [new TsconfigPathsPlugin()]
  },
  plugins: []
};

if (!PROD) {
  commonConfig.plugins.push(new ForkTsCheckerWebpackPlugin());
}

const clientConfig = {
  ...commonConfig,
  name: 'client',
  entry: './src/client/index.tsx',
  output: {
    filename: PROD ? 'assets/[name].[contenthash:6].js' : 'assets/[name].js',
    chunkFilename: PROD
      ? 'assets/[name].[id].[contenthash:6].js'
      : 'assets/[name].[id].js',
    path: path.resolve(process.cwd(), './build/client'),
    publicPath: '/'
  },
  target: 'web',
  watchOptions: {
    ignored: ['node_modules/**', 'src/server/**']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(PROD ? 'production' : 'development')
      }
    }),
    new HTMLWebpackPlugin({
      template: 'src/client/index.html',
      filename: 'index.html',
      showErrors: false
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'src/client/common/images/*.png',
          to: 'assets/[name].[ext]'
        }
      ]
    })
  ]
};

if (!PROD) {
  clientConfig.devServer = {
    host: '0.0.0.0',
    contentBase: path.resolve(process.cwd(), 'build/client'),
    port: 4000,
    historyApiFallback: true,
    hot: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        pathRewrite: { '^/api': '' },
        changeOrigin: true
        // logLevel: 'debug'
      }
    }
  };
}

const serverConfig = {
  ...commonConfig,
  name: 'server',
  entry: './src/server/index.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(process.cwd(), './build/server'),
    publicPath: '/'
  },
  target: 'node',
  watchOptions: {
    ignored: ['node_modules/**', 'src/client/**']
  },
  externals: [nodeExternals()],
  optimization: {
    splitChunks: {
      chunks: 'async'
    }
  },
  plugins: []
};

module.exports = [clientConfig, serverConfig];
