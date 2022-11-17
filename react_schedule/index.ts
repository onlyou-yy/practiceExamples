import "./style.css";

interface Work{
  count:number
}

const work:Work = {
  count:100
}

const workList:Work[] = [];

const contentBox = document.querySelector("#content");
const btn = document.createElement("button")
btn.innerText = "执行更新"
contentBox?.appendChild(btn);