var path = require('path');
var webpack = require('webpack');

module.exports = {
		
     entry: './lib/miner',
     output: {
         path: path.resolve(__dirname, 'public/javascript'),
         filename: 'miner.bundle.js',
         libraryTarget: 'var',
         library: 'miner'
     },
     module: {
         loaders: [
             {
                 test: /\.js$/,
                 loader: 'babel-loader',
                 query: {
                     presets: ['es2015']
                 }
             }
         ]
     },
     stats: {
         colors: true
     },
     devtool: 'source-map'
    	 
};