class Router{
  constructor(routes){
    this.routes = {};
    this.currentHash = "";
    this.registerRoute(routes);
    this.freshRoute = this.freshRoute.bind(this);
    window.addEventListener("load",this.freshRoute,false);
    window.addEventListener("hashchange",this.freshRoute,false);
  }
  registerRoute(routes){
    routes.forEach(route => {
      this.addRoute(route);
    })
  }
  addRoute(route){
    this.routes[route.path] = route.page;
  }
  freshRoute(){
    this.currentHash = location.hash.slice(1) || '/';
    this.routes[this.currentHash]();
  }
}

let container = null;
window.addEventListener("load",()=>{
  container = document.querySelector("#container")
});


const routes = [
  {
    path:"/",
    page:()=>{
      container && (container.innerText = "page indexe")
    }
  },
  {
    path:"/page1",
    page:()=>{
      container && (container.innerText = "page page1")
    }
  },
  {
    path:"/page2",
    page:()=>{
      container && (container.innerText = "page page2")
    }
  }
]

const router = new Router(routes);