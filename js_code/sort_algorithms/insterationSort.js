function inserationSort(arr){
  for(let i = 0;i < arr.length; i++){
    let temp = arr[i];
    let j = i;
    while(arr[j - 1] > temp && j > 0){
      arr[j] = arr[j - 1];
      j--;
    }
    arr[j] = temp;
  }
}

var arr = [5,4,8,7,1,9,6,3,1];
inserationSort(arr);
console.log(arr);