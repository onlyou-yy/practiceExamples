function flat(arr,depth = 1){
  if(!Array.isArray(arr) || depth <= 0){
    return arr;
  }
  return arr.reduce((pre,next) => {
    if(Array.isArray(next)){
      return pre.concat(flat(next,depth - 1))
    }else{
      return pre.concat(next)
    }
  },[])
}

let arr = [1,2,[3,[4,5]]];
console.log(flat(arr,5));