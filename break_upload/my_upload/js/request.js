const baseURL = "http://192.168.1.8:3000"
const defaultHeaders = {
  // "Content-Type":"multipart/form-data"
}

function request(api,data,options = {
  method:"GET",
  headers:defaultHeaders
}){
  let xhr = new XMLHttpRequest();
  let headers = options.headers || defaultHeaders
  let method = options.method || "GET";
  const abort = function(){
    xhr.abort();
  }
  return new Promise((resolve,reject)=>{
    xhr.open(method,`${baseURL}${api}`)
    for(let key in headers){
      xhr.setRequestHeader(key,headers[key])
    }
    xhr.onreadystatechange = function(){
      if(this.readyState === XMLHttpRequest.DONE && this.status == 200){
        resolve(this.response);
      }
    }
    xhr.send(data);
  })
}
