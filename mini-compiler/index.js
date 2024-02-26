// let a = 1;
/**
 * 将上面语句进行编译需要经过 词法分析 转化成 tokens 然后将 tokens 通过语法分析
 * 词法分析：将上面语句转化成tokens, 也就是类似这样的数组 ['let','a','=','1'] tokens 是扁平化的;
 * 语法分析：将 tokens 按照语法规则生成 AST（带有结构化和语意化的数据），之后可以将这个AST按照不同的规则转换成不用编程语言的AST
 * 生成代码：将 AST 按照期待的语言生成相应的代码
 */
const tokenizer = require("./tokenizer");
const parser = require("./parser");

const input = `(add 2 (subtract 4 2))`;
console.log(tokenizer(input));
console.log(JSON.stringify(parser(tokenizer(input)), null, 2));
