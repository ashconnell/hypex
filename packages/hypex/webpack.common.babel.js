import path from 'path'
import CleanWebpackPlugin from 'clean-webpack-plugin'

export default {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'hypex.js',
    library: 'hypex',
    libraryTarget: 'umd',
  },
  externals: {
    mobx: {
      commonjs: 'mobx',
      commonjs2: 'mobx',
      amd: 'mobx',
      root: 'mobx',
    },
  },
  plugins: [new CleanWebpackPlugin(['dist'])],
  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }],
  },
}
