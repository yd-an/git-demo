const path = require('path');

function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  // 基本路径
  publicPath: '/',
  // 输出文件目录
  outputDir: 'dist',
  // eslint-loader 是否在保存的时候检查
  lintOnSave: true,
  assetsDir: 'static',
  // webpack配置
  // see https://github.com/vuejs/vue-cli/blob/dev/docs/webpack.md
  chainWebpack: (config) => {
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('utils', resolve('src/utils'));
  },
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,
  // webpack-dev-server 相关配置
  devServer: {
    open: process.platform === 'darwin',
    host: 'dev.yhmonitors.jdfcloud.com',
    port: 8080,
    https: false,
    hotOnly: false,
    proxy: {
      '/api': {
        target: 'http://10.222.26.1:8080/', // 跨域访问
        ws: true, // 是否启用websockets
        changOrigin: true, // 开启代理
        secure: false, // 将安全设置为false,才能访问https开头的
        pathRewrite: {
          '^/api': '/', // 这里理解成用‘/api’代替target里面的地址
        },
      },
    }, // 设置代理
  },
  // 第三方插件配置
  pluginOptions: {
    // ...
  },
};
