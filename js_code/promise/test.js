
function split(list,pageNum,pageSize = 2){
  let start = (pageNum - 1) * pageSize;
  let end = start + pageSize
  return list.slice(start,end);
}
split(list,1)
let list = [1,2,3,4,5,6,7,8,9,10]

console.log(split(list,1));
console.log(split(list,2));
console.log(split(list,3));
console.log(split(list,5));