async function getDataUrl(url){
  try {
    const blob = await new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.responseType = "blob";
      xhr.open("GET", url, true);
      xhr.setRequestHeader("Cache-Control", "no-cache");
      xhr.onload = (e) => {
        resolve(xhr.response);
      };
      xhr.onerror = (e_1) => {
        reject(e_1);
      };
      xhr.send();
    });
    return await new Promise((resolve_1, reject_1) => {
      let fileReader = new FileReader();
      fileReader.onload = (e_2) => {
        resolve_1(fileReader.result);
      };
      fileReader.onerror = (e_3) => {
        reject_1(e_3);
      };
      fileReader.readAsDataURL(blob);
    });
  } catch (err) {
    return console.log(err);
  }
}

async function createTemplate(data){
  const {size,width,height,fontSize,iconUrl,bgUrl,name,code} = data;
  const bgDataUrl = await genImgDataUrlByImgUrl(bgUrl);
  const iconDataUrl = await genImgDataUrlByImgUrl(iconUrl);
  const htmlString = `
  <svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <style>
      *{
        box-sizing: border-box;
      }
      .qrcode,.img-box{
        position: absolute;
        width: ${size}px;
        height: ${size}px;
      }
      .qrcode{
        height: ${height}px;
        font-size:${fontSize}px;
      }
      .img-bg{
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .center{
        width: 45.5%;
        height: 45.5%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
      }
      .img-icon{
        border-radius: 100%;
        object-fit: cover;
      }
      .bg-white{
        border-radius: 100%;
        background-color: white;
      }
      .qrcode-name{
        text-align: center;
        font-size: 2em;
        font-weight: bold;
        padding: 10px 5%;
        color: black;
        position: absolute;
        width: 100%;
        bottom: -24%;
        left: 0%;
      }
      .qrcode-des{
        text-align: center;
        font-size: 1.5em;
        font-weight: 500;
        padding: 10px 10%;
        color: black;
        position: absolute;
        width: 100%;
        bottom: -12%;
        left: 0%;
      }
      .text-ellipsis{
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
    </style>
    <foreignObject x="0" y="0" width="${width}" height="${height}">
      <div class="qrcode" id="qrcode">
        <div class="img-box">
          <img src="${bgDataUrl}" class="img-bg" alt=""></img>
          <div class="center bg-white"></div> 
          <img class="center img-icon" src="${iconDataUrl}"></img>
          <div class="qrcode-des text-ellipsis">${code}</div>
          <div class="qrcode-name text-ellipsis">${name}</div>
        </div>
      </div>
    </foreignObject>
  </svg>
  `;
  const template = '<?xml version="1.0" standalone="no"?>\r\n' + htmlString;
  return template;
}

function genVirtualDataUrl(template){
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(template);
}

function genImgDataUrlByImgUrl(url,width,height){
  return new Promise((resolve,reject)=>{
    const canvas = document.createElement('canvas')
    const context = canvas.getContext("2d");
    const img = new Image()
    img.setAttribute('crossOrigin', 'anonymous')
    img.onload = () => {
      canvas.width = width || img.naturalWidth
      canvas.height = height || img.naturalHeight
      context.drawImage(img, 0, 0)
      const imgDataUrl = canvas.toDataURL("image/jpeg");
      resolve(imgDataUrl)
    }
    img.onerror = (e)=>{
      reject(e);
    }
    img.src = url
  })
}

function downloadImg(imgDataUrl,name){
  let a = document.createElement('a')
  a.download = `${name}.jpg`;
  a.href = imgDataUrl;
  a.click()
}

async function genImg(options = {
  size:430,
  iconUrl:"",
  bgUrl:"",
  name:"",
  code:"",
}){
  const {size} = options;
  const width = size;
  const height = ~~(size * 1.233);
  const fontSize = ~~(0.0372 * size);
  const config = Object.assign({},options,{
    width,
    height,
    fontSize,
  })
  const template = await createTemplate(config);
  const virtualDataUrl = genVirtualDataUrl(template);
  const imgDataUrl = await genImgDataUrlByImgUrl(virtualDataUrl,width,height);
  document.querySelector("#preview").src = imgDataUrl;
  downloadImg(imgDataUrl,"jack");
}