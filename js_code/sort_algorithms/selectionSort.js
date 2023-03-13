function selectionSort(arr){
  let len = arr.length;
  for(let i = 0; i < len; i++){
    let minIndex = i;
    for(let j = i + 1; j < len; j++){
      if(arr[minIndex] > arr[j]){
        minIndex = j
      }
    }
    [arr[i],arr[minIndex]] = [arr[minIndex],arr[i]];
  }
}

var arr = [5,4,8,7,1,9,6,3,1];
selectionSort(arr);
console.log(arr);