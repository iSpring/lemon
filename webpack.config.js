var path = require('path');
var chalk = require('chalk');
var webpack = require('webpack');

var ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

var extractPlugin = new ExtractTextWebpackPlugin('[name].[contenthash].css');

var HtmlWebpackPlugin = require('html-webpack-plugin');

var htmlWebpackPlugin = new HtmlWebpackPlugin({
    filename: './index.html',
    template: '!!ejs-loader!./app/template.ejs',
    hash: false,
    inject: 'body'
});

var buildFolder = 'buildOutput';

var isProd = process.env.NODE_ENV === 'production';

var es6Promise = './node_modules/es6-promise/dist/es6-promise.auto.min.js';

module.exports = {
    entry: './app/index.jsx',

    output: {
        path: path.resolve(__dirname, buildFolder),
        filename: '[name].[chunkhash].js',
        // publicPath: buildFolder + "/",
        devtoolModuleFilenameTemplate: 'webpack:///[absolute-resource-path]'
    },

    // devtool: isProd ? 'hidden-source-map' : 'cheap-module-eval-source-map'
    devtool: isProd ? false : 'source-map',

    resolve: {
        extensions: ['.webpack.js', '.web.js', '.js', '.jsx', '.scss', '.png'],
        alias: {
            features: path.join(__dirname, 'app/features')
        }
    },

    module: {
        rules: [{
                test: /\.jsx?$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015', 'react'],
                        plugins: ['transform-class-properties', 'transform-object-rest-spread']
                    }
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
        htmlWebpackPlugin
    ]
};

// {
//                 test: /\.scss$/,
//                 use: extractPlugin.extract({
//                     use: {
//                         loader: 'css-loader?modules&localIdentName=[name]__[local]___[hash:base64:5]!sass-loader'
//                     }
//                 })
//             },

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

if (isProd) {
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