// 语法分析

module.exports = function parser(tokens) {
  let current = 0;

  function walk() {
    let token = tokens[current];

    if (token.type === "number") {
      current++;

      return {
        type: "NumberLiteral",
        name: token.value,
      };
    }

    if (token.type === "string") {
      current++;

      return {
        type: "StringLiteral",
        name: token.value,
      };
    }

    /** 创建层级关系 */
    if (token.type === "paren" && token.value === "(") {
      token = tokens[++current];

      let node = {
        type: "CallExpression",
        name: token.value,
        params: [],
      };

      token = tokens[++current];

      // 当不是括号或者是右括号时结束(避免双重括号的情况)
      while (
        token &&
        (token.type !== "paren" ||
          (token.type === "paren" && token.value === "("))
      ) {
        node.params.push(walk());
        token = tokens[current];
      }

      current++;

      return node;
    }
  }

  let ast = {
    type: "Program",
    body: [],
  };

  while (current < tokens.length) {
    ast.body.push(walk());
  }

  return ast;
};
