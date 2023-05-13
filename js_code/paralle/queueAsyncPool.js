function limit(maxCount){
  // 任务队列
  let queue = []
  let activeCount = 0

  const next = ()=>{
    //下一个任务
    activeCount--
    if(queue.length>0){
      queue.shift()()
    }
  }
  const run = async (fn,resolve,args)=>{
    //执行一个函数
    activeCount++
    const result = (async()=>fn(...args))()
    resolve(result)
    await result
    next() //下一个
  }
  const push = async (fn,resolve,args)=>{
    queue.push(run.bind(null,fn,resolve,args))
    if(activeCount<maxCount && queue.length>0){
      // 队列没满 并且还有任务 启动任务
      queue.shift()()
    }
  }

  let runner = (fn,...args)=>{
    return Promise.all(args.map(m => {
      return new Promise((resolve)=>{
        push(fn,resolve,m)
      })
    }))
  }
  return runner
}

const runner = limit(2);

runner((msg)=>{
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      console.log(msg)
      resolve(msg);
    },2000)
  })
},"1","2","3","4","5","6","7","8").then(res=>{
  console.log(res)
})