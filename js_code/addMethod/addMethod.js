/**
 * 函数重载
 * @param {} object
 * @param {*} name
 * @param {*} fn
 */
function addMethod(object, name, fn) {
  var old = object[name];
  object[name] = function () {
    if (fn.length == arguments.length) return fn.apply(this, arguments);
    else if (typeof old === "function") return old.apply(this, arguments);
  };
}
