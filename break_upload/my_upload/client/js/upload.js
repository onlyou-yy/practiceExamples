const sparkMD5 = new SparkMD5.ArrayBuffer();
let listHandle = document.querySelector(".upload-item.all .item-handle")
let itemHandle = document.querySelector(".upload-item .item-handle")
let uploadInputEl = document.querySelector(".upload-broke input");
const chunkSize = 100 * 1024 // 100kb
const maxChunkCount = 100

function file2Buffer(file){
  return new Promise((resolve,reject)=>{
    let fileReader = new FileReader()
    fileReader.onload = function(res){
      resolve(res.target.result);
    }
    fileReader.readAsArrayBuffer(file)
  })
}

async function getFileHash(fileORbuff){
  if(fileORbuff instanceof File){
    fileORbuff = await file2Buffer(fileORbuff);
  }
  sparkMD5.append(fileORbuff);
  return sparkMD5.end();
}

function getSuffix(name){
  let reg = /\.([0-9A-Za-z]+)$/
  return reg.exec(name)[1];
}

async function createFormData(file,filename){
  let formData = new FormData()
  let HASH = filename ? "" : await getFileHash(file);
  filename = filename ? filename : `${HASH}.${getSuffix(file.name)}`
  formData.append("file",file)
  formData.append("filename",filename)
  return formData
}
function complate(info = {}){
  let index = 0
  info = Object.assign({},info)
  return function complateHandle(){
    index++
    if(index == info.totalCount){
      console.log("upload success")
      mergeFile(info.HASH,info.totalCount);
    }
  }
}
async function uploadSingleFile(file){
  let {abort,uploadFile} = request();
  let formData = await createFormData(file)
  uploadFile('/upload_single_file',formData).then(res=>{
    console.log(res)
  })
}
async function checkFileReady(hashName,suffix){
  let {get} = request();
  return await get("/has_upload",{fileHash:hashName,suffix})   
}
async function uploadFileChunk(chunk,info,complateHandle){
  let {abort,uploadFile} = request() 
  if(info.readyChunks.includes(chunk.filename)){
    complateHandle()
    return
  }
  let formData = await createFormData(chunk.file,chunk.filename)
  uploadFile("/upload_chunk",formData).then(res=>{
    complateHandle();
  })
}
async function mergeFile(hash,count){
  let {post} = request();
  return await post("/merge_file",{hash,count}) 
}
async function uploadBigFile(file){
  let HASH = await getFileHash(file)
  let suffix = getSuffix(file.name)
  let {fileList:readyChunks} = await checkFileReady(HASH,suffix);
  let chunkList = [];
  let count = Math.min(maxChunkCount,Math.ceil(file.size / chunkSize));
  let index = 0
  while(index < count){
    chunkList.push({
      file:file.slice(index*chunkSize,(index + 1) * chunkSize),
      filename:`${HASH}_${index}.${suffix}`
    })
    index++;
  }
  let info = {HASH,readyChunks,totalCount:count}
  let complateHandle = complate(info)
  chunkList.forEach(chunk => {
    uploadFileChunk(chunk,info,complateHandle);
  })
}

uploadInputEl.addEventListener("change",async (event)=>{
  let file = uploadInputEl.files[0]
  // uploadSingleFile(file)
  uploadBigFile(file)
  event.target.value = "";
})

function downloadFile(){}
function deleteFile(){}
function pauseFile(){}
function handleClick(e,isAll){
  let target = e.currentTarget;
  switch(target.id){
    case "download":
      downloadFile()
      break;
    case "delete":
      deleteFile();
      break;
    case "pause":
      pauseFile();
      break;
    default:
      console.log("not target handle")
      break;
  }
}
listHandle.addEventListener("click",(e)=>{
  handleClick(e,true)
})
itemHandle.addEventListener("click",(e)=>{
  handleClick(e)
})