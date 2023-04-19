let crypo = md5("www.itgcb.com")
let fields = ["time", "userid", "flag"]
let sortFields = fields.sort();

function genUrl() {
  let param = {
    time: Date.now(),
    userid: document.querySelector("#userid").value || "430281200303313916",
    customer_code: "ld",
    flag: "itgcb.com",
  }
  let paramStr = "";
  for (let i = 0; i < sortFields.length; i++) {
    let field = sortFields[i]
    paramStr += `${field}=${param[field]}`;
    if (i < sortFields.length - 1) paramStr += "&";
  }
  console.log("paramStr", paramStr);

  let paramStrEncry = paramStr + `&key=${crypo}`;
  let sign = md5(paramStrEncry).toUpperCase();
  console.log("sign", sign)

  let postParams = {
    ...param,
    sign
  }
  console.log("postParams", postParams)

  let urlObj = new URLSearchParams({
    // type: 'authorization',
    type: 'ld',
    time: param.time,
    userid: param.userid,
    username: document.querySelector("#username").value || '金阳',
    avatar: document.querySelector("#avatar").value || 'https://picsum.photos/50/50',
    sign,
  })
  let queryParams = urlObj.toString();
  let url = `https://testwap.itgcb.com?${queryParams}`

  let container = document.querySelector("#container");
  let a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.innerText = url;
  container.innerHTML = "";
  container.appendChild(a);


  console.log("#".repeat(100));
  console.log(url);
}

