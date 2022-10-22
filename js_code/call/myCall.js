Function.prototype.myCall = function(ctx,...args){
  let context = ctx ? Object(ctx) : window
  context.fn = this
  let result = args.length == 0 ? context.fn() : context.fn(...args)
  delete context.fn
  return result;
}