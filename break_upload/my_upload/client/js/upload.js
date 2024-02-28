const sparkMD5 = new SparkMD5.ArrayBuffer();
const chunkSize = 100 * 1024; // 100kb
const maxChunkCount = 50;

let listHandle = document.querySelector(".upload-item.all .item-handle");
let itemHandle = document.querySelector(".upload-item .item-handle");
let sizeLimit = document.querySelector("#sizeLimit");
let [isSingle, isMulti] = document.querySelectorAll("input[name=isMulti]");
let isSlice = document.querySelector("#isSlice");
let uploadInputEl = document.querySelector(".upload-broke input");
let allProgressBar = document.querySelector(".upload-item.all .progress");
let allProgressLab = document.querySelector(
  ".upload-item.all .upload-progress span"
);

function file2Buffer(file) {
  return new Promise((resolve, reject) => {
    let fileReader = new FileReader();
    fileReader.onload = function (res) {
      resolve(res.target.result);
    };
    fileReader.readAsArrayBuffer(file);
  });
}

/**
 *
 * 如果一个文件特别大，每个切片的所有内容都参与计算的话会很耗时间，所有可以采取以下策略：
 * 1.第一个和最后一个切片的内容全部参与计算
 * 2.中间剩余的切片我们分别在前面、后面和中间取2个字节参与计算
 */
async function getFileHash(fileORbuff) {
  if (fileORbuff instanceof File) {
    fileORbuff = await file2Buffer(fileORbuff);
  }
  sparkMD5.append(fileORbuff);
  return sparkMD5.end();
}

function getSuffix(name) {
  let reg = /\.([0-9A-Za-z]+)$/;
  return reg.exec(name)[1];
}

function throttle(fn, wait) {
  let timer = null;
  return function () {
    let context = this;
    let args = arguments;
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(context, args);
        timer = null;
      }, wait);
    }
  };
}

function complate(info = {}) {
  let index = 0;
  info = Object.assign({}, info);
  return function () {
    index++;
    if (index == info.totalCount) {
      console.timeEnd("useTime");
      mergeFile(info.HASH, info.totalCount);
    }
  };
}

function setProgressBar(proArr, total) {
  let curTotal = proArr.reduce((pre, next) => pre + next, 0);
  let persent = Math.min(1, +(curTotal / total).toFixed(4));
  allProgressBar.style.width = `${(persent * 100).toFixed(2)}%`;
  allProgressLab.innerHTML = `${(persent * 100).toFixed(2)}%`;
}
const thro_setProgressBar = throttle(setProgressBar, 600);
function progress(totalSize) {
  let chunkProArr = [];
  return function (index, loaded, total, persent) {
    chunkProArr[index] = loaded;
    thro_setProgressBar(chunkProArr, totalSize);
  };
}

async function createFormData(file, filename) {
  let formData = new FormData();
  let HASH = filename ? "" : await getFileHash(file);
  filename = filename ? filename : `${HASH}.${getSuffix(file.name)}`;
  formData.append("file", file);
  formData.append("filename", filename);
  return formData;
}

async function uploadSingleFile(file) {
  let progressHandle = progress(file.size);
  let { abort, uploadFile } = request({ onprogress: progressHandle, index: 0 });
  allAbort.push(abort);
  let formData = await createFormData(file);
  console.time("useTime");
  uploadFile("/upload_single_file", formData).then((res) => {
    console.timeEnd("useTime");
  });
}
async function checkFileReady(hashName, suffix) {
  let { get } = request();
  return await get("/has_upload", { fileHash: hashName, suffix });
}
async function uploadFileChunk(chunk, index, info) {
  let { abort, uploadFile } = request({
    onprogress: info.progressHandle,
    index,
  });
  allAbort.push(abort);
  if (info.readyChunks.includes(chunk.filename)) {
    info.complateHandle();
    return;
  }
  let formData = await createFormData(chunk.file, chunk.filename);
  uploadFile("/upload_chunk", formData).then((res) => {
    info.complateHandle();
  });
}
async function mergeFile(hash, count) {
  let { post } = request();
  return await post("/merge_file", { hash, count });
}
async function uploadBigFile(file) {
  let HASH = await getFileHash(file);
  let suffix = getSuffix(file.name);
  let { fileList: readyChunks } = await checkFileReady(HASH, suffix);
  let chunkList = [];
  let count = Math.min(maxChunkCount, Math.ceil(file.size / chunkSize));
  let index = 0;
  let size = Math.ceil(file.size / count);
  while (index < count) {
    chunkList.push({
      file: file.slice(index * size, (index + 1) * size),
      filename: `${HASH}_${index}.${suffix}`,
    });
    index++;
  }
  let complateHandle = complate({ HASH, totalCount: count });
  let progressHandle = progress(file.size);
  let info = {
    readyChunks,
    complateHandle,
    progressHandle,
  };
  console.time("useTime");
  chunkList.forEach((chunk, index) => {
    uploadFileChunk(chunk, index, info);
  });
}

isMulti.addEventListener("change", function () {
  uploadInputEl.multiple = true;
});
isSingle.addEventListener("change", function () {
  uploadInputEl.multiple = false;
});
uploadInputEl.addEventListener("change", async (event) => {
  let files = uploadInputEl.files;
  for (let file of files) {
    if (isSlice.checked) {
      uploadBigFile(file);
    } else {
      uploadSingleFile(file);
    }
  }
  event.target.value = "";
});

function downloadFile() {}
function deleteFile() {}

let allAbort = [];
function pauseFile() {
  console.log(allAbort);
  let temp = allAbort.slice();
  for (let abort of temp) {
    abort();
  }
  allAbort = [];
}
function handleClick(e, isAll) {
  let target = e.target;
  switch (target.id) {
    case "download":
      downloadFile();
      break;
    case "delete":
      deleteFile();
      break;
    case "pause":
      pauseFile();
      break;
    default:
      console.log("not target handle");
      break;
  }
}
listHandle.addEventListener("click", (e) => {
  handleClick(e, true);
});
itemHandle.addEventListener("click", (e) => {
  handleClick(e);
});
