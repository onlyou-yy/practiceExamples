class Chain{
  constructor(){
    this.middleware = []
  }
  use(fn){
    if(typeof fn !== 'function'){
      throw new TypeError("Middleware must be composed of functions!");
    }
    this.middleware.push(fn);
    return this;
  }
  transmit(ctx){
    this.compose(this.middleware)(ctx)
  }
  compose(middleware = []){
    if(!Array.isArray(middleware)){
      return new TypeError("Middleware stack must be an array!");
    }
    return (context,next) => {
      let index = -1;
      const dispatch = i => {
        // 通过索引来限制 next() 只能被调用一次；如果 next() 被多次调用，则抛出错误
        if(i <= index) return Promise.reject(new Error("next() called multiple times"));
        index = i;
        // 陆续取出 middleware 中的每个函数并开始执行
        let fn = middleware[i];
        // 直到最后一个时，next 为 undefined，此时的 fn 不是函数，直接返回 resolve
        if(i == middleware.length) fn = next;
        if(!fn) return Promise.resolve()
        // 如果不是最后一个，则也会返回一个 resolve，但 resolve 的内容是取到下一个 middleware 中的函数
        try {
          // 当执行到 next() 函数时，会调用下一个中间件，会重新 return 进入 dispatch 函数内部，继续执行下一个函数
          return Promise.resolve(fn(context,dispatch.bind(null,i + 1)))
        } catch (error) {
          return Promise.reject(error)
        }
      }

      dispatch(0);
    }
  }
}

const chain = new Chain()
chain
  .use(async (ctx, next) => {
    console.log('1')
    await next()
    console.log('1')
  })
  .use(async (ctx, next) => {
    console.log('2')
    await next()
    console.log('2')
  })
  .use(async (ctx, next) => {
    console.log('3')
  })
  
chain.transmit({ name: '传入执行链中的上下文' })