const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, 'src', 'index.js'),

    target: 'node',

    mode: 'production',

    module: {
        rules: [
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            }
        ]
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        library: 'handler',
        libraryTarget: 'commonjs2'
    }
};
