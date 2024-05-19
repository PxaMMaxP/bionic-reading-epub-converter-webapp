/**
 * webpack.config.js
 * 
 * This is the configuration file for Webpack. It specifies settings for both development
 * and production builds, including entry points, output locations, module rules,
 * and development server settings.
 */

const path = require('path');

module.exports = {
    mode: 'development', // or 'production' for production builds
    entry: path.resolve(__dirname, 'src', 'main.ts'), // Entry point, typically main.ts
    devtool: 'source-map', // Enable source maps for debugging
    module: {
        rules: [
            {
                test: /\.ts$/, // Rule for TypeScript files
                use: 'ts-loader', // Use ts-loader for TypeScript
                exclude: /node_modules/, // Exclude node_modules directory
            },
            {
                test: /\.js$/, // Apply the source-map-loader to JavaScript files
                use: ['source-map-loader'],
                enforce: 'pre',
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'], // Allow importing of .ts and .js files
    },
    output: {
        path: path.resolve(__dirname, 'dist'), // Output directory
        filename: 'bundle.js', // Output filename
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'), // Serve static content from the public directory
        },
        compress: true, // Enable compression for smaller files
        port: 8080, // Port for the development server
    },
};
