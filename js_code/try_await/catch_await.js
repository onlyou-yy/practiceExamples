function reject_promise(){
  return Promise.reject("fail");
}

function awaitWrap(promise,errHandle = err => [err,null]){
  promise = promise instanceof Promise ? promise : Promise.resolve(promise);
  return promise.then(data => [null,data]).catch(errHandle);
}

async function runTash(task){
  let [err,data] = await awaitWrap(task());
  console.log(err,data);
}

runTash(reject_promise);