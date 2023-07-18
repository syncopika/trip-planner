const bundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    publicPath: '/trip-planner/',
    configureWebpack: {
        //plugins: [new bundleAnalyzerPlugin()]
    }
}