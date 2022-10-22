const total = 100000
const one = 20
const page = total / 20
const ul = document.querySelector(".container")

let index = 0;

function loop(curTotal,curIndex){
  if(curTotal <= 0 ) return
  let pageCount = Math.min(curTotal,one)
  window.requestAnimationFrame(function(){
    let fragment = document.createDocumentFragment();
    for(let i = 0; i < pageCount; i++){
      let li = document.createElement('li')
      li.innerHTML = ++index
      fragment.appendChild(li);
    }
    ul.appendChild(fragment);
    loop(curTotal - pageCount,curIndex + pageCount)
  })
}

console.time("render")
loop(total,index)
console.timeEnd("render")