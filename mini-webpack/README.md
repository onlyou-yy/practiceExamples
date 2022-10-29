## webpack 打包基本原理
我们都知道webpack是用来编译打包js文件的，将多个文件打包在一起，并使浏览器能够运行打包出来的文件。
比如有文件 index.js main.js 文件，在 index.js 中引入并使用了 main.js 的函数
`index.js`
```js
var add = require('main.js').default
console.log(add(1,2));
```
`main.js`
```js
var test = '11';
exports.default = function(a,b){
  return a + b;
}
```
当在node环境下执行 index.js 返回发现是可以正常运行的，因为在这两个文件使用的模块规范是commonjs，所以是可以的，但是当在浏览器环境下运行就会出问题，因为浏览器并不支持模块规范commonjs。
那么其实我们可以自己尝试进行解决，模块的因为其实不就是将模块文件的内容导入进当前文件吗，那么就有
`boundle.js`
```js
var test = '11';

var exports = {};
exports.default = function(a,b){
  return a + b;
}
function require(file){
  return exports;
}
var add = require('main.js').default
console.log(add(1,2));
```
此时在浏览器上运行 `boundle.js` 就会正常执行。但是这里有个问题就是可能在 main.js 中还定义了其他变量并且和其他文件中的变量重名，这样就会导致变量混乱污染执行环境了，此时我们可以考虑使用IIFE函数创造一个作用域来隔离变量，同时因为要一次引入并执行文件中的所有代码可以使用eval来处理
```js
var test = '22';

var exports = {}
(function(exports,code){
  eval(code);
})(exports,
`
var test = '11';
exports.default = function(a,b){
  return a + b;
}
`)

function require(file){
  return exports;
}
var add = require('main.js').default
console.log(add(1,2),test);
```
这样就可以解决变量同名的问题了，但是还有个问题就是会有多个文件需要进行导入，那么就对应了多套代码，可编写一个统一的函数进行处理，同时可以用一个map来根据文件名来映射文件内容（实际上webpack是用图来存储依赖的）
```js
(function(list){
  function require(file){
    var exports = {};
    (function(exports,code){
      eval(code)
    })(exports,list[file]);
    return exports;
  }
  require('index.js');
})({
  'index.js':`
    var test = '22';
    var add = require('main.js').default
    console.log(add(1,2),test);
  `,
  'main.js':`
    var test = '11';
    exports.default = function(a,b){
      return a + b;
    }
  `
})
```
上面就是webpack的基本原理

