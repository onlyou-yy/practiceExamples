const baseURL = "http://172.16.16.29:3000"
const defaultDataType = {
  "Content-Type":"application/x-www-form-urlencoded"
}
const JsonDataType = {
  "Content-Type":"application/json"
}
const FormDataType = {
  //传递表单数据的时候会自动设置这个请求头，如果这里再次设置就会覆盖，导致boundary丢失
  // "Content-Type":"multipart/form-data"
}

function request(options = {
  onprogress:()=>{}
}){
  let xhr = new XMLHttpRequest();
  let headers = {}
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
    return send("POST",api,JSON.stringify(data))
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
          resolve(JSON.parse(this.response));
        }
      }
      xhr.upload.onprogress = function(e){
        if(options.onprogress){
          options.onprogress(+(e.loaded / e.total).toFixed(3),e.loaded,e.total);
        }
      }
      xhr.send(data);
    })
  }
  return {
    abort,get,post,uploadFile
  }
}
