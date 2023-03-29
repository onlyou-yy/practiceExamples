/**
 * 并发处理任务池
 * @param {Number} poolLimit 每次并发处理的数量
 * @param {Array} taskParams 并发处理函数的参数
 * @param {Function} interatorFn 需要进行并发处理的函数
 * @returns 
 */
async function asyncPool(poolLimit,taskParams,interatorFn){
  const executing = [];//正在执行中的异步任务
  const ret = [];//所有异步任务结果
  for(let taskParam of taskParams){
    //使用异步任务和参数创建任务
    const taskRetPromise = Promise.resolve(taskParam).then(param=>interatorFn(param));
    //存储所有异步任务
    ret.push(taskRetPromise);
    if(poolLimit <= taskParams.length){
      //当一个任务完成之后，将这个任务从正在执行中的任务中移除
      const exec = taskRetPromise.then(()=>executing.splice(executing.indexOf(exec),1))
      executing.push(exec);
      if(executing.length >= poolLimit){
        // 添加错误捕获
        await Promise.race(executing.map(item => {
          return item.catch(err => err);
        }))
      }
    }
  }
  // 添加错误捕获
  return Promise.allSettled(ret.map(item => {
    return item.catch(err => err);
  }))
}

function exceptionTask(runtTime){
  return new Promise((resolve,reject)=>{
    setTimeout(() => {
      if(runtTime >= 2000){
        reject({error:"time out"})
      }else{
        resolve({success:runtTime})
      }
    }, runtTime);
  })
}

console.time("asyncPool")
asyncPool(4,[1000,1000,1500,1400,1200,1000,2000,1800],exceptionTask).then(res => {
  console.log(res);
  console.timeEnd("asyncPool")
})