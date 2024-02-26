// 词法分析
// const input = `(add 2 (subtract 4 2))`;
// 按照深度遍历优先，先执行 内部 （） 包裹的代码

module.exports = function tokenizer(input) {
  let current = 0;
  const tokens = [];

  /** 可以使用正则，也可以逐字比较 */
  while (current < input.length) {
    let char = input[current];
    if (char === "(" || char === ")") {
      tokens.push({
        type: "paren",
        value: char,
      });

      current++;
      continue;
    }

    // 对于某一类比较小的点可以使用正则
    const WHITE_SPACE = /\s/;
    if (WHITE_SPACE.test(char)) {
      current++;
      continue;
    }

    const NUMBER = /[0-9]/;
    if (NUMBER.test(char)) {
      let value = "";
      while (NUMBER.test(char)) {
        value += char;
        char = input[++current];
      }

      tokens.push({
        type: "number",
        value,
      });

      continue;
    }

    if (char === '"') {
      let value = "";

      char = input[++current];

      while (char !== '"') {
        value += char;
        char = input[++current];
      }

      tokens.push({
        type: "string",
        value,
      });

      char = input[++current];

      continue;
    }

    const LETTERS = /[a-z]/i;
    if (LETTERS.test(char)) {
      let value = "";
      while (LETTERS.test(char)) {
        value += char;
        char = input[++current];
      }

      tokens.push({
        type: "name",
        value,
      });

      continue;
    }

    throw new TypeError("dont knowledge this char");
  }

  return tokens;
};
