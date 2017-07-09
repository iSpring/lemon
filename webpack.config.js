var path = require('path');
var chalk = require('chalk');
var webpack = require('webpack');

var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

var extractPlugin = new ExtractTextWebpackPlugin('[name].[contenthash].css');

var WebpackMd5Hash = require('webpack-md5-hash');
// var webpackMd5HashPlugin = new WebpackMd5Hash();

var HtmlWebpackPlugin = require('html-webpack-plugin');

var htmlWebpackPlugin = new HtmlWebpackPlugin({
    filename: './webapp.html',
    template: '!!ejs!./src/webapp/template.html',
    hash: false,
    inject: 'body',
    // chunks: ["runtime", "webapp", "globe"]
    chunks: ["webapp"]
});

var buildFolder = 'buildOutput';

var PRODUCTION = process.env.NODE_ENV === 'production';

var es6Promise = './node_modules/es6-promise/dist/es6-promise.auto.min.js';

module.exports = {
    entry: './app/index.jsx',

    output: {
        path: path.resolve(__dirname, buildFolder),
        filename: '[name].[chunkhash].js',
        // publicPath: buildFolder + "/",
        devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]'
    },

    // devtool: PRODUCTION ? 'hidden-source-map' : 'cheap-module-eval-source-map'
    devtool: PRODUCTION ? false : 'source-map',

    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.js', '.jsx', '.scss', '.png'],
        alias: {
        }
    },

    module: {
        rules: [{
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'react'],
                        plugins: ['transform-class-properties']
                    }
                }
            }, {
                test: /\.scss$/,
                use: {
                    loader: extractPlugin.extract('css?modules&localIdentName=[name]__[local]___[hash:base64:5]!sass')
                }
            }, {
                test: /\.(png|jpeg|jpg)$/,
                use: {
                    loader: 'file-loader'
                }
            }, {
                test: /\.(otf|ttf|eot|woff|woff2).*/,
                use: {
                    loader: 'file-loader'
                }
            }
        ]
    },

    plugins: [
        extractPlugin,
        webpackMd5HashPlugin,
        htmlWebpackPlugin
    ]
};

if (process.argv.indexOf("--ci") >= 0) {
    //https://github.com/webpack/webpack/issues/708
    module.exports.plugins.push(
        function () {
            this.plugin("done", function (stats) {
                var errors = stats.compilation.errors;
                if (errors && errors.length > 0) {
                    console.log("");
                    console.log(chalk.red("----------------------------------------------------------------"));
                    errors.forEach(function (err) {
                        var msg = chalk.red(`ERROR in ${err.module.userRequest},`);
                        // msg += chalk.blue(`(${err.location.line},${err.location.character}),`);
                        msg += chalk.red(err.message);
                        console.log(msg);
                        // console.log(err);
                    });
                    console.log(chalk.red("----------------------------------------------------------------"));
                    process.exit(1);
                }
            });
        }
    );
}

if (PRODUCTION) {
    module.exports.plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false
        })
    );
}