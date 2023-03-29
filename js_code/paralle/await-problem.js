function testPromise(isErr){
  // 未处理错误 await 会报错
  return new Promise((resolve,reject)=>{
    isErr ? reject({msg:"error"}) : resolve({msg:"success"})
  });

  // return new Promise((resolve,reject)=>{
  //   isErr ? reject({msg:"error"}) : resolve({msg:"success"})
  // }).catch(err=>err);

  // return new Promise((resolve,reject)=>{
  //   isErr ? reject({msg:"error"}) : resolve({msg:"success"})
  // }).then(res=>res,err=>err);
}

async function asyncFn(){
  const res = await testPromise(true)
  console.log(res)
}

asyncFn()