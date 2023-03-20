function curry(fn,length){
  length = length || fn.length;
  return function(...args){
    return args.length >= length ? 
    fn.apply(this,args) :
    curry(fn.bind(this,...args),length - args.length)
  }
}

function add(a,b,c,d,e){
  return a + b + c + d + e
}

let curryAdd = curry(add);
console.log(curryAdd(1)(1)(1)(1)(1))
console.log(curryAdd(1,1)(1)(1)(1))
console.log(curryAdd(1)(1))
console.log(curryAdd(1,1)(1))