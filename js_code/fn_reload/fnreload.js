function addMethods(object,name,fn){
  let old = object[name];
  object[name] = function(){
    if(fn.length === arguments.length){
      return fn.apply(object,arguments);
    }else{
      return old.apply(object,arguments);
    }
  }
}

let context = {};
addMethods(context,"fn",(name)=>{console.log(name)})
addMethods(context,"fn",(name,age)=>{console.log(name,age)})
addMethods(context,"fn",(name,age,sex)=>{console.log(name,age,sex)})

context.fn('jack');
context.fn('jack',20);
context.fn('jack',20,'man');