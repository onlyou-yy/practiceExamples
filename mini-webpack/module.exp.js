//打包出来的文件，因为是运行浏览器上，所以需要在浏览起上实现 commenjs 的模块加载方法
//初始化：定义一个对象 modules ，key 为模块路径，value是一个函数，函数里面是我们编写的源代码（也可以是编译打包后的代码）
var modules = {
  './src/name.js': (module,exports) => {
    module.exports = "不要秃头啊"
  },
  './src/age.js': (module,exports) => {
    module.exports = "99"
  }
}

//定义缓存对象
var cache = {};

function require(moduleId){
  var cachedModule = cache[moduleId];
  if(cachedModule != undefined){
    return cachedModule.exports;
  }
  var module = (cache[moduleId] = {
    exports: {},
  })
  modules[moduleId](module,module.exports,requre);
  return module.exports;
}

//执行入口文件
(() => {
  const name = require("./name");
  const age = require("./age");
  console.log("entry文件打印作者信息", name, age);
})()