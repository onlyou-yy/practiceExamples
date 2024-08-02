// 最久未使用
// 有一块固定大小的缓存区域，经常使用的数据放在区域的前面，最久未使用的区域放后面，当存储达到上限后有新的数据要进入的时候，将最久未使用的区域去除
class LRUMapCache {
  constructor(length) {
    this.map = new Map();
    this.length = length;
  }
  has(key) {
    return this.map.has(key);
  }
  get(key) {
    if (this.has(key)) {
      const value = this.map.get(key);
      this.map.delete(key);
      this.map.set(key, value);
    }
    return this.map.get(key);
  }
  set(key, value) {
    
  }
}
