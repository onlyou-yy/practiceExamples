const imgs = document.querySelectorAll("img");
const container = document.querySelector(".container")
const containerHeight = container.clientHeight

//传统scroll方式
// container.addEventListener('scroll',e => {
//   imgs.forEach(img => {
//     let top = img.getBoundingClientRect().top
//     if(top <= containerHeight){
//       let data_src = img.getAttribute("data-src");
//       img.setAttribute("src",data_src);
//     }
//   })
// })

const callback = (entries) => {
  console.log("看见了和看不见的时候都会触发")
  entries.forEach(item => {
    if(item.isIntersecting){
      const img = item.target
      const data_src = img.getAttribute('data-src')
      img.setAttribute("src",data_src)
      observer.unobserve(img)
    }
  })
}
//intersectionObserver 方式
//callback会在被观察节点看见了和看不见的时候都会触发
//所以在开始的时候还看不见也会触发一次
const observer = new IntersectionObserver(callback);

imgs.forEach(img => {
  observer.observe(img);
})

