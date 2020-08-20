var path = require('path');
var webpack = require('webpack');
module.exports = {
    // entry: {
    //     main: './resources',
    //     other: './assets',
    // },
    resolve: {
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".js"]
    },
    output: {
        // publicPath: "/assets/js/",
        // path: path.join(__dirname, '/wwwroot/js/'),
        // filename: '[name].build.js'
    },
    module: {
        preLoaders: [
            { test: /\.ts$/, loader: 'tslint' }
        ],
        loaders: [
            { test: /\.ts$/, loader: 'ts-loader' }
        ]
    }
};
