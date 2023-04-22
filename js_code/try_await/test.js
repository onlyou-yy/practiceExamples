function getData_normal(){
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve("success")
    },1000)
  })
}
async function run_getData_normal(){
  let res = await getData_normal();
  console.log(res);
}
// run_getData_normal();

//try catch 可以捕获promise 的 reject 结果
function getData_reject(){
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      reject("fail")
    },1000)
  })
}

async function run_getData_reject_trycatch(){
  try {
    let res = await getData_reject();
    console.log(res);
  } catch (error) {
    console.log("trycatch err",error);
  }
}
// run_getData_reject_trycatch();

//try catch 无法捕获promise内部的错误
function getData_promiseErr(){
  return new Promise((resolve,reject)=>{
    console.log(xx.yy)
    setTimeout(()=>{
      // console.log(xx.yy)
      resolve("success")
    },1000)
  })
}
async function run_getData_promiseErr_trycatch(){
  try {
    let res = await getData_promiseErr();
    console.log(res);
  } catch (error) {
    console.log("trycatch err",error);
  }
}
// run_getData_promiseErr_trycatch()

//-------------------------------------------------------------------------

//promise catch 可以捕获 promise 的 reject 结果
async function run_getData_reject_promisecatch(){
  let res = await getData_reject().catch(err => err);
  console.log(res);
}
run_getData_reject_promisecatch();

//promise catch 无法捕获promise内部的错误
async function run_getData_promiseErr_promisecatch(){
  let res = await getData_promiseErr().catch(err => err);
  console.log(res);
}
run_getData_promiseErr_promisecatch()
