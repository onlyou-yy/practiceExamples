function findPivot(arr,left,right){
  let center = ~~((left + right) / 2);
  if(arr[left] > arr[center]){
    [arr[left], arr[center]] = [arr[center],arr[left]]
  }
  if(arr[center] > arr[right]){
    [arr[center],arr[right]] = [arr[right],arr[center]]
  }
  if(arr[left] > arr[right]){
    [arr[left],arr[right]] = [arr[right],arr[left]]
  }
  [arr[center],arr[right - 1]] = [arr[right - 1],arr[center]];
  return right - 1;
}

function quickSort(arr){
  let left = 0;
  let right = arr.length - 1;
  recursion(arr,left,right);
}

function recursion(arr,left,right){
  if(left >= right) return arr;
  let pivot = findPivot(arr,left,right);
  let leftIndex = left;
  let rightIndex = pivot;
  while(leftIndex < rightIndex){
    while(leftIndex < rightIndex && arr[leftIndex] <= arr[pivot]) leftIndex++;
    while(leftIndex < rightIndex && arr[rightIndex] >= arr[pivot]) rightIndex--;
    if(leftIndex < rightIndex){
      [arr[leftIndex],arr[rightIndex]] = [arr[rightIndex],arr[leftIndex]];
    }
  }
  [arr[leftIndex],arr[pivot]] = [arr[pivot],arr[leftIndex]];
  recursion(arr,left,leftIndex - 1);
  recursion(arr,leftIndex + 1,right);
}

var arr = [5,4,8,7,1,9,6,3,1];
quickSort(arr);
console.log(arr);