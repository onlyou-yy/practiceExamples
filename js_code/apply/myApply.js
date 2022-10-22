Function.prototype.myApply = function(ctx,args = []){
  if(!Array.isArray(args)){
    throw new Error("参数只能是一个数组")
  }
  let context = ctx ? Object(ctx) : window;
  context.fn = this
  let result = args.length == 0 ? context.fn() : context.fn(...args)
  delete context.fn
  return result;
}