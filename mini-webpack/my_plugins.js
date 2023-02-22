//自定义插件WebpackRunPlugin
class WebpackRunPlugin{
  apply(compiler){
    compiler.hooks.run.tap("WebpackRunPlugin",() => {
      console.log("开始编译")
    })
  }
}
exports.WebpackRunPlugin = WebpackRunPlugin

//自定义插件WebpackDonePlugin
class WebpackDonePlugin{
  apply(compiler){
    compiler.hooks.run.tap("WebpackDonePlugin",() => {
      console.log("结束编译")
    })
  }
}
exports.WebpackDonePlugin = WebpackDonePlugin