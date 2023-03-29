async function sleep(time,name = "test"){
  return new Promise((resolve,reject)=>{
    setTimeout(() => {
      console.log(time,name)
      if(time == 3){
        reject({time,name})
      }else{
        resolve({time,name})
      }
    }, time * 1000);
  })
}

async function asyncPool({limit,items}){
  const pool = new Set();//并发池，做并发限制
  const promises = [];//收集全部promise，方便后续拿到结果
  for(const item of items){
    const fn = async task => await task();
    const promise = fn(item);
    const clean = ()=>pool.delete(promise);
    promise.then(clean,clean);//一定要将错误也捕获了
    promises.push(promise);
    pool.add(promise);
    if(pool.size >= limit){
      await Promise.race(pool);
    }
  }
  return Promise.allSettled(promises);
}

const items = [
  ()=>sleep(1,"吃饭"),
  ()=>sleep(2,"睡觉"),
  ()=>sleep(3,"打豆豆"),
  ()=>sleep(5,"看片"),
  ()=>sleep(2,"睡觉"),
]

asyncPool({limit:4,items}).then(res=>{
  console.log(res);
})