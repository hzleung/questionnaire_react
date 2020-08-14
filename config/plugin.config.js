/*
 * @Description: webpack配置修改 webpack-chain【https://github.com/mozilla-neutrino/webpack-chain】
 * @Author: admin
 * @Date: 2019-09-25 16:18:35
 * @LastEditors: admin
 * @LastEditTime: 2019-10-11 17:04:35
 */

export default config => {
  // 修改文件输入位置
  config.output.filename('assets/js/[name].[hash:8].js');
  config.output.chunkFilename('assets/js/chunk/[name].[hash:8].chunk.js');
  config.plugin('extract-css').use(require('mini-css-extract-plugin'), [
    {
      filename: 'assets/css/[name].[hash:8].css',
      chunkFilename: 'assets/css/[name].[hash:8].chunk.css',
    },
  ]);
  config.module
    .rule('exclude')
    .use('url-loader')
    .loader(require.resolve('umi-url-pnp-loader'))
    .options({
      limit: 8192,
      outputPath: 'assets/images',
      name: '[name].[hash:8].[ext]',
    });

  // 打包优化 uglifyjs-webpack-plugin 配置
  if (process.env.NODE_ENV === 'production') {
    config.merge({
      plugin: {
        install: {
          plugin: require('uglifyjs-webpack-plugin'),
          args: [
            {
              sourceMap: false,
              uglifyOptions: {
                compress: {
                  // 删除所有的 `console` 语句
                  drop_console: true,
                },
                output: {
                  // 最紧凑的输出
                  beautify: false,
                  // 删除所有的注释
                  comments: false,
                },
              },
            },
          ],
        },
      },
    });
  }
};
