function flatten(arr){
  let result = [];
  for(let item of arr){
    if(Array.isArray(item)){
      result = result.concat(flatten(item));
    }else{
      result.push(item)
    }
  }
  return result;
}

let arr = [1,2,[3,[4,5]]];
console.log(flatten(arr,5));