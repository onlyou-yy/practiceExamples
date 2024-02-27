// plugin 执行钩子，visitor观察者模式 visitor 钩子
function traverser(ast, visitor) {
  function traverserArray(array, parent) {
    array.forEach((node) => {
      traverserNode(node, parent);
    });
  }

  function traverserNode(node, parent) {
    let methods = visitor[node.type]; // 每个节点被处理的勾子函数

    if (methods && methods.enter) {
      methods.enter(node, parent);
    }

    switch (node.type) {
      case "Program":
        traverserArray(node.body, node);
        break;
      case "CallExpression":
        traverserArray(node.params, node);
        break;
      case "NumberLiteral":
      case "StringLiteral":
        break;
      default:
        throw new TypeError("dont know Type");
    }

    if (methods && methods.exit) {
      methods.exit(node, parent);
    }
  }

  traverserNode(ast, null);
}

module.exports = function transformer(ast) {
  let newAst = {
    type: "Program",
    body: [],
  };

  ast._context = newAst.body;

  traverser(ast, {
    NumberLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: "NumberLiteral",
          value: node.name,
        });
      },
    },
    StringLiteral: {
      enter(node, parent) {
        parent._context.push({
          type: "NumberLiteral",
          value: node.name,
        });
      },
    },
    CallExpression: {
      enter(node, parent) {
        let expression = {
          type: "CallExpression",
          callee: {
            type: "Identifier",
            name: node.name,
          },
          arguments: [],
        };

        node._context = expression.arguments;

        if (parent.type !== "CallExpression") {
          expression = {
            type: "ExpressionStatement",
            expression: expression,
          };
        }

        parent._context.push(expression);
      },
    },
  });

  return newAst;
};
