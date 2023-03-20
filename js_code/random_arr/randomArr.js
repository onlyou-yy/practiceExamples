function randomArr(arr){
  let newArr = arr.slice(0);
  for(let i = 0;i < newArr.length;i++){
    let randomIndex = Math.round(Math.random() * (newArr.length - 1 - i)) + i;
    [newArr[i],newArr[randomIndex]] = [newArr[randomIndex],newArr[i]]
  }
  return newArr;
}

const arr = [1,2,3,4,5,6,7,8]
console.log(randomArr(arr),arr);