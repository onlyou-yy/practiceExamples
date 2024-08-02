// 最长递增子序列
function LIS(nums) {
  if (nums.length === 0) return [];
  const result = [[nums[0]]];
  for (let i = 0; i < nums.length; i++) {
    const num = nums[i];
    update(num);
  }
  function update(num) {
    for (let i = result.length - 1; i >= 0; i--) {
      const line = result[i];
      const tail = line[line.length - 1];
      if (num > tail) {
        result[i + 1] = [...line, num];
        break;
      } else if (num < tail && i === 0) {
        result[i] = [num];
      }
    }
  }
  return result[result.length - 1];
}

/**
 * [4, 5, 1, 2, 7, 6, 3, 9]
 * 一个个遍历，第一个是4
 * 4
 * 再看第二个是 5，比 4 大，直接拼接
 * 4，5
 * 第三个为1，比4，5小，那么直接替换第一个结果
 * 1
 * 4，5
 * 第四个为2，比5小，比1大，那么拼接起来替换掉下一行
 * 1
 * 1，2
 */
console.log(LIS([4, 5, 1, 2, 7, 6, 3, 9]));
