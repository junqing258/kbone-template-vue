const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.config');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const portfinder = require('portfinder');
const { getIPAdress } = require('./utils');

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devServer: {
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [{ from: /.*/, to: '/index.html' }],
    },
    hot: true,
    contentBase: false,
    compress: true,
    host: process.env.HOST || 'localhost',
    port: +process.env.PORT || 8080,
    open: true, // 自动打开浏览器
    overlay: { warnings: false, errors: true }, // 展示全屏报错
    publicPath: '/',
    proxy: {},
    quiet: true, // for FriendlyErrorsPlugin
    watchOptions: {
      poll: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        use: [
          {
            loader: 'vue-style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                require('autoprefixer')(),
                require('postcss-px-to-viewport')({
                  viewportWidth: 750, //视口的宽度，对应的时设计稿的宽度/2，一般为750
                  viewportHeight: 1334, //视口的高度，对应的是设计稿的高度（也可以不配置）
                  unitPrecision: 3, //指定‘px’转换为视口单位值的小数位数（很多时候无法整除）
                  viewportUnit: 'vw', //指定需要转换成的视口单位，建议使用vw
                  propList: ['*'],
                  selectorBlankList: ['ignore'], //指定不需要转换的类
                  minPixelValue: 1, //小于或等于‘1px’不转换为视口单位
                  mediaQuery: false, //允许在媒体查询中转换为‘px’
                  exclude: [/ycomponents/], //不需要转化的组件文件名正则，必须是正则表达式
                }),
              ],
            },
          },
          {
            loader: 'less-loader',
          },
        ],
      },
    ],
  },
  // devtool: "cheap-module-eval-source-map",
  devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"',
      },
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // 开启 HMR 的时候使用该插件会显示模块的相对路径
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true,
    }),
  ],
});

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = +process.env.PORT || 8080;
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err);
    } else {
      devWebpackConfig.devServer.host = getIPAdress();
      devWebpackConfig.devServer.port = port;
      devWebpackConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [`App is running here: http://${devWebpackConfig.devServer.host}:${port}`],
          },
          onErrors: undefined,
        }),
      );

      resolve(devWebpackConfig);
    }
  });
});
