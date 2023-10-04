const path = require('path');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const baseConfig = {
    experiments: {
        topLevelAwait: true
    },
    entry: path.resolve(__dirname, './src/index.ts'),
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            { test: /\.ts$/i, use: 'ts-loader' },
            {
                test: /\.(ttf|woff|woff2|eot)$/,
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]',
                },
            },
            {
                test: /\.(svg)$/,
                loader: 'file-loader',
                options: {
                    name: 'assets/icons/[name].[ext]',
                },
            },
            /*{
                test: /\.(png|jpg|gif|webp)$/,
                loader: 'file-loader',
                options: {
                    name: 'images/[name].[ext]',
                },
            },*/
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/index.html'),
            filename: 'index.html',
        }),
        new CleanWebpackPlugin(),
        new ESLintWebpackPlugin({ extensions: '.ts' }),
        new CopyWebpackPlugin({
            patterns: [{ from: './src/assets/', to: './assets/' }],
        }),
    ],
};

module.exports = ({ mode }) => {

    const isProductionMode = mode === 'prod';
    const envConfig = isProductionMode ? require('./webpack.prod.config') : require('./webpack.dev.config');
    return merge(baseConfig, envConfig);
};
