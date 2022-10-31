const baseURL = "http://192.168.1.8:3000"
const defaultHeaders = {
  "Content-Type":"application/x-www-form-urlencoded"
}
const JsonDataType = {
  "Content-Type":"application/json"
}
const FormDataType = {
  "Content-Type":"multipart/form-data"
}

function request(options = {
  headers:defaultHeaders
}){
  let xhr = new XMLHttpRequest();
  let headers = options.headers || defaultHeaders
  const abort = function(){
    xhr.abort();
  }
  const get = function(api,query = {}){
    let params = new URLSearchParams(query).toString()
    api = api.includes("?") ? api + "&" + params : api + "?" + params;
    headers = defaultDataType
    return send("GET",api,null);
  }
  const post = function(api,data){
    headers = JsonDataType
    return send("POST",api,data)
  }
  const uploadFile = function(api,data){
    headers = FormDataType
    return send("POST",api,data);
  }
  function send(method,api,data){
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
  return {
    abort,get,post,uploadFile
  }
}
