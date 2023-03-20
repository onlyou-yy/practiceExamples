Function.prototype.myBind = function(ctx,...bindArgs){
  let that = this
  function fBind(...args){
    ctx = this instanceof fBind ? this : ctx;
    let context = ctx ? Object(ctx) : window
    context.fn = that
    let allArgs = bindArgs.concat(args)
    let result = allArgs.length ? context.fn(...allArgs) : context.fn()
    delete context.fn
    return result;
  }
  // function temp(){}
  // temp.prototype = this.prototype;
  // fBind.prototype = new temp()
  fBind.prototype = ObjectCreate(this.prototype);

  return fBind
}

// Object.create 原理
function ObjectCreate(obj){
  function F(){};
  F.prototype = obj;
  return new F();
}