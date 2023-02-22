function add(...args){
  let arr = [...args];
  function fn(...secArgs){
    arr = [...arr,...secArgs];
    return fn;
  }
  fn.toString = fn.valueOf = function(){
    return arr.reduce((cur,next) => cur + next);
  }
  return fn;
}

console.log(add(1)(2,4));