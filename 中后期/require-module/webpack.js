var fileCache = {
  xxxxxxxxxxx,
  xxxxxxxxxxxxxx,
  xxxxxxxxxxx,
  xxxxxxxxxxx,
  xxxxxxxxxxx,
  xxxxxxxxxxx,
  xxxxx,
}

// webpack不只是做打包的事情
// 所以呢，我们现在不会在浏览器中不会直接在浏览器中使用未经打包的模块加载方式，那样太耗时了
// 而是通过类似webpack等工具把所有的代码打包到单个文件中（也可以配置成打包到多个文件中）
// 事实上es module也会这样处理，并且es module自身由于不能打包，所以会被webpack先转成common js的模块
// 书写方式再进行打包
// 现代webpack开发的必经之路
var moduleCache = Object.create(null)

function require(fileName) {
  if (fileName in moduleCache) {
    return moduleCache[fileName].exports
  }
  var code = fileCache[fileName]
  var modFunc = new Function('exports, module', code)
  var module = {
    id: fileName,
    exports: {}
  }
  modFunc(module.exports, module)
  moduleCache[fileName] = module
  return module.exports   
}
require('a.js')



// 打包！！！！！！！！！！！解决串型

// weback就是在干这个事情
