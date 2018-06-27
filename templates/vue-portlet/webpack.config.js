const path = require('path')
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  entry: {
    portlet: './src/portlet/portlet.js'
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    library: '{{id}}',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      // use babel-loader for js files
      { test: /\.js$/, use: 'babel-loader' },
      // use vue-loader for .vue files
      { test: /\.vue$/, use: 'vue-loader' },
      // style loader
      { test: /\.less$/, use: ['style-loader', 'style-loader', 'css-loader', 'less-loader']},
      { test: /\.css$/, use: ['style-loader', 'style-loader', 'css-loader']}
    ]
  },
  plugins: [
    new VueLoaderPlugin()
  ],
  mode: 'development',
  externals: {

  }
  // extBack: {
  //   vue: 'Vue',
  //   mdPortlet: 'MdPortlet'
  //   vuebars: 'Bars'
  // }
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
