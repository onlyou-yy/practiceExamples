const os = require("os");
const multiparty = require("multiparty");
const SparkMD5 = require("spark-md5");
const fs = require("fs");
const path = require("path");
const uploadDir = path.resolve(__dirname,'./upload');
const PORT = 3000
const HOSTNAME = `http://${getIpAddress()}:${PORT}`;

exports.PORT = PORT;
exports.HOSTNAME = HOSTNAME;
exports.uploadDir = uploadDir;

/**
 * 获取地址
 * @returns ipv4地址
 */
function getIpAddress(){
  let ifaces = os.networkInterfaces();
  
  for(let dev in ifaces){
    let iface = ifaces[dev];
    
    for(let face of iface){
      let {address,internal,family} = face
      if(family == "IPv4" && address !== "127.0.0.1" && !internal){
        return address
      }
    }
  }
}
exports.getIpAddress = getIpAddress

exports.sleep = function(time = 1000){
  return new Promise((resolve)=>{
    setTimeout(() => {
      resolve()
    }, time);
  })
}

exports.parseFormData = function(req){
  return new Promise((resolve,reject)=>{
    new multiparty.Form({
      maxFilesSize: 200 * 1024 * 1024
    }).parse(req,(err,fields,{file:files})=>{
      if(err){
        reject(err);
        return
      }
      resolve({
        fields,
        files
      })
    })
  })
}

exports.getSuffix = function(str){
  let [_,suffix] = /\.([0-9A-Za-z]+)$/.exec(str);
  return suffix;
}

function file2Buffer(file){
  return new Promise((resolve,reject)=>{
    let fileReader = new FileReader()
    fileReader.onload = function(res){
      resolve(res.target.result);
    }
    fileReader.readAsArrayBuffer(file)
  })
}
exports.file2Buffer = file2Buffer

exports.getFileHASH = async function(file){
  let sparkMD5 = new SparkMD5.ArrayBuffer();
  let buffer = await file2Buffer(file)
  sparkMD5.append(buffer);
  return sparkMD5.end();
}

function sourceIsExists(name){
  return new Promise((resolve=>{
    fs.access(name,fs.constants.F_OK,err => {
      if(err){
        resolve(false);
        return
      }
      resolve(true);
    })
  }))
}
exports.sourceIsExists = sourceIsExists

exports.saveFileTo = function(file,path){
  return new Promise((resolve,reject)=>{
    let fr = fs.createReadStream(file.path)
    let wr = fs.createWriteStream(path)
    fr.pipe(wr)
    fr.on("end",()=>{
      resolve()
      fs.unlinkSync(file.path);
    })
  })
}

exports.mergeFile = function(HASH,count){
  return new Promise(async (resolve,reject)=>{
    let sliceDir = `${uploadDir}/${HASH}`
    let hasDir = await sourceIsExists(sliceDir)
    if(!hasDir){
      resolve({
        code: 501,
        codeText: "file slice dir is not exists"
      })
      return;
    }
    let fileList = fs.readdirSync(sliceDir)
    if(fileList.length < count){
      resolve({
        code: 501,
        codeText: "file slice has not be uploaded"
      })
      return;
    }
    let suffix = /\.([0-9A-Za-z])/.exec(fileList[0])[1]
    let filePath = `${uploadDir}/${HASH}.${suffix}`
    // if(fs.existsSync(filePath)) fs.unlinkSync(filePath)
    fileList.sort((a,b)=>{
      let reg = /_(\d+)/
      return reg.exec(a)[1] - reg.exec(b)[1]
    }).forEach(item => {
      fs.appendFileSync(filePath,fs.readFileSync(`${uploadDir}/${HASH}/${item}`))
    })
    fs.rmdirSync(sliceDir)
    resolve({
      code: 501,
      codeText: "merge success",
      filename:`${HASH}.${suffix}`,
      servicePath:`${uploadDir}/${HASH}.${suffix}`.replace(uploadDir,HOSTNAME)
    })
  })
}