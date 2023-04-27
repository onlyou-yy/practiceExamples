const sparkMD5 = new SparkMD5.ArrayBuffer();
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

async function getFileMd5(){
  let fileEl = document.querySelector("#file")
  let resEl = document.querySelector("#res")
  let file = fileEl.files[0]
  let HASH = await getFileHash(file);
  console.log(HASH);
  resEl.innerHTML = resEl.innerText + "<br />" + HASH
}