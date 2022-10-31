const sparkMD5 = new SparkMD5.ArrayBuffer();
let uploadInputEl = document.querySelector(".upload-broke input");

function file2Buffer(file){
  return new Promise((resolve,reject)=>{
    let fileReader = new FileReader()
    fileReader.onload = function(res){
      resolve(res.target.result);
    }
    fileReader.readAsArrayBuffer(file)
  })
}

async function getFileHash(file){
  if(file instanceof File){
    file = await file2Buffer(file);
  }
  sparkMD5.append(file);
  return sparkMD5.end();
} 

uploadInputEl.addEventListener("change",async (event)=>{
  let file = uploadInputEl.files[0]
  let suffix = /\.([0-9a-zA-Z]+)$/.exec(file.name)[1]
  let HASH = await getFileHash(file);
  
  let fd = new FormData();
  fd.append("file",file);
  fd.append("filename",`${HASH}.${suffix}`);
  request("/upload_sigle_file",fd,{method:"POST",}).then(res=>{
    console.log(res);
  })
  event.target.value = "";
})

let allDownloadBtn = document.querySelector(".upload-item.all .download")
let allDeleteBtn = document.querySelector(".upload-item.all .delete")

allDownloadBtn?.addEventListener("click",()=>{
  request('/get_test?name=jack',null,{
    headers:{
      "Content-Type":"application/x-www-form-urlencoded"
    }
  }).then(res=>{
    console.log(res);
  })
})

allDeleteBtn?.addEventListener("click",()=>{
  request('/post_test',JSON.stringify({name:"jack"}),{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    }
  }).then(res=>{
    console.log(res);
  })
})