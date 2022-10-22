function myNew(){
  let Constructor = [].shift.call(arguments)
  if(typeof Constructor !== 'function'){
    throw new Error("第一个参数不是函数")
  } 
  let obj = {};
  Object.setPrototypeOf(obj,Constructor.prototype)
  let res = Constructor.apply(obj,arguments);
  return res instanceof Object ? res : obj;
}
