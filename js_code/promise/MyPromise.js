class MyPromise {
  constructor(exector) {
    this.initValue();
    this.initBind();
    try {
      exector(this.resolve, this.reject);
    } catch (e) {
      this.reject(e);
    }
  }
  initValue() {
    this.promiseStatus = "pending";
    this.promiseResult = undefined;
    this.onFulfilledCallback = [];
    this.onRejectedCallback = [];
  }
  initBind() {
    this.resolve = this.resolve.bind(this);
    this.reject = this.reject.bind(this);
  }
  resolve(value) {
    if (this.promiseStatus !== 'pending') return;
    this.promiseResult = value;
    this.promiseStatus = "fulfilled";
    while (this.onFulfilledCallback.length) {
      let cb = this.onFulfilledCallback.shift()
      cb(this.promiseResult)
    }
  }
  reject(err) {
    if (this.promiseStatus !== 'pending') return
    this.promiseResult = err;
    this.promiseStatus = "rejected";
    while (this.onRejectedCallback.length) {
      let cb = this.onRejectedCallback.shift()
      cb(this.promiseResult)
    }
  }
  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : val => val;
    onRejected = typeof onRejected === "function" ? onRejected : val => { throw val };

    var thenPromise = new MyPromise((resolve, reject) => {
      let resolvePromise = cb => {
        exectorMicrotasks(() => {
          try {
            let result = cb(this.promiseResult);
            //var p = new MyPromise((res)=>res(1)).then(d=>p); 此时then返回的p和回调执行结果的p是一样的
            if (result === thenPromise) {
              reject("not return self")
              throw new Error("not return self")
            }
            if (result instanceof MyPromise) {
              result.then(resolve, reject)
            } else {
              resolve(result)
            }
          } catch (err) {
            reject(err);
            throw new Error(err)
          }
        });
      }

      if (this.promiseStatus === "fulfilled") {
        resolvePromise(onFulfilled);
      } else if (this.promiseStatus === "rejected") {
        resolvePromise(onRejected);
      } else {
        this.onFulfilledCallback.push(resolvePromise.bind(this, onFulfilled));
        this.onRejectedCallback.push(resolvePromise.bind(this, onRejected));
      }
      
    })

    return thenPromise;
  }
  static resolve(value) {
    if (typeof value === 'object' || typeof value === 'function') {
      try {
        var then = value.then;
        if (typeof then === 'function') {
          // return new MyPromise(then.bind(value));
          return new MyPromise((resolve,reject)=>{
            value.then(res => {
              resolve(res)  
            },err=>{
              reject(err)
            })
          })
        }
      } catch (ex) {
        return new MyPromise(function (resolve, reject) {
          reject(ex);
        });
      }
    }
    return new MyPromise((resolve, reject) => {
      resolve(value)
    })
  }
  static reject(value) { 
    return new MyPromise((resolve,reject) => {
      reject(value)
    })
  }
  static all(promises) {
    let result = [];
    let count = 0;
    return new MyPromise((resolve,reject) => {
      const addResult = (value,i) => {
        result[i] = value;
        count++;
        if(result.length === count){
          resolve(result)
        }
      } 
      promises.forEach((promise,i) => {
        if(promise instanceof MyPromise){
          promise.then(res=>{
            addResult(res,i)
          },err=>{
            reject(err)
          })
        }else{
          addResult(promise)
        }
      })
    }) 
  }
  static any(promises) { 
    let count = 0;
    return new MyPromise((resolve,reject) => {
      promises.forEach((promise,i) => {
        if(promise instanceof MyPromise){
          promise.then(res => {
            resolve(res)
          },err => {
            count++
            if(count === promises.length){
              reject(err)
            }
          })
        }else{
          resolve(promise)
        }
      })
    })
  }
  static race(promises) {
    return new MyPromise((resolve,reject) => {
      promises.forEach((promise,i) => {
        if(promise instanceof MyPromise){
          promise.then(res => {
            resolve(res)
          },err => {
            reject(err)
          })
        }else{
          resolve(promise)
        }
      })
    })
  }
  static allSettled(promises) { 
    let result = []   
    let count = 0
    return new MyPromise((resolve,reject) => {
      const addResult = (state,value,i) => {
        result[i] = {
          state,value
        }
        count++;
        if(count === result.length) resolve(result)
      }

      promises.forEach((promise,i) => {
        if(promise instanceof MyPromise){
          promise.then(res => {
            addResult("fulfilled",res,i)
          },err=>{
            addResult("rejected",err,i)
          })
        }else{
          addResult("fulfilled",promise,i)
        }
      })
    })
  }
}

function exectorMicrotasks(fn){
  if (typeof window === 'object'){
    // window只存在于浏览器端(不严谨)
    var observer = new MutationObserver(function () {
      fn()
    });
    var targetNode = document.createElement("div");
    targetNode.setAttribute("data-h","2")
    var observerOptions = {
      childList: true,  // 观察目标子节点的变化，是否有添加或者删除
      attributes: true, // 观察属性变动
      subtree: true     // 观察后代节点，默认为 false
    }
    observer.observe(targetNode, observerOptions); 
  }else if(Object.prototype.toString.call(process) === '[object process]'){
    //判断process
    process.nextTick(function(){
      fn()
    })
  }
}


//------------------------------------------------------------------
// const p = new MyPromise((resolve,reject)=>{
//   resolve(1)
//   reject(2)
// })
// const p1 = new MyPromise((resolve,reject)=>{
//   throw("hi")
// })
// console.log(p)
// console.log(p1)

// p.then(res => {
//   console.log(res)
// },err=>{
//   console.log(err)
// })

// p1.then(res => {
//   console.log(res)
// },err => {
//   console.log(err)
// })

// const p2 = new MyPromise((resolve,reject)=>{
//   setTimeout(()=>{
//     resolve(200)
//   },2000)
// })
// p2.then(res => {
//   console.log(res)
// },err => {
//   console.log(err)
// })

// const p3 = new MyPromise((resolve, reject) => {
//   resolve(1)
// })
// p3.then(res => {
//   console.log(res)
//   return 2;
// }).then(res => {
//   console.log(res)
//   return new MyPromise((res, rej) => {
//     res(3)
//   })
// }, err => { console.log(err) }).then(res => {
//   console.log(res)
// })

// new MyPromise((resolve, reject) => {
//   console.log('外部promise');
//   resolve();
// })
//   .then(() => {
//     console.log('外部第一个then');
//     new MyPromise((resolve, reject) => {
//       console.log('内部promise');
//       resolve();
//     })
//       .then(() => {
//         console.log('内部第一个then');
//         return MyPromise.resolve();
//       })
//       .then(() => {
//         console.log('内部第二个then');
//       })
//   })
//   .then(() => {
//     console.log('外部第二个then');
//   })
//   .then(() => {
//     console.log('外部第三个then');
//   })

MyPromise.resolve(MyPromise.resolve("s")).then((v)=>console.log(v));
