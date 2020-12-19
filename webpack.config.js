const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const nodeEnv = process.env.NODE_ENV

const jsbgl_web = {
    mode: "production",
    target: 'web',
    context: path.resolve(__dirname, "."),
    node: {
        fs: 'empty'
    },
    entry: './src/jsbgl.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'jsbgl.js',
        library: 'jsbgl',
        libraryTarget: 'var',
    },
    optimization: {
        sideEffects: true,
        minimize: true,
            minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    output: {
                        comments: false,
                    },
                },
            }),
        ],
    },
    module: {
        noParse: /crypto/,
    },
    performance: { hints: false }
};

module.exports = [jsbgl_web];

