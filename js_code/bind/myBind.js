Function.prototype.myBind = function(ctx,...bindArgs){
  let that = this
  function temp(){}
  function fBind(...args){
    ctx = this instanceof fBind ? this : ctx;
    let context = ctx ? Object(ctx) : window
    context.fn = that
    let allArgs = bindArgs.concat(args)
    let result = allArgs.length ? context.fn(...allArgs) : context.fn()
    delete context.fn
    return result;
  }
  temp.prototype = this.prototype;
  fBind.prototype = new temp()
  return fBind
}