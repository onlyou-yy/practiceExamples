/**call */
Function.prototype.myCall = function(ctx,...args){
  let context = ctx ? Object(ctx) : window;
  let fnKey = Symbol("fn");
  context[fnKey] = this;
  let result = args.length ? context[fnKey](...args) : context[fnKey]();
  delete context[fnKey];
  return result;
}
var obj = {name:"jack"};
function say(age){
  console.log(this.name + age);
}
say.call(obj,20);
say.myCall(obj,20);

/**apply */
Function.prototype.myApply = function(ctx,args){
  let context = ctx ? Object(ctx) : args;
  let fnKey = Symbol("fn");
  context[fnKey] = this;
  let result = args.length ? context[fnKey](...args) : context[fnKey]();
  delete context[fnKey];
  return result;
}
say.apply(obj,[30]);
say.myApply(obj,[30]);

/**bind */
Function.prototype.myBind = function (ctx,...bindArgs){
  let fn = this;

  function bindFn(...args){
    ctx = this instanceof bindFn ? this : ctx;
    let context = ctx ? Object(ctx) : window;
    let allArgs = [...bindArgs,...args];
    let res = fn.myApply(context,allArgs);
    return res;
  }

  bindFn.prototype = this.prototype;
  
  return bindFn;
}
var say2 = say.bind(obj);
say2(40)
var say2Ins = new say2(40);
console.log(say2Ins);

var say2 = say.myBind(obj);
say2(40)
var say2Ins = new say2(40);
console.log(say2Ins);

/**new */
function myNew(){
  let constructor = [].shift.myCall(arguments);
  if(!constructor instanceof Function){
    throw Error("first argument must be a Function");
  }
  let context = Object.create(constructor.prototype);
  let res = constructor.myApply(context,arguments);
  return typeof res === "object" ? res : context;
}
var sayIns2 = new say();
console.log(sayIns2);
var sayIns = myNew(say);
console.log(sayIns);


function debounce(fn,wait){
  let timer = null;
  return function(...args){
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this,...args)
    }, wait);
  }
}

function thorttled(fn,wait){
  // let timer = null;
  // return function(...args){
  //   if(!timer){
  //     timer = setTimeout(() => {
  //       fn.apply(this,...args);
  //       timer = null;
  //     }, wait);
  //   }
  // }

  let lastTime = 0;
  return function(...args){
    let nowTime = Date.now();
    if(nowTime - lastTime > wait){
      fn.apply(this,...args);
      lastTime = nowTime;
    }
  }
}

/**promise */
class MyPromise{
  
}