function add(...args){
  let arr = [...args];
  function fn(...secArgs){
    arr = [...arr,...secArgs];
    //参数固定长度，可以直接根据 arr 的长度来返回结果，如果不固定可以修改输出值的隐式调用 valueOf / toString
    return fn;
  }
  fn.toString = fn.valueOf = function(){
    return arr.reduce((cur,next) => cur + next);
  }
  return fn;
}

console.log(+add(1)(2,4));