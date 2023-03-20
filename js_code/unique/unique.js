function unique1(arr){
  return arr.filter((item,index) => {
    return arr.indexOf(item) === index;
  })
}

const arr = [1,1,'true','true',true,true,15,15,false,false, undefined,undefined, null,null, NaN, NaN,'NaN', 0, 0, 'a', 'a',{},{}];
console.log(unique1(arr))

function unique2(arr){
  return Array.from(new Set(arr))
}
console.log(unique2(arr))

function unique3(arr){
  let weakMap = new Map();
  arr.forEach(item => {
    if(!weakMap.has(item)) weakMap.set(item,true);
  })
  return weakMap.keys()
}
console.log(unique3(arr))

function unique4(arr){
  let newArr = arr.slice();
  for(let i = 0;i < newArr.length;i++){
    for(let j = i + 1;j < newArr.length;j++){
      if(newArr[i] === newArr[j]){
        newArr.splice(i,1);
        j--;
      }
    }
  }
  return newArr;
}
console.log(unique4(arr))