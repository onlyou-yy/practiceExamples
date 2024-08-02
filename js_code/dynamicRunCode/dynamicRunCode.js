const a = 1;
const code = "console.log('a',a)";

const exec = function (code) {
  const a = 2;
  console.log(`${"-".repeat(20)} eval ${"-".repeat(20)}`);
  eval(code); // 同步执行，局部作用域

  setTimeout(code); // 异步执行，全局作用域，一些浏览器不执行
  console.log(`${"-".repeat(20)} setTimeout ${"-".repeat(20)}`);

  // 同步执行，全局作用域
  console.log(`${"-".repeat(20)} script ${"-".repeat(20)}`);
  const script = document.createElement("script");
  script.innerHTML = code;
  document.body.appendChild(script);

  console.log(`${"-".repeat(20)} Function ${"-".repeat(20)}`);
  new Function(code)(); // 同步执行，全局作用域
};

exec(code);
