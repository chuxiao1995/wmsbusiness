// const path = require('path');
// function resolve(dir) {
//   return path.join(__dirname, dir)
// }

module.exports = {
  devServer: {
    proxy: 'http://127.0.0.1:10001'//修改为自己的地址
  },
    assetsDir: "./static",
    publicPath: "./"
}