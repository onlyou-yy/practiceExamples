const runInSequence = async (list,handle,callback) => {
  let item = list.shift();
  if(item){
    // try {
    //   let res = await handle(item);
    //   callback(res);
    // } catch (error) {
    //   callback(error);
    // }
    // list.length && runInSequence(list,handle,callback);

    let res = await handle(item);
    callback(res);
    list.length && runInSequence(list,handle,callback);
  }
}

/**
 * 根据limit运行相应数量的异步任务，当有一个异步任务执行完成之后进行执行下一个异步任务，
 * 相当于开启了limit数量的任务队列
 * @param {Object} 配置对象 
 * @returns Promise
 */
const asyncThrottling = ({list,limit = 3,handle = ()=>{}}) => {
  const response = [];
  const len = list.length;
  //给handle添加错误处理
  const promiseHandle = (...params)=>Promise.resolve().then(()=>handle(...params)).catch(err=>err)
  return new Promise((resolve,reject)=>{
    limit = len > limit ? limit : len;
    while(limit--){
      runInSequence(list,promiseHandle,(res)=>{
        response.push(res);
        response.length == len && resolve(response)
      })
    }
  })
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

console.time("asyncThrottling")
asyncThrottling({list:[1000,1000,1500,1400,1200,1000,2000,1800],limit:4,handle:exceptionTask}).then(res => {
  console.log(res);
  console.timeEnd("asyncThrottling")
})