const {
  PORT,
  HOSTNAME,
  uploadDir,
  getIpAddress, 
  parseFormData, 
  getSuffix, 
  getFileHASH, 
  sourceIsExists, 
  saveFileTo, 
  mergeFile
} = require("./utils");
const path = require("path");

const express = require("express"),
      fs = require("fs"),
      bodyParser = require("body-parser"),
      multiparty = require("multiparty"),
      SparkMD5 = require("spark-md5");

const app = express();

// https://blog.csdn.net/github_38589282/article/details/79270654
process.on('unhandledRejection', rej => console.warn('全局捕获Rejection', rej));

app.listen(PORT,()=>{
  console.log('服务器开启成功：' + HOSTNAME);
})

app.use("/upload",express.static('upload'))

app.use((req,res,next)=>{
  res.header("Access-Control-Allow-Origin","*");
  res.append('Access-Control-Allow-Methods', 'OPTIONS, GET, PUT, POST, DELETE')
  res.append('Access-Control-Allow-Headers', '*')
  req.method === "OPTIONS" ? res.json("all method"):next();
})

app.use(bodyParser.urlencoded({extended:false,limit:"1024mb"}))
app.use(bodyParser.json({extended:false,limit:"1024mb"}))
app.use(bodyParser.raw({extended:false,limit:"1024mb"}))

app.post("/upload_single_file",(req,res)=>{
  new multiparty.Form({
    uploadDir
  }).parse(req,(err,fields,files)=>{
    if(err){
      console.log(err)
      res.json({
        code:400,
        codeText:"upload error",
      })
      return
    }
    res.json({
      code:200,
      codeText:"upload success",
      originalFilename:files.file[0].originalFilename,
      servicePath:files.file[0].path.replace(__dirname,HOSTNAME)
    })
  });
})

app.get("/has_upload",async (req,res)=>{
  let HASH = req.query.fileHash
  let fileList = []
  let hasFile = await sourceIsExists(`${uploadDir}/${HASH}`)
  if(hasFile){
    fileList = fs.readdirSync(`${uploadDir}/${HASH}`).sort((a,b)=>{
      let indexReg = /_(\d)/
      return indexReg.exec(a)[1] - indexReg.exec(b)[1]
    })
  }
  res.json({
    code:200,
    codeText:"",
    fileList
  })
})

app.post("/upload_chunk",async (req,res)=>{
  let {fields,files} = await parseFormData(req)
  let file = files[0]
  let filename = fields.filename[0]
  let [_,HASH,index] = /^([^_]+)_(\d+)/.exec(filename)
  let dirPath = `${uploadDir}/${HASH}`
  if(!fs.existsSync(dirPath)){
    fs.mkdirSync(dirPath)
  }
  let filePath = `${uploadDir}/${HASH}/${filename}`
  try {
    if(!await sourceIsExists(filePath)){
      await saveFileTo(file,filePath)
    }
    res.json({
      code:200,
      codeText:"upload success",
      originalFilename:filename,
    })
  } catch (error) {
    console.log(error);
    res.json({
      code:500,
      codeText:"upload error",
      originalFilename:filename,
    })
  }
})

app.post("/merge_file",async (req,res)=>{
  let {hash,count} = req.body
  try {
    let msg = await mergeFile(hash,count);
    res.json(msg);
  } catch (error) {
    res.json({
      code:500,
      codeText:"server error"
    })
  }
})
