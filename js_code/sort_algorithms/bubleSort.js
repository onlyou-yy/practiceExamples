function bubleSort(arr){
  for(let i = 0; i < arr.length;i++){
    for(let j = 0; j < arr.length - i - 1;j++){
      if(arr[j] > arr[j + 1]){
        [arr[j],arr[j + 1]] = [arr[j + 1],arr[j]];
      }
    }
  }
}

var arr = [5,4,8,7,1,9,6,3,1];
bubleSort(arr);
console.log(arr);